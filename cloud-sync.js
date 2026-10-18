/* Supabase 同步：每个作答/错题为独立行，跨设备更新不同题目不会覆盖整份试卷。 */
(() => {
  'use strict';
  const config=window.STUDY_SYNC_CONFIG || {};
  const app=window.practiceApp;
  const panel=document.querySelector('#cloudSync');
  if(!app || !panel)return;
  const categories=['answers','wrong','submittedDays','dailyPapers','dailyReviews','reviewHistory'];
  const sessionKey='it-teacher-sync-session-v1';
  const ownerKey='it-teacher-sync-owner-v1';
  const base=String(config.url || '').replace(/\/+$/,'');
  const key=String(config.publishableKey || '');
  const configured=/^https:\/\/[^/?#]+$/.test(base) && key.length>15;
  let session=null,ready=false,syncingRemote=false,cursor=null,shadow=new Map(),pending=new Map(),flushTimer=null,flushPromise=null,pullPromise=null;
  const status=panel.querySelector('#cloudStatus');
  const form=panel.querySelector('#cloudForm');
  const logout=panel.querySelector('#cloudLogout');
  const setStatus=(message,kind='')=>{status.textContent=message;status.dataset.state=kind;};
  const rowKey=(category,itemKey)=>category+'\u0000'+itemKey;
  const flatten=(data)=>{
    const rows=new Map();
    for(const category of categories){
      const values=data?.[category];
      if(!values || typeof values!=='object' || Array.isArray(values))continue;
      for(const [itemKey,value] of Object.entries(values))rows.set(rowKey(category,itemKey),{category,item_key:itemKey,value,deleted:false});
    }
    return rows;
  };
  const same=(a,b)=>a?.deleted===b?.deleted && JSON.stringify(a?.value)===JSON.stringify(b?.value);
  const changes=(before,after)=>new Set([...before.keys(),...after.keys()].filter(id=>!same(before.get(id),after.get(id))));
  const storeSession=(data)=>{
    const record=data?.session || data;
    if(!record?.access_token || !record?.refresh_token)return false;
    session={access_token:record.access_token,refresh_token:record.refresh_token,
      expiresAt:Date.now()+(Number(record.expires_in)||3600)*1000,
      user:record.user || session?.user || null};
    localStorage.setItem(sessionKey,JSON.stringify(session));
    return true;
  };
  const clearSession=()=>{session=null;ready=false;pending.clear();localStorage.removeItem(sessionKey);showAccount();};
  const showAccount=()=>{
    form.hidden=!!session;
    logout.hidden=!session;
    panel.querySelector('#cloudAccount').textContent=session?.user?.email || '';
  };
  async function request(path,{method='GET',body,authenticated=false,headers={}}={}){
    const response=await fetch(base+path,{method,headers:{apikey:key,Authorization:'Bearer '+(authenticated?session.access_token:key),
      ...(body?{'Content-Type':'application/json'}:{}),...headers},body:body?JSON.stringify(body):undefined});
    const result=response.status===204?null:await response.json().catch(()=>null);
    if(!response.ok)throw new Error(result?.msg || result?.message || result?.error_description || result?.error || '请求失败（'+response.status+'）');
    return result;
  }
  let refreshPromise=null;
  async function ensureSession(){
    if(!session)throw new Error('请先登录');
    if(Date.now()<session.expiresAt-60000)return;
    if(!refreshPromise)refreshPromise=request('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:{refresh_token:session.refresh_token}})
      .then(data=>{if(!storeSession(data))throw new Error('登录已过期');})
      .finally(()=>{refreshPromise=null;});
    await refreshPromise;
  }
  async function signedRequest(path,options={}){await ensureSession();return request(path,{...options,authenticated:true});}
  function ownerCheck(){
    const userId=session?.user?.id;
    if(!userId)throw new Error('登录响应没有用户标识');
    const oldOwner=localStorage.getItem(ownerKey);
    if(oldOwner && oldOwner!==userId){
      localStorage.setItem(app.key+'-account-'+oldOwner,JSON.stringify(app.getState()));
      localStorage.setItem(app.key,localStorage.getItem(app.key+'-account-'+userId)||'{}');
      localStorage.setItem(ownerKey,userId);
      location.reload();
      return false;
    }
    localStorage.setItem(ownerKey,userId);
    return true;
  }
  function onLocalSave(data){
    if(!ready || !session || syncingRemote)return;
    const next=flatten(data);
    let changed=false;
    for(const [id,row] of next)if(!same(row,shadow.get(id))){pending.set(id,row);changed=true;}
    for(const [id,row] of shadow)if(!next.has(id)){pending.set(id,{category:row.category,item_key:row.item_key,value:null,deleted:true});changed=true;}
    shadow=next;
    if(!changed)return;
    clearTimeout(flushTimer);
    flushTimer=setTimeout(()=>flush().catch(showError),800);
    setStatus('有新作答，正在保存到云端…','working');
  }
  async function flush(){
    if(flushPromise)return flushPromise;
    flushPromise=(async()=>{
      while(pending.size){
        const batch=[...pending.entries()].slice(0,100);
        for(const [id] of batch)pending.delete(id);
        try{
          await signedRequest('/rest/v1/study_items?on_conflict=user_id,category,item_key',{
            method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},
            body:batch.map(([,row])=>({user_id:session.user.id,...row}))});
        }catch(error){
          for(const [id,row] of batch)if(!pending.has(id))pending.set(id,row);
          throw error;
        }
      }
      setStatus('已同步 · '+(session.user.email||'当前账号'),'ok');
    })().finally(()=>{flushPromise=null;});
    return flushPromise;
  }
  async function readChanges(){
    const rows=[];
    for(let offset=0;;offset+=500){
      const query=new URLSearchParams({select:'category,item_key,value,deleted,updated_at',
        user_id:'eq.'+session.user.id,order:'updated_at.asc,category.asc,item_key.asc',limit:'500',offset:String(offset)});
      if(cursor)query.set('updated_at','gte.'+cursor);
      const page=await signedRequest('/rest/v1/study_items?'+query);
      if(!Array.isArray(page))throw new Error('云端返回了意外的数据');
      rows.push(...page);
      if(page.length<500)break;
    }
    if(rows.length)cursor=rows[rows.length-1].updated_at;
    return rows;
  }
  function applyRow(data,row){
    if(!categories.includes(row.category) || typeof row.item_key!=='string')return;
    data[row.category] ||= {};
    if(row.deleted)delete data[row.category][row.item_key];
    else data[row.category][row.item_key]=row.value;
  }
  async function pull(initial=false){
    if(pullPromise)return pullPromise;
    pullPromise=(async()=>{
      if(!initial)await flush();
      syncingRemote=true;
      const started=flatten(app.getState());
      setStatus('正在读取云端记录…','working');
      const rows=await readChanges();
      const local=app.getState();
      const localRows=flatten(local);
      const edited=changes(started,localRows);
      const merged=structuredClone(local);
      const before=JSON.stringify(merged);
      const remoteIds=new Set();
      for(const row of rows){
        const id=rowKey(row.category,row.item_key);
        remoteIds.add(id);
        if(pending.has(id) || edited.has(id)){
          if(edited.has(id))pending.set(id,localRows.get(id)||{category:row.category,item_key:row.item_key,value:null,deleted:true});
          continue;
        }
        applyRow(merged,row);
      }
      if(initial){
        for(const [id,row] of localRows)if(!remoteIds.has(id))pending.set(id,row);
      }
      await flush();
      const latest=flatten(app.getState());
      for(const id of changes(localRows,latest)){
        const row=latest.get(id)||{category:id.split('\u0000')[0],item_key:id.split('\u0000')[1],value:null,deleted:true};
        applyRow(merged,row);
        pending.set(id,row);
      }
      await flush();
      shadow=flatten(merged);
      ready=true;
      if(JSON.stringify(merged)!==before){
        setStatus('云端记录已更新，正在刷新题目…','working');
        app.applyCloudState(merged);
      }else setStatus('已同步 · '+(session.user.email||'当前账号'),'ok');
    })().catch(error=>{setStatus('同步失败：'+error.message,'error');throw error;})
      .finally(()=>{syncingRemote=false;pullPromise=null;if(ready)onLocalSave(app.getState());});
    return pullPromise;
  }
  function showError(error){setStatus('同步失败：'+error.message+'。本机作答仍已保存。','error');}
  let startPromise=null;
  function start(){
    if(!session || startPromise)return startPromise;
    startPromise=(async()=>{
      try{
        await ensureSession();
        if(!session.user?.id)session.user=await signedRequest('/auth/v1/user');
        localStorage.setItem(sessionKey,JSON.stringify(session));
        if(!ownerCheck())return;
        showAccount();
        await pull(true);
      }catch(error){showError(error);}
    })().finally(()=>{startPromise=null;});
    return startPromise;
  }
  async function authenticate(mode){
    const emailInput=form.elements.namedItem('email'),passwordInput=form.elements.namedItem('password');
    const email=emailInput.value.trim(),password=passwordInput.value;
    if(!email || !password)return;
    form.querySelectorAll('button').forEach(button=>button.disabled=true);
    setStatus(mode==='signup'?'正在注册…':'正在登录…','working');
    try{
      const path=mode==='signup'?'/auth/v1/signup?redirect_to='+encodeURIComponent(location.origin+location.pathname):'/auth/v1/token?grant_type=password';
      const data=await request(path,{method:'POST',body:{email,password}});
      passwordInput.value='';
      if(!storeSession(data)){setStatus('注册请求已提交。请查收验证邮件，完成后再登录。','ok');return;}
      await start();
    }catch(error){showError(error);}
    finally{form.querySelectorAll('button').forEach(button=>button.disabled=false);}
  }
  form.addEventListener('submit',event=>{event.preventDefault();authenticate('login');});
  panel.querySelector('#cloudSignup').onclick=()=>authenticate('signup');
  logout.onclick=async()=>{
    try{
      await flush();
      await signedRequest('/auth/v1/logout?scope=local',{method:'POST'});
      clearSession();setStatus('已退出云同步；本机作答保留。');
    }catch(error){showError(error);}
  };
  window.practiceSync={onLocalSave,pull:()=>pull().catch(showError)};
  if(!configured){form.hidden=true;logout.hidden=true;setStatus('云同步待配置。请先按随附说明创建 Supabase 项目。');return;}
  try{session=JSON.parse(localStorage.getItem(sessionKey)||'null');}catch{session=null;}
  const fragment=new URLSearchParams(location.hash.slice(1));
  if(fragment.has('access_token') && fragment.has('refresh_token')){
    storeSession({access_token:fragment.get('access_token'),refresh_token:fragment.get('refresh_token'),
      expires_in:Number(fragment.get('expires_in')||3600)});
    history.replaceState(null,'',location.pathname+location.search);
  }
  showAccount();
  if(session)start();
  else setStatus('登录同一账号后，手机和电脑会自动同步作答与错题。');
  const resume=()=>{if(!session)return;if(ready)pull().catch(showError);else start();};
  setInterval(()=>{if(session && navigator.onLine)resume();},20000);
  addEventListener('focus',resume);
  addEventListener('online',resume);
})();

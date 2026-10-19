/* 浏览器只携带 Supabase 登录令牌；DeepSeek 密钥只保存在 Edge Function Secrets。 */
(() => {
  'use strict';
  window.practiceAi = {
    async grade(question, answer) {
      const config = window.STUDY_SYNC_CONFIG || {};
      const base = String(config.url || '').replace(/\/+$/, '');
      const key = String(config.publishableKey || '');
      if (!base || !key || !window.practiceSync?.getAccessToken) throw new Error('请先配置 Supabase 云同步。');
      const accessToken = await window.practiceSync.getAccessToken();
      const response = await fetch(base + '/functions/v1/grade-answer', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', apikey: key, Authorization: 'Bearer ' + accessToken},
        body: JSON.stringify({type: question.type, question: question.q, reference: question.answer, answer})
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || 'AI 服务暂不可用（' + response.status + '）');
      if (!data || !['correct', 'partial', 'incorrect'].includes(data.verdict)) throw new Error('AI 返回的数据格式异常，请稍后重试。');
      return data;
    }
  };
})();

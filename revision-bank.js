// 依据本地题本与讲义章节重写旧题库。这里的数字题为参数变式，不代表独立考点。
(function(){
const oldCounts={choices:choices.length,fills:fills.length,programs:programs.length,essays:essays.length};
function sourceChoice(kind,n){
  const a=n+64,b=n+4,prefix=25+n%5,hosts=2**(32-prefix)-2;
  let q,v,e,page;
  switch(kind){
    case 0:q=`二进制数 ${a.toString(2)} 转换为十进制是多少？`;v=a;e=`按位权相加得到 ${a}。`;page='题本 p.2';break;
    case 1:q=`十进制数 ${a} 转换为二进制是多少？`;v=a.toString(2);e=`${a}₁₀=${v}₂。`;page='讲义目录：数制与编码';break;
    case 2:q=`十进制数 ${a} 转换为十六进制是多少？`;v=a.toString(16).toUpperCase();e=`按 16 进制位权换算为 ${v}。`;page='题本 p.2';break;
    case 3:q=`${b} KiB 等于多少字节？`;v=b*1024;e='1 KiB=1024 字节。';page='讲义目录：计算机基础';break;
    case 4:q=`宽 ${b} 像素、高 10 像素、每像素 24 位的未压缩图像占多少字节？`;v=b*30;e='宽×高×位深÷8，不计文件头。';page='讲义目录：多媒体技术';break;
    case 5:q=`单声道音频每秒采样 ${b} 次、每次 16 位，持续 2 秒，未压缩数据占多少字节？`;v=b*4;e='采样率×位深×时长÷8。';page='讲义目录：多媒体技术';break;
    case 6:q=`IPv4 子网 192.168.${n}.0/${prefix} 按传统规则排除网络和广播地址，可用主机地址数是多少？`;v=hosts;e=`主机位 ${32-prefix} 位，可用数为 2^${32-prefix}-2。`;page='讲义目录：计算机网络';break;
    case 7:q=`传感器在 0 到 ${b*5} 秒（含两端）每隔 5 秒采样一次，共采样几次？`;v=b+1;e='0 秒也采样，所以采样次数为时长÷间隔+1。';page='讲义目录：物联网';break;
    case 8:q=`MQTT 代理收到“温度”主题的 ${b} 条消息，恰有 2 个客户端持续订阅该主题且均在线，向订阅者转发共多少条？`;v=2*b;e='每条消息分别转发给两个订阅者；题设不考虑重传。';page='讲义 p.42';break;
    case 9:q=`表 SC 有 ${b+12} 行，GRADE 为 NULL 的有 ${n%3+1} 行，COUNT(GRADE) 得多少？`;v=b+12-(n%3+1);e='COUNT(列) 不统计该列的 NULL。';page='讲义 p.112';break;
    case 10:q=`表 SC 有 ${b+12} 行，其中有 ${n%3+1} 行成绩为 NULL，COUNT(*) 得多少？`;v=b+12;e='COUNT(*) 统计所有行。';page='讲义 p.112';break;
    case 11:q=`变量 s 初始为 ${n}，循环 ${b} 次，每次执行 s += 2，最终 s 是多少？`;v=n+2*b;e='初值加上每次增加量与次数的乘积。';page='讲义目录：Python 程序设计';break;
    case 12:q=`长度为 ${b} 的有序数组进行二分查找，首次计算中点下标 (0+${b-1})//2，结果是多少？`;v=Math.floor((b-1)/2);e='使用整数除法计算下标中点。';page='讲义 p.186';break;
    case 13:q=`长度为 ${b} 的序列做一趟相邻元素比较，共比较多少次？`;v=b-1;e='相邻元素共有 n-1 对。';page='讲义目录：排序算法';break;
    case 14:q=`外层和内层循环都执行 ${b} 次，内层语句共执行多少次？`;v=b*b;e='两层次数相乘。';page='讲义目录：算法';break;
    case 15:q=`非负整数 ${b} 在 Python 中左移 2 位，结果是多少？`;v=b*4;e='左移两位相当于乘 4。';page='讲义目录：编码';break;
    case 16:q=`${b} 个指定为 UTF-8 各占 3 字节的汉字，不计 BOM，共占多少字节？`;v=b*3;e='题设每字 3 字节，故相乘。';page='讲义目录：字符编码';break;
    case 17:q=`SQL 中 A 表 ${b} 行、B 表 3 行，CROSS JOIN 后有多少行？`;v=b*3;e='笛卡尔积的行数为两表行数之积。';page='讲义目录：SQL 语言';break;
    case 18:q=`Scratch 变量 a 初始为 ${n}，重复 ${b} 次“将 a 增加 3”，最终值是多少？`;v=n+3*b;e='初值加上重复次数乘 3。';page='讲义 p.220';break;
    case 19:q=`一张表有 ${b} 行，WHERE 条件恰好排除 2 行，查询返回多少行？`;v=b-2;e='WHERE 先筛选满足条件的行。';page='讲义目录：SQL 语言';break;
  }
  const answer=String(v);
  const options=[answer];
  if(typeof v==='number') [v+1,v+2,v+3].forEach(x=>options.push(String(x)));
  else {let x=1;while(options.length<4){const candidate=(parseInt(answer,kind===1?2:16)+x).toString(kind===1?2:16).toUpperCase();if(!options.includes(candidate))options.push(candidate);x++;}}
  return [q,options,0,e,'原创·资料参数变式（'+page+'）','pdf-family-'+kind,'学科专业知识'];
}
for(let i=0;i<1100;i++) choices[30+i]=sourceChoice(i%20,Math.floor(i/20)+1);
for(let i=0;i<550;i++){
  const row=sourceChoice(i%20,Math.floor(i/20)+101);
  fills[10+i]=['计算填空：'+row[0]+' 答案：____。',[row[1][0]],row[3],row[4],row[5],'学科专业知识'];
}
const TOPICS=[
{name:'信息的载体依附性',def:'信息须借助具体载体记录、展示或传播',mech:'相同通知可用纸张、声音或电子信号表示',example:'同一通知可打印也可发电子邮件',pair:'信息时效性',compare:'载体依附性关注呈现媒介，时效性关注价值随时间变化',mis:'信息就是纸张本身',correct:'纸张是载体，文字表达的内容才是信息',activity:'让学生比较纸质和电子通知的内容与载体',evidence:'能指出同一信息的两种载体并说明内容未变',application:'校园通知可选纸质或数字渠道并考虑可达性',support:'先展示同内容不同载体的实例，再抽象概念',limit:'更换载体可能改变传播范围和隐私风险',page:'讲义 p.6'},
{name:'信息的时效性',def:'信息的使用价值可能随时间和情境变化',mech:'环境改变后旧数据可能不再代表现状',example:'昨日天气预报不宜直接指导今日出行',pair:'信息共享性',compare:'时效性关注时间，共享性关注多主体使用',mis:'一条信息发布后永远同样有用',correct:'应核对发布时间和当前情境',activity:'比较两份不同日期的天气预警并判断用途',evidence:'能说明哪份数据更适合当下决策及理由',application:'校园环境监测看实时读数也看时间戳',support:'用过期通知设置冲突情境引出判断',limit:'旧信息仍可能有历史分析价值，不能一概删除',page:'讲义 p.6'},
{name:'二进制位权',def:'二进制各位按 2 的幂确定权值',mech:'从最低位起依次乘以 1、2、4、8 后求和',example:'1101₂=8+4+1=13₁₀',pair:'十六进制表示',compare:'二进制每位基数 2；十六进制每位基数 16，四位二进制可对应一位十六进制',mis:'1101₂ 等于十进制一千一百零一',correct:'必须按二进制位权计算',activity:'让学生用四张位权卡表示 13',evidence:'能解释每一位的权值并完成双向转换',application:'读懂程序中的位掩码和颜色编码',support:'先用 8、4、2、1 卡片，再写符号式',limit:'进制转换不能只改数字后缀',page:'题本 p.2'},
{name:'字符编码',def:'字符编码把字符映射为可存储的字节序列',mech:'Unicode 定义码点，UTF-8 等编码规定实际字节表示',example:'同一个汉字在不同编码下字节序列可能不同',pair:'图像像素编码',compare:'字符编码表示文本符号；像素编码表示图像采样点的颜色',mis:'每个汉字在所有编码中固定占两字节',correct:'字节长度取决于编码方式和具体字符',activity:'比较一段文本用 UTF-8 和 UTF-16 保存的字节数',evidence:'能区分字符数、码点与文件字节数',application:'导入 CSV 前确认编码避免乱码',support:'用同一字符的不同字节序列作对照',limit:'仅看到乱码不能唯一判断原编码，需要更多证据',page:'讲义目录：数制与编码'},
{name:'存储程序思想',def:'程序指令与数据均可存入存储器供处理器访问',mech:'CPU 依次取指、译码和执行，必要时读写数据',example:'修改内存中的程序可改变同一硬件执行的任务',pair:'固定连线控制',compare:'存储程序便于更换软件；固定连线功能变更通常需要改硬件',mis:'程序只能焊接在电路中',correct:'通用计算机可从存储器取指令',activity:'让学生画出 CPU、存储器、输入输出间的数据流',evidence:'能区分取指令和读取操作数',application:'解释同一电脑为何能运行不同软件',support:'用逐步执行的三条指令示例追踪',limit:'存储程序是抽象原理，不等于所有设备实现完全相同',page:'题本 p.8'},
{name:'主存读写',def:'读从指定地址取数据，写将数据存入指定地址',mech:'地址用于定位单元，控制信号区分读与写',example:'变量赋值可能导致向内存单元写入新值',pair:'磁盘读写',compare:'主存与磁盘都可读写，但速度和断电保持特性通常不同',mis:'写操作是从存储器取出数据',correct:'从存储器取出是读，送入是写',activity:'用地址格纸片模拟读写并记录变化',evidence:'能指出一次操作的地址、方向和值',application:'追踪数组元素更新',support:'让学生先用箭头表示数据流再命名操作',limit:'实际硬件有缓存和层级，课堂模型作了简化',page:'题本 p.4'},
{name:'进程就绪状态',def:'进程具备运行条件但尚未获得 CPU',mech:'调度器选择就绪进程占用 CPU 后转为运行',example:'多个可运行程序排队等候处理器时间',pair:'阻塞状态',compare:'就绪只等待 CPU；阻塞等待 I/O 等事件',mis:'没有运行就是阻塞',correct:'还需判断是在等 CPU 还是等其他事件',activity:'用任务卡模拟运行、就绪和阻塞队列',evidence:'能依据等待原因判断状态',application:'分析多个程序争用 CPU 的现象',support:'先给出等待原因，再让学生归类',limit:'具体系统状态模型可能更复杂',page:'题本 p.2'},
{name:'传感器采样',def:'按一定时间间隔将物理量转成数字记录',mech:'采样率决定时间分辨率，量化影响数值精度',example:'每五秒记录一次教室温度',pair:'连续监测',compare:'离散采样只记录指定时刻，连续物理量在时刻之间仍可变化',mis:'采样越频繁必然越准确且没有成本',correct:'需权衡能耗、存储、传输与传感器误差',activity:'不同间隔采集同一温度曲线并比较',evidence:'能解释时间戳、间隔和遗漏变化',application:'设计校园温湿度监测频率',support:'先用折线图比较不同采样间隔',limit:'漏采和校准误差会影响结论',page:'讲义目录：物联网'},
{name:'MQTT 发布订阅',def:'发布者按主题发送消息，代理按订阅关系转发',mech:'发布者与订阅者通过主题和代理解耦',example:'温度传感器发布读数，监控屏订阅温度主题',pair:'直接点对点通信',compare:'发布订阅由代理路由主题；点对点由发送者直接指定接收方',mis:'发布者必须知道每个订阅者地址',correct:'通常只需向代理发布指定主题',activity:'让三组扮演发布者、代理和订阅者传纸条',evidence:'能画出消息路径并标注主题',application:'校园设备状态实时展示',support:'从一对一再扩展到多个订阅者',limit:'需要考虑代理可用性、权限和消息质量',page:'讲义 p.42'},
{name:'机器学习训练与测试',def:'用训练数据学习模型，再用独立数据估计泛化能力',mech:'测试集不应反复用于模型选择',example:'图像分类训练后用未见图片评价',pair:'验证集',compare:'验证集用于调参，测试集用于尽可能独立的最终评估',mis:'训练准确率高就代表真实使用一定准确',correct:'应检查未见样本、类别差异和数据泄漏',activity:'对比训练和测试结果并讨论差异',evidence:'能识别过拟合和测试集泄漏',application:'评估校园垃圾分类模型',support:'用少量可视样本解释划分',limit:'测试集也可能与实际场景分布不同',page:'讲义目录：人工智能'},
{name:'E-R 概念模型',def:'用实体、属性和联系描述数据需求',mech:'先抽象业务对象及联系，再转化为关系表',example:'学生与课程之间存在选课联系',pair:'关系表设计',compare:'E-R 模型表达概念需求；关系表设计落实字段和约束',mis:'学生选课只需要一张含所有信息的大表',correct:'应识别学生、课程和选课关系以减少冗余',activity:'用卡片画学生、课程及多对多联系',evidence:'能标注实体、属性、联系与基数',application:'设计图书借阅或学生选课数据结构',support:'先从一条业务叙述提取名词和关系',limit:'概念模型仍须检查实际业务规则',page:'题本 p.16'},
{name:'主键与外键',def:'主键唯一标识本表记录，外键关联另一表的键',mech:'通过约束减少重复和无效引用',example:'选课表的学号引用学生表学号',pair:'普通索引',compare:'键描述标识和引用约束；索引主要服务检索性能',mis:'任何姓名都可稳定当主键',correct:'姓名可能重复或变化，需考虑唯一性和稳定性',activity:'给一组重复姓名数据选择合适主键',evidence:'能指出联合主键和外键引用对象',application:'避免选课记录指向不存在的学生',support:'从重复姓名反例引出学号',limit:'外键策略需结合删除和更新规则',page:'讲义 p.112'},
{name:'SQL NULL 语义',def:'NULL 表示缺失或未知，不能按普通值直接等值判断',mech:'IS NULL 用于判断；COUNT(列) 忽略该列 NULL',example:'两行成绩中一行 NULL，COUNT(*) 为 2 而 COUNT(score) 为 1',pair:'数值零',compare:'零是已知数值；NULL 表示没有确定值',mis:'score = NULL 可以选出缺失成绩',correct:'应写 score IS NULL',activity:'让学生预测并运行 COUNT(*)、COUNT(score)',evidence:'能解释结果差异并写出 IS NULL',application:'处理成绩未录入的记录',support:'用小表先手算再执行 SQL',limit:'不同聚合函数对 NULL 的处理需分别核对',page:'讲义 p.112'},
{name:'SQL 分组聚合',def:'GROUP BY 按指定键划分记录后做聚合计算',mech:'WHERE 筛选分组前的行，HAVING 筛选分组后的结果',example:'按课程号统计每门课的选课人数',pair:'ORDER BY 排序',compare:'分组改变聚合单位；排序只改变结果顺序',mis:'ORDER BY CNO 就能得到每门课人数',correct:'应 GROUP BY CNO 并用 COUNT 聚合',activity:'手工给选课卡按课程分组再写 SQL',evidence:'能选对分组键并说明 COUNT 的含义',application:'统计各课程平均分和人数',support:'先按一门课汇总，再扩展到所有课程',limit:'有 NULL 值时须明确统计口径',page:'讲义 p.112'},
{name:'关系表连接',def:'按关联条件组合多张表中的记录',mech:'INNER JOIN 只保留匹配行，LEFT JOIN 还保留左表未匹配行',example:'学生表按学号连接选课表查询姓名和成绩',pair:'笛卡尔积',compare:'连接条件约束匹配；无条件 CROSS JOIN 组合所有行对',mis:'两表字段同名就一定自动正确连接',correct:'应明确 ON 条件并检查结果行数',activity:'用两张三行小表手工配对再执行查询',evidence:'能写 ON 条件并解释未匹配记录',application:'联合展示学生、课程及成绩',support:'先画连接键，再写 SELECT',limit:'一对多连接可能放大行数',page:'讲义 p.112'},
{name:'图像像素与位深',def:'栅格图像由像素组成，位深决定每像素可编码状态数',mech:'未压缩像素数据量约为宽×高×每像素位数÷8',example:'20×10 像素、24 位图像的像素数据为 600 字节',pair:'文件大小',compare:'像素数据量是理论下限之一，实际文件还受文件头和压缩影响',mis:'文件大小永远等于宽×高',correct:'还需考虑位深、压缩和元数据',activity:'改变图像位深并比较理论值与实际文件',evidence:'能列式并说明偏差原因',application:'估算图片存储空间',support:'先算一像素再推广到整幅图',limit:'有损和无损压缩会使文件大小不同',page:'讲义目录：多媒体技术'},
{name:'音频采样与量化',def:'采样把连续声音按时刻记录，量化把幅度映射到离散值',mech:'未压缩数据量由采样率、位深、声道和时长决定',example:'单声道 1000 次每秒、16 位、1 秒为 2000 字节',pair:'音频压缩',compare:'采样量化决定原始数字表示，压缩进一步改变存储量',mis:'只看采样率就能计算全部文件大小',correct:'还需位深、声道数、时长及压缩信息',activity:'计算两段不同声道音频的原始数据量',evidence:'公式中能正确写出四个因素与单位',application:'规划录音存储容量',support:'先算单声道一秒，再推广',limit:'实际编码文件还包含头部和压缩开销',page:'讲义目录：多媒体技术'},
{name:'DNS 域名解析',def:'DNS 帮助把域名解析为访问所需的网络地址等记录',mech:'客户端可向解析器查询并使用缓存结果',example:'访问学校网站前查询其域名对应地址',pair:'HTTP 请求',compare:'DNS 负责名字解析，HTTP 负责网页资源请求与响应',mis:'DNS 可以直接保证网页内容安全',correct:'解析服务不等于身份认证或内容审查',activity:'画出输入域名到获取网页的简化流程',evidence:'能区分域名解析与网页传输',application:'排查域名无法访问的原因',support:'用通讯录查号码作类比并说明局限',limit:'缓存或配置错误可导致解析异常',page:'讲义目录：IP 地址和域名'},
{name:'二分查找',def:'在有序序列中比较中点并缩小候选区间的查找方法',mech:'目标大于中点则舍弃左半，否则舍弃右半，边界逐步收缩',example:'在 [1,2,6,8,12,13,36,45,49,85] 中查找 48',pair:'顺序查找',compare:'二分依赖有序性，典型比较次数为对数级；顺序查找可用于无序表',mis:'任何无序数组都可直接二分',correct:'无序时大小比较不能排除半区',activity:'让学生用有序卡片追踪 left、mid、right',evidence:'能解释每轮舍弃区间的依据',application:'查找排序后的学号或时间值',support:'先手工定位，再写循环条件',limit:'有重复元素时“任一匹配”与“首次出现”要求不同',page:'讲义 p.186'}
];
const essayRows=[];
for(const t of TOPICS){
  const frames=[
    [`解释${t.name}并给一个例子。`,`${t.def}。例如：${t.example}。`],
    [`说明${t.name}如何起作用。`,`${t.mech}。可结合“${t.example}”解释步骤与条件。`],
    [`比较${t.name}与${t.pair}。`,`${t.compare}。比较时应先明确两者关注的问题。`],
    [`学生说“${t.mis}”。请分析并纠正。`,`该判断不准确。${t.correct}。可用“${t.example}”作反例或验证。`],
    [`为高中课堂设计一个 5 分钟活动，让学生理解${t.name}。`,`可安排：${t.activity}；让学生解释观察结果，再概括“${t.def}”。`],
    [`如何用形成性评价判断学生是否理解${t.name}？`,`布置简短任务并收集证据：${t.evidence}；据错误给予针对性反馈。`],
    [`说明${t.name}在一个实际项目中的应用。`,`例如：${t.application}。应解释所依据的概念与实际约束。`],
    [`学生学习${t.name}时遇到困难，给出一种教学支架。`,`${t.support}；让学生先独立解释，再逐步撤去提示。`],
    [`说明应用${t.name}时的一项限制或风险。`,`${t.limit}。应结合任务条件检查，不能机械套用。`]
  ];
  for(const [q,a] of frames)essayRows.push([q,a,'原创·资料章节改编（'+t.page+'）','简答题']);
}
essays.push(...essayRows.slice(0,170));
const revisedPrograms=[];
for(let variant=0;variant<3;variant++){
  const k=variant+2,threshold=60+variant*5;
  const py=[
    [`编写 Python 3 函数 count_ge_${threshold}(nums)，统计整数列表中大于或等于 ${threshold} 的元素数；空列表返回 0。`,`def count_ge_${threshold}(nums):\n    return sum(1 for x in nums if x >= ${threshold})`],
    [`编写 Python 3 函数 sum_multiple_${k}(nums)，返回整数列表中能被 ${k} 整除的元素之和；空列表返回 0。`,`def sum_multiple_${k}(nums):\n    return sum(x for x in nums if x % ${k} == 0)`],
    [`编写 Python 3 函数 first_ge_${threshold}(nums)，返回首个不小于 ${threshold} 的元素下标；不存在返回 -1。`,`def first_ge_${threshold}(nums):\n    for i, x in enumerate(nums):\n        if x >= ${threshold}:\n            return i\n    return -1`],
    [`编写 Python 3 函数 last_below_${threshold}(nums)，返回最后一个小于 ${threshold} 的元素下标；不存在返回 -1。`,`def last_below_${threshold}(nums):\n    for i in range(len(nums) - 1, -1, -1):\n        if nums[i] < ${threshold}:\n            return i\n    return -1`],
    [`编写 Python 3 函数 first_pos_${k}(a,target)，a 为升序整数列表；只在下标 ${k} 及其后查找 target 的首次出现位置，不存在返回 -1。`,`def first_pos_${k}(a, target):\n    left, right = ${k}, len(a) - 1\n    result = -1\n    while left <= right:\n        mid = (left + right) // 2\n        if a[mid] >= target:\n            if a[mid] == target:\n                result = mid\n            right = mid - 1\n        else:\n            left = mid + 1\n    return result`],
    [`编写 Python 3 函数 count_runs_${k}(a)，统计整数列表中长度至少为 ${k} 的连续相同元素段数；空列表返回 0。`,`def count_runs_${k}(a):\n    if not a:\n        return 0\n    count = 0\n    run = 1\n    for i in range(1, len(a)):\n        if a[i] == a[i-1]:\n            run += 1\n        else:\n            if run >= ${k}:\n                count += 1\n            run = 1\n    if run >= ${k}:\n        count += 1\n    return count`],
    [`编写 Python 3 函数 moving_sum_${k}(a)，返回每个连续 ${k} 项的和构成的列表；输入长度不足 ${k} 时返回空列表。`,`def moving_sum_${k}(a):\n    return [sum(a[i:i+${k}]) for i in range(len(a)-${k}+1)]`],
    [`编写 Python 3 函数 distinct_above_${threshold}(a)，按首次出现顺序返回大于 ${threshold} 的不同整数。`,`def distinct_above_${threshold}(a):\n    seen = set()\n    out = []\n    for x in a:\n        if x > ${threshold} and x not in seen:\n            seen.add(x)\n            out.append(x)\n    return out`],
    [`编写 Python 3 函数 sensor_gaps_${k}(times)，times 为严格递增的整数时间戳；返回相邻时间差大于 ${k} 的次数。`,`def sensor_gaps_${k}(times):\n    return sum(times[i]-times[i-1] > ${k} for i in range(1, len(times)))`],
    [`编写 Python 3 函数 topic_count_${k}(messages,topic)，messages 为 (主题,字符串内容) 二元组列表；返回指定 topic 且内容长度至少为 ${k} 的消息数。`,`def topic_count_${k}(messages, topic):\n    return sum(1 for name, body in messages if name == topic and len(body) >= ${k})`]
  ];
  for(const [q,a] of py)revisedPrograms.push([q,a,'原创·讲义算法、物联网与 Python 章节改编']);
  const student=`student_${k}`,enroll=`enroll_${k}`,reading=`reading_${k}`;
  const sql=[
    [`使用 SQLite SQL。${student}(id,name,score) 中查询 score 不低于 ${threshold} 的学生姓名与成绩，按 score 降序、id 升序排列。`,`SELECT name, score FROM ${student} WHERE score >= ${threshold} ORDER BY score DESC, id ASC;`],
    [`使用 SQLite SQL。${student}(id,name,score) 中统计非 NULL 成绩的平均分，结果列名 avg_score。`,`SELECT AVG(score) AS avg_score FROM ${student};`],
    [`使用 SQLite SQL。${enroll}(sno,cno,grade) 中统计每门课非 NULL 成绩的条数，仅保留至少 ${k} 条的课程，输出 cno 和 grade_count。`,`SELECT cno, COUNT(grade) AS grade_count FROM ${enroll} GROUP BY cno HAVING COUNT(grade) >= ${k};`],
    [`使用 SQLite SQL。${student}(id,name,score)、${enroll}(sno,cno,grade) 中查询课程号 ${k} 的学生姓名与成绩，只保留两表匹配记录。`,`SELECT s.name, e.grade FROM ${student} AS s JOIN ${enroll} AS e ON s.id=e.sno WHERE e.cno=${k};`],
    [`使用 SQLite SQL。${student}(id,name,score)、${enroll}(sno,cno,grade) 中列出所有学生 id 及其选课号 cno；未选课学生也保留。`,`SELECT s.id, e.cno FROM ${student} AS s LEFT JOIN ${enroll} AS e ON s.id=e.sno;`],
    [`使用 SQLite SQL。${student}(id,name,score) 中查询成绩未登记的学生 id，按 id 升序排列。`,`SELECT id FROM ${student} WHERE score IS NULL ORDER BY id;`],
    [`使用 SQLite SQL。${reading}(id,sensor_id,temperature) 中按 sensor_id 统计不低于 ${threshold} 的读数条数，输出 sensor_id、reading_count。`,`SELECT sensor_id, COUNT(*) AS reading_count FROM ${reading} WHERE temperature >= ${threshold} GROUP BY sensor_id;`]
  ];
  for(const [q,a] of sql)revisedPrograms.push([q,a,'原创·讲义 p.112 与物联网章节改编']);
}
if(revisedPrograms.length!==51)throw Error('程序替换数量错误');
for(let i=0;i<51;i++)programs[i]=revisedPrograms[i];
if(choices.length!==oldCounts.choices || fills.length!==oldCounts.fills || programs.length!==oldCounts.programs || essays.length!==200)throw Error('题库修订后数量异常');
globalThis.REVISION_STATS={choicesReplaced:1100,fillsReplaced:550,programsReplaced:51,essaysAdded:170,essayTotal:essays.length,choiceTemplates:20,fillTemplates:20,essayTopics:TOPICS.length,programTemplates:17};
})();


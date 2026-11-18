// 依据《07、题海训练 254.docx》数据库多选第4题、单选第66题、简答第2—4题
// 与《09、题海训练答案 288.docx》对应解析改编；明确数据库表结构和事务条件。
const SOURCE_REFRESH_BATCH52 = [
  ['字段 TeacherNO 定义为 INT NOT NULL UNIQUE，但未声明 PRIMARY KEY。根据这些约束，哪项可以确定？',['TeacherNO 不能为 NULL 且非 NULL 值不能重复','TeacherNO 已自动成为该表的主键','TeacherNO 必须等于教师姓名','表中只能有 TeacherNO 这一列'],0,'NOT NULL 排除空值，UNIQUE 排除重复值；这两项约束本身并不等同于显式声明 PRIMARY KEY。','题海训练·数据库多选第4题及参考答案（DOCX）','数据库'],
  ['事务 T1 两次读取同一行；两次读取之间，T2 修改该行并提交，导致 T1 第二次读到不同的值。该现象称为？',['不可重复读','脏读','幻读','主键冲突'],0,'同一事务两次读取同一行得到不同值，是不可重复读；这里 T2 已提交，因此不是读取未提交数据的脏读。','题海训练·数据库单选第66题及参考答案（DOCX）；补足提交条件','数据库'],
  ['学生与课程是多对多关系，且每次选课需保存该生在该课的成绩。哪种关系表设计较合适？',['选修(学号, 课程号, 成绩)，以学号和课程号组合作为键','只在学生表增加一个课程号字段','只在课程表增加一个学号字段','把所有学生姓名写进课程名字段'],0,'多对多关系通常用独立关联表表示；学号与课程号组合标识一次选课，成绩是这次联系的属性。','题海训练·数据库简答第2题及参考答案（DOCX）','数据库'],
  ['SQLite 表 students(studentid, class_id, studentname, gender) 中，查询性别为“男”且班级编号为 2 的姓名，应使用哪条语句？',["SELECT studentname FROM students WHERE gender = '男' AND class_id = 2;","SELECT studentname FROM students WHERE gender = '男' OR class_id = 2;","SELECT gender FROM students WHERE studentname = '男' AND class_id = 2;","DELETE FROM students WHERE gender = '男' AND class_id = 2;"],0,'两个筛选条件须同时满足，用 AND；SELECT 指定输出姓名列，DELETE 会删除数据。','题海训练·数据库简答第3题及参考答案（DOCX）；字段 class 改为 class_id','数据库'],
  ['SQLite 表 book(title, price) 中，只查询书名包含“数学”且价格低于 20 的书名，哪条语句正确？',["SELECT title FROM book WHERE title LIKE '%数学%' AND price < 20;","SELECT title FROM book WHERE title = '%数学%' OR price < 20;","SELECT price FROM book WHERE title LIKE '数学' AND price > 20;","SELECT title FROM book WHERE title LIKE '%数学%' AND price >= 20;"],0,'LIKE 的两侧百分号表示前后可有任意字符；价格条件为小于 20，两个条件用 AND 连接。','题海训练·数据库简答第4题第2问及参考答案（DOCX）','数据库'],
  ['SQLite 表 book(title, price) 中，若要把所有图书的非 NULL 价格提高 10%，哪条语句符合要求？',['UPDATE book SET price = price * 1.10;','UPDATE book SET price = 1.10;','SELECT price * 1.10 FROM book;','DELETE FROM book WHERE price < 1.10;'],0,'UPDATE ... SET 对原列进行更新，乘以 1.10 表示增加 10%；SELECT 只查询，DELETE 会删行。NULL 价格按 SQL 运算规则仍为 NULL。','题海训练·数据库简答第4题第3问及参考答案（DOCX）','数据库'],
];
choices.push(...SOURCE_REFRESH_BATCH52);

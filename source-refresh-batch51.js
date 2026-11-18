// 依据《07、题海训练 254.docx》数据库章节单选 42—70
// 与《09、题海训练答案 288.docx》对应解析改编；跳过原题中方言依赖或条件不充分者。
const SOURCE_REFRESH_BATCH51 = [
  ['使用标准 SQL 删除表 distributors 中 distri_num 等于 1018 的记录，应使用哪条语句？',['DELETE FROM distributors WHERE distri_num = 1018;','DROP TABLE distributors WHERE distri_num = 1018;','DELETE * FROM distributors WHERE distri_num = 1018;','UPDATE distributors WHERE distri_num = 1018;'],0,'DELETE FROM ... WHERE 删除满足条件的行；DROP TABLE 会删除表，DELETE 后不加星号，UPDATE 用于修改行。','题海训练·数据库单选第45题及参考答案（DOCX）','数据库'],
];
choices.push(...SOURCE_REFRESH_BATCH51);

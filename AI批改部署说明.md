# 主观题 AI 辅助评阅：部署与验收

当前仓库中的文件是可部署版本，**仅上传静态网页不能启用评阅**。必须先在 Supabase 部署数据库脚本和 Edge Function，再上传网页。DeepSeek Key 只能填在 Supabase 的 Edge Function Secrets，不能放进 GitHub 或网页。

## 1. 准备密钥

此前发送到聊天中的 DeepSeek Key 应在 DeepSeek 后台撤销。新建 Key 后进入你的 Supabase 项目 **Edge Functions → Secrets**，新增 `DEEPSEEK_API_KEY` 并将新 Key 填入 Value。再新增 `GRADER_ALLOWED_EMAILS`，Value 填你准备用于答题网页登录的邮箱；如需授权多个邮箱，用英文逗号分隔。必须先完成邮箱验证。未设置允许邮箱时函数拒绝批改，避免公开注册账号消耗你的 API 额度。不要将新 Key 发到聊天、提交到仓库或截图展示。

默认模型为 `deepseek-flash`。如果 DeepSeek 后续调整模型名称，可额外设置 `DEEPSEEK_MODEL` Secret，无须修改网页。

## 2. 更新数据库

在 Supabase **SQL Editor** 中运行 [supabase-ai-grade.sql](supabase-ai-grade.sql)。它将 `aiGrades` 加入同步类别，并创建每个登录账号每日最多 20 次评阅的原子计数函数。它不清除答题或错题记录。先前的 [supabase-sync.sql](supabase-sync.sql) 应已成功执行。

## 3. 部署 Edge Function

函数源码为 [supabase/functions/grade-answer/index.ts](supabase/functions/grade-answer/index.ts)。如使用 Supabase CLI，在此目录执行：

```powershell
npx supabase login
npx supabase link --project-ref lvfgugalakitgttcmryk
npx supabase functions deploy grade-answer --no-verify-jwt
```

部署参数 `--no-verify-jwt` 只关闭平台前置 JWT 检查：**函数内部仍会向 Supabase Auth 验证每次请求的登录令牌**，随后调用带原子配额限制的数据库函数。不能把整个函数改成匿名直连 DeepSeek。

## 4. 更新 GitHub Pages

将 `index.html`、`cloud-sync.js`、`sync-config.js`、`ai-grader.js`、`practice-bank.js`、`scope-bank.js`、`sources.json` 放在 `Sun960406/exam` 仓库根目录。新上传时至少要覆盖前三个改动文件及新增的 `ai-grader.js`。`supabase-ai-grade.sql` 和 `supabase/functions/` 可以保存在仓库供审阅，但不会由 GitHub Pages 自动部署到 Supabase。

## 5. 验收

1. 打开 `https://sun960406.github.io/exam/`，登录云同步账号。
2. 填写一道简答题，点击“提交并查看答案”，再点击“AI 评阅此题”。应显示 0–10 分、简短评语和待补充要点。
3. 故意写错一题，确认结果进入错题本；点“移出错题本”可以手动更正 AI 判断。
4. 在手机以同一账号登录，确认评阅结果与错题同步。程序题只进行文本审查，页面明确提示不执行代码。
5. 未登录时应提示登录；评阅达到每日 20 次时应显示额度提示，不能继续调用 DeepSeek。

AI 评分只用于备考反馈，不作为招聘考试的权威评分。系统不会自动评阅每一道主观题；每次点击才产生一次付费 API 调用。中国内地的 Supabase 和 DeepSeek 服务连通性需要手机实测，无法仅凭部署成功保证。

相关官方文档：[Supabase Edge Function Secrets](https://supabase.com/docs/guides/functions/secrets)、[Supabase Edge Functions](https://supabase.com/docs/guides/functions)、[DeepSeek 首次调用](https://api-docs.deepseek.com/zh-cn/)。

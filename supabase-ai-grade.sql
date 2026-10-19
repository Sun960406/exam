-- 在现有 supabase-sync.sql 成功执行后运行；保留所有现有学习记录。
-- 将评阅结果纳入跨设备同步。
alter table public.study_items drop constraint if exists study_items_category_check;
alter table public.study_items add constraint study_items_category_check
  check (category in ('answers','wrong','submittedDays','dailyPapers','dailyReviews','reviewHistory','aiGrades'));

-- 每位登录用户每天最多发起 20 次 AI 评阅，避免公开网页意外耗费 API 额度。
create table if not exists public.ai_grade_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_day date not null,
  used integer not null default 0,
  primary key (user_id, usage_day)
);
alter table public.ai_grade_usage enable row level security;
revoke all on public.ai_grade_usage from anon, authenticated;

create or replace function public.claim_ai_grade()
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  caller uuid := (select auth.uid());
  remaining integer;
begin
  if caller is null then return false; end if;
  insert into public.ai_grade_usage(user_id, usage_day, used)
  values (caller, (now() at time zone 'Asia/Shanghai')::date, 1)
  on conflict (user_id, usage_day) do update
    set used = public.ai_grade_usage.used + 1
    where public.ai_grade_usage.used < 20
  returning used into remaining;
  return remaining is not null;
end;
$$;
revoke all on function public.claim_ai_grade() from public, anon;
grant execute on function public.claim_ai_grade() to authenticated;

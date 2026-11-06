-- Kjør denne én gang i Supabase: SQL Editor → New query → lim inn → Run.
-- Lar en innlogget voksen slette sin egen konto med alle barn og all fremgang
-- («Slett familiekontoen» på voksensiden). Kjøres som eier (security definer)
-- fordi vanlige brukere ikke kan slette rader i auth.users.

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Ikke innlogget';
  end if;
  delete from public.progress where child_id in (select id from public.children where user_id = uid);
  delete from public.children where user_id = uid;
  delete from auth.users where id = uid;
end;
$$;

revoke all on function public.delete_my_account() from public;
grant execute on function public.delete_my_account() to authenticated;

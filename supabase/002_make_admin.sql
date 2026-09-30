-- Maak eerst je gebruiker via Authentication > Users > Add user > Create new user.
-- Voer dit bestand daarna uit in de SQL Editor. Er staat bewust geen wachtwoord in.
do $$
declare admin_id uuid;
begin
  select id into admin_id from auth.users
  where lower(email) = lower('Sierdvanwilsum@gmail.com') and email_confirmed_at is not null;
  if admin_id is null then
    raise exception 'Maak eerst de bevestigde gebruiker Sierdvanwilsum@gmail.com aan via Authentication > Users.';
  end if;
  insert into public.portfolio_admins(user_id) values (admin_id)
  on conflict (user_id) do nothing;
end;
$$;

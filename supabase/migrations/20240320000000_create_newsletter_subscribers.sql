-- Create newsletter_subscribers table
create table if not exists newsletter_subscribers (
  id uuid default uuid_generate_v4() primary key,
  email text not null unique,
  status text not null check (status in ('active', 'unsubscribed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table newsletter_subscribers enable row level security;

-- Create policies
create policy "Anyone can subscribe to newsletter"
  on newsletter_subscribers
  for insert
  with check (true);

create policy "Anyone can check subscription status"
  on newsletter_subscribers
  for select
  using (true);

create policy "Subscribers can unsubscribe"
  on newsletter_subscribers
  for update
  using (true)
  with check (
    old.email = new.email and
    new.status = 'unsubscribed'
  ); 
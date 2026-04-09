-- 1. Create Profiles table (linked to auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  name text,
  role text check (role in ('admin', 'guru', 'siswa')) default 'siswa',
  school_id text default 'SCHOOL_001',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Reports table
create table public.reports (
  id uuid default gen_random_uuid() primary key,
  reporter_uid uuid references auth.users on delete set null,
  reporter_name text,
  victim_name text not null,
  perpetrator_name text,
  description text not null,
  date date not null,
  status text check (status in ('pending', 'verified', 'resolved')) default 'pending',
  follow_up_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Students table
create table public.students (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  class text not null,
  school_id text default 'SCHOOL_001',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Set up Row Level Security (RLS)

-- Profiles RLS
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Reports RLS
alter table public.reports enable row level security;

create policy "Siswa can see own reports."
  on reports for select
  using ( 
    auth.uid() = reporter_uid OR 
    exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'guru'))
  );

create policy "Anyone can create a report."
  on reports for insert
  with check ( auth.role() = 'authenticated' );

create policy "Admin and Guru can update reports."
  on reports for update
  using ( exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'guru')) );

-- Students RLS
alter table public.students enable row level security;

create policy "Authenticated users can view students."
  on students for select
  using ( auth.role() = 'authenticated' );

create policy "Admin can manage students."
  on students for all
  using ( exists (select 1 from profiles where id = auth.uid() and role = 'admin') );

-- 5. Trigger to create profile on signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'siswa');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

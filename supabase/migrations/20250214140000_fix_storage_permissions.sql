/*
# Storage Bucket Setup (Safe Mode)
Creates the portfolio bucket and policies without aggressive drops to avoid 42501 errors.

## Query Description:
- Creates 'portfolio' bucket if missing.
- Adds RLS policies for Public Read and Admin Write.
- Uses DO blocks to avoid permission errors on existing policies.

## Metadata:
- Schema-Category: "Safe"
- Impact-Level: "Low"
- Requires-Backup: false
*/

-- 1. Create Bucket (Safe insert)
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

-- 2. Create Policies safely using DO blocks to check existence first
do $$
begin
  -- Policy: Public Read (Anyone can view images)
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'storage' 
    and tablename = 'objects' 
    and policyname = 'Portfolio Public Read'
  ) then
    create policy "Portfolio Public Read"
      on storage.objects for select
      using ( bucket_id = 'portfolio' );
  end if;

  -- Policy: Admin Insert (Only authenticated users can upload)
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'storage' 
    and tablename = 'objects' 
    and policyname = 'Portfolio Admin Insert'
  ) then
    create policy "Portfolio Admin Insert"
      on storage.objects for insert
      with check ( bucket_id = 'portfolio' and auth.role() = 'authenticated' );
  end if;

  -- Policy: Admin Update (Only authenticated users can update)
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'storage' 
    and tablename = 'objects' 
    and policyname = 'Portfolio Admin Update'
  ) then
    create policy "Portfolio Admin Update"
      on storage.objects for update
      using ( bucket_id = 'portfolio' and auth.role() = 'authenticated' );
  end if;

  -- Policy: Admin Delete (Only authenticated users can delete)
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'storage' 
    and tablename = 'objects' 
    and policyname = 'Portfolio Admin Delete'
  ) then
    create policy "Portfolio Admin Delete"
      on storage.objects for delete
      using ( bucket_id = 'portfolio' and auth.role() = 'authenticated' );
  end if;
end $$;

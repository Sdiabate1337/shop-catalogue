-- NOTE: We do NOT attempt to create the bucket here because the signature of
-- storage.create_bucket varies by Postgres/Storage version and can cause errors.
-- The bucket 'products' is created by the server API route at
-- app/api/init-storage/route.ts using the service role key.

-- Enable public read for products bucket
drop policy if exists "Public read for products" on storage.objects;
create policy "Public read for products"
  on storage.objects
  for select
  using ( bucket_id = 'products' );

-- Allow authenticated users to upload to products bucket
drop policy if exists "Authenticated users can upload to products" on storage.objects;
create policy "Authenticated users can upload to products"
  on storage.objects
  for insert
  with check (
    bucket_id = 'products' and auth.role() = 'authenticated'
  );

-- Allow owners to update their own objects in products bucket
drop policy if exists "Owners can update products objects" on storage.objects;
create policy "Owners can update products objects"
  on storage.objects
  for update
  using (
    bucket_id = 'products' and auth.uid() = owner
  )
  with check (
    bucket_id = 'products' and auth.uid() = owner
  );

-- Allow owners to delete their own objects in products bucket
drop policy if exists "Owners can delete products objects" on storage.objects;
create policy "Owners can delete products objects"
  on storage.objects
  for delete
  using (
    bucket_id = 'products' and auth.uid() = owner
  );

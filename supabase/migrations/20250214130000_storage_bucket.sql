/*
  # Create Storage Bucket for Portfolio
  
  ## Query Description:
  This migration sets up the Supabase Storage bucket for portfolio images and configures Row Level Security (RLS) policies.
  
  ## Metadata:
  - Schema-Category: "Storage"
  - Impact-Level: "Medium"
  - Requires-Backup: false
  - Reversible: true
  
  ## Structure Details:
  - Creates 'portfolio' bucket
  - Adds RLS policies for:
    - Public SELECT (viewing images)
    - Authenticated INSERT (uploading images)
    - Authenticated DELETE (removing images)
*/

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS (Row Level Security) on objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to view images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'portfolio' );

-- Policy: Allow authenticated users (admins) to upload images
CREATE POLICY "Auth Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'portfolio' 
  AND auth.role() = 'authenticated'
);

-- Policy: Allow authenticated users (admins) to update images
CREATE POLICY "Auth Update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'portfolio' 
  AND auth.role() = 'authenticated'
);

-- Policy: Allow authenticated users (admins) to delete images
CREATE POLICY "Auth Delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'portfolio' 
  AND auth.role() = 'authenticated'
);

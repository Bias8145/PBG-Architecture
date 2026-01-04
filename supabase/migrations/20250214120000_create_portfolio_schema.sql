/*
  # Create Portfolio Schema

  ## Query Description:
  This migration creates the necessary table for storing portfolio items.
  It also enables Row Level Security (RLS) to ensure data safety.

  ## Metadata:
  - Schema-Category: "Structural"
  - Impact-Level: "Medium"
  - Requires-Backup: false
  - Reversible: true

  ## Structure Details:
  - Table: public.portfolio
    - id: uuid (primary key)
    - title: text
    - description: text
    - image_url: text
    - category: text
    - created_at: timestamptz

  ## Security Implications:
  - RLS Enabled on public.portfolio
  - Public can READ (SELECT)
  - Authenticated users (Admins) can INSERT, UPDATE, DELETE
*/

-- Create the portfolio table
CREATE TABLE IF NOT EXISTS public.portfolio (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;

-- Create Policy: Allow public read access
CREATE POLICY "Allow public read access" 
ON public.portfolio 
FOR SELECT 
USING (true);

-- Create Policy: Allow authenticated insert
CREATE POLICY "Allow authenticated insert" 
ON public.portfolio 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Create Policy: Allow authenticated update
CREATE POLICY "Allow authenticated update" 
ON public.portfolio 
FOR UPDATE 
TO authenticated 
USING (true);

-- Create Policy: Allow authenticated delete
CREATE POLICY "Allow authenticated delete" 
ON public.portfolio 
FOR DELETE 
TO authenticated 
USING (true);

/*
  # Create user files schema

  1. New Tables
    - `user_files`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `content` (text)
      - `path` (text)
      - `language` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `user_files` table
    - Add policies for authenticated users to manage their own files
*/

CREATE TABLE IF NOT EXISTS user_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  content text,
  path text NOT NULL,
  language text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_files ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to select their own files
CREATE POLICY "Users can read own files"
  ON user_files
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy to allow users to insert their own files
CREATE POLICY "Users can insert own files"
  ON user_files
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own files
CREATE POLICY "Users can update own files"
  ON user_files
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to delete their own files
CREATE POLICY "Users can delete own files"
  ON user_files
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
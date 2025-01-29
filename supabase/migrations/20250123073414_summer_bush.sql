/*
  # Create user folders schema

  1. New Tables
    - `user_folders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `path` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `user_folders` table
    - Add policies for authenticated users to manage their own folders
*/

CREATE TABLE IF NOT EXISTS user_folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  path text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_folders ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to select their own folders
CREATE POLICY "Users can read own folders"
  ON user_folders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy to allow users to insert their own folders
CREATE POLICY "Users can insert own folders"
  ON user_folders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own folders
CREATE POLICY "Users can update own folders"
  ON user_folders
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to delete their own folders
CREATE POLICY "Users can delete own folders"
  ON user_folders
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
-- Run this SQL in your Supabase SQL Editor to set up the database schema

CREATE TABLE IF NOT EXISTS models (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'Text',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  model_id INTEGER REFERENCES models(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  pros TEXT,
  cons TEXT,
  author TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_model_id ON reviews(model_id);

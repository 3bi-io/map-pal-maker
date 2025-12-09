-- Create table for storing location updates
CREATE TABLE public.location_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_id TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  accuracy DOUBLE PRECISION,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries by tracking_id
CREATE INDEX idx_location_updates_tracking_id ON public.location_updates(tracking_id);
CREATE INDEX idx_location_updates_created_at ON public.location_updates(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.location_updates ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert location updates (tracking links are public)
CREATE POLICY "Anyone can insert location updates"
ON public.location_updates
FOR INSERT
WITH CHECK (true);

-- Allow anyone to read location updates by tracking_id
CREATE POLICY "Anyone can read location updates"
ON public.location_updates
FOR SELECT
USING (true);

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE public.location_updates;
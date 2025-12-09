-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create app_role enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

-- Create trackers table
CREATE TABLE public.trackers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_id TEXT NOT NULL UNIQUE,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'My Tracker',
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  password_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on trackers
ALTER TABLE public.trackers ENABLE ROW LEVEL SECURITY;

-- Tracker policies
CREATE POLICY "Owners can view their own trackers"
ON public.trackers FOR SELECT
USING (auth.uid() = owner_id);

CREATE POLICY "Owners can insert their own trackers"
ON public.trackers FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their own trackers"
ON public.trackers FOR UPDATE
USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their own trackers"
ON public.trackers FOR DELETE
USING (auth.uid() = owner_id);

-- Anyone can check if a tracker exists and is active (for TrackView)
CREATE POLICY "Anyone can check tracker status"
ON public.trackers FOR SELECT
USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

-- Update location_updates to reference trackers
ALTER TABLE public.location_updates 
ADD COLUMN tracker_id UUID REFERENCES public.trackers(id) ON DELETE CASCADE;

-- Update RLS for location_updates - only allow inserts for active trackers
DROP POLICY IF EXISTS "Anyone can insert location updates " ON public.location_updates;
CREATE POLICY "Insert location for active trackers"
ON public.location_updates FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.trackers 
    WHERE tracking_id = location_updates.tracking_id 
    AND is_active = true 
    AND (expires_at IS NULL OR expires_at > now())
  )
);

-- Update RLS for reading - owners can read their tracker locations
DROP POLICY IF EXISTS "Anyone can read location updates " ON public.location_updates;
CREATE POLICY "Owners can read their tracker locations"
ON public.location_updates FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.trackers 
    WHERE tracking_id = location_updates.tracking_id 
    AND owner_id = auth.uid()
  )
);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1))
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trackers_updated_at
  BEFORE UPDATE ON public.trackers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
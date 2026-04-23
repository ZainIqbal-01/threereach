-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- ============ HELPER: updated_at trigger fn ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own profile" ON public.profiles
  FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ AUTO-CREATE PROFILE + ROLE ON SIGNUP ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data ->> 'avatar_url'
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ BUSINESS PROFILES ============
CREATE TABLE public.business_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  website TEXT,
  industry TEXT,
  description TEXT,
  detailed_info TEXT,
  target_audience TEXT,
  competitors TEXT[],
  links TEXT[],
  onboarding_complete BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_business_profiles_user ON public.business_profiles(user_id);

ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own business" ON public.business_profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own business" ON public.business_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own business" ON public.business_profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own business" ON public.business_profiles
  FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_business_profiles_updated_at
  BEFORE UPDATE ON public.business_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ BUSINESS RESOURCES (uploaded docs/links metadata) ============
CREATE TABLE public.business_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_profile_id UUID REFERENCES public.business_profiles(id) ON DELETE CASCADE,
  kind TEXT NOT NULL DEFAULT 'document', -- document | link | note
  title TEXT,
  url TEXT,
  notes TEXT,
  file_name TEXT,
  file_path TEXT,
  file_size BIGINT,
  mime_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_business_resources_user ON public.business_resources(user_id);

ALTER TABLE public.business_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own resources" ON public.business_resources
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own resources" ON public.business_resources
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own resources" ON public.business_resources
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own resources" ON public.business_resources
  FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_business_resources_updated_at
  BEFORE UPDATE ON public.business_resources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ SCAN HISTORY ============
CREATE TABLE public.scan_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_profile_id UUID REFERENCES public.business_profiles(id) ON DELETE CASCADE,
  engine TEXT NOT NULL, -- chatgpt | gemini | perplexity | claude | copilot | aggregate
  query TEXT,
  status TEXT, -- mentioned | weak | not_found | strong
  confidence NUMERIC,
  score NUMERIC,
  response_text TEXT,
  raw_results JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_scan_history_user_created ON public.scan_history(user_id, created_at DESC);

ALTER TABLE public.scan_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own scans" ON public.scan_history
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own scans" ON public.scan_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own scans" ON public.scan_history
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own scans" ON public.scan_history
  FOR DELETE USING (auth.uid() = user_id);

-- ============ AGENT RUNS ============
CREATE TABLE public.agent_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id TEXT NOT NULL, -- nova | oracle | echo | etc.
  status TEXT NOT NULL DEFAULT 'pending', -- pending | running | success | failed
  input JSONB,
  output JSONB,
  error TEXT,
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_agent_runs_user_created ON public.agent_runs(user_id, created_at DESC);

ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own runs" ON public.agent_runs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own runs" ON public.agent_runs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own runs" ON public.agent_runs
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own runs" ON public.agent_runs
  FOR DELETE USING (auth.uid() = user_id);

-- ============ STORAGE BUCKET ============
INSERT INTO storage.buckets (id, name, public)
VALUES ('business-resources', 'business-resources', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users view own resource files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'business-resources'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users upload own resource files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'business-resources'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users update own resource files"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'business-resources'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users delete own resource files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'business-resources'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
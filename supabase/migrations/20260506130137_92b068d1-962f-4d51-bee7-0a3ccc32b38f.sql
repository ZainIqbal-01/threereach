
CREATE TABLE public.github_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  github_username TEXT,
  encrypted_token TEXT NOT NULL,
  default_repo TEXT,
  default_branch TEXT DEFAULT 'main',
  scopes TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);
ALTER TABLE public.github_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users view own gh" ON public.github_connections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users insert own gh" ON public.github_connections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users update own gh" ON public.github_connections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "users delete own gh" ON public.github_connections FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER github_connections_updated_at BEFORE UPDATE ON public.github_connections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.optimization_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  repo TEXT NOT NULL,
  branch TEXT NOT NULL,
  website_url TEXT,
  scope TEXT[] NOT NULL DEFAULT ARRAY['seo','geo','sitemap','perf']::text[],
  status TEXT NOT NULL DEFAULT 'pending',
  pr_url TEXT,
  pr_number INTEGER,
  files_changed INTEGER DEFAULT 0,
  summary TEXT,
  error TEXT,
  diff_preview JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.optimization_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users view own opt" ON public.optimization_runs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users insert own opt" ON public.optimization_runs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users update own opt" ON public.optimization_runs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "users delete own opt" ON public.optimization_runs FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER optimization_runs_updated_at BEFORE UPDATE ON public.optimization_runs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

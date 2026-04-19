-- Schools table
CREATE TABLE public.schools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  student_count_estimate TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_schools_owner ON public.schools(owner_id);

ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view their school"
  ON public.schools FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can create their school"
  ON public.schools FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their school"
  ON public.schools FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their school"
  ON public.schools FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  roll_no TEXT NOT NULL,
  class_name TEXT NOT NULL,
  section TEXT NOT NULL,
  gender TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  parent_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT NOT NULL,
  admission_date DATE NOT NULL,
  blood_group TEXT NOT NULL,
  emergency_contact TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_students_school ON public.students(school_id);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Security definer helper to check school ownership without recursion
CREATE OR REPLACE FUNCTION public.is_school_owner(_school_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.schools
    WHERE id = _school_id AND owner_id = auth.uid()
  )
$$;

CREATE POLICY "School owners can view their students"
  ON public.students FOR SELECT
  TO authenticated
  USING (public.is_school_owner(school_id));

CREATE POLICY "School owners can insert their students"
  ON public.students FOR INSERT
  TO authenticated
  WITH CHECK (public.is_school_owner(school_id));

CREATE POLICY "School owners can update their students"
  ON public.students FOR UPDATE
  TO authenticated
  USING (public.is_school_owner(school_id));

CREATE POLICY "School owners can delete their students"
  ON public.students FOR DELETE
  TO authenticated
  USING (public.is_school_owner(school_id));

-- Shared updated_at trigger function
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

CREATE TRIGGER update_schools_updated_at
  BEFORE UPDATE ON public.schools
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
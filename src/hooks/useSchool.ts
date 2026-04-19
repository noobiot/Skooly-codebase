import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type School = {
  id: string;
  name: string;
  city: string;
  student_count_estimate: string | null;
};

export function useSchool() {
  const { user, loading: authLoading } = useAuth();
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setSchool(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    supabase
      .from("schools")
      .select("id, name, city, student_count_estimate")
      .eq("owner_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) {
          setSchool(data ?? null);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  return { school, loading };
}

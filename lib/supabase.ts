import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xcqrclemivkfgbjdeufa.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjcXJjbGVtaXZrZmdiamRldWZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDYzNzMxNywiZXhwIjoyMDc2MjEzMzE3fQ.or9b2FRb7_AUbjOUBjCGyV3VffBkLl_Jzdk44-rleNk";

export const supabase = createClient(supabaseUrl, supabaseKey);

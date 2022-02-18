// creates supabase client
// Delete if we migrate from supabase to different backend

import { createClient } from "@supabase/supabase-js";

//const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
//const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabaseUrl='https://qyvzpqbyxsjwquhsxlcn.supabase.co';
const supabaseAnonKey='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dnpwcWJ5eHNqd3F1aHN4bGNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDQ4OTIxNDksImV4cCI6MTk2MDQ2ODE0OX0.xrbqcCpZal4MLKPg_oSzp_iN3WUHSsiABFfpgkcZzCI';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

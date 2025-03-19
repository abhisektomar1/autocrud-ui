// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
// const githubCallbackUrl = import.meta.env.VITE_GITHUB_CALLBACK_URL;

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Supabase environment variables are missing.');
// }

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);


// export const signInWithGitHub = async () => {
//     const { data, error } = await supabase.auth.signInWithOAuth({
//       provider: "github",
//       options: {
//         redirectTo: githubCallbackUrl,
//       },
//     });
//     if (error) {
//       throw error;
//     }
//     return data;
//   };
         
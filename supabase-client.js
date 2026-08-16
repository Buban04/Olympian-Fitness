import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase/config.js';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function getProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('usuarios')
    .select('id,nombre_completo,correo,telefono,rol_id,activo,roles(nombre)')
    .eq('id', user.id)
    .maybeSingle();
  if (error) throw error;
  return data ? { ...data, rol: data.roles?.nombre || 'usuario' } : null;
}

export async function signOut() {
  await supabase.auth.signOut();
  location.href = './index.html';
}

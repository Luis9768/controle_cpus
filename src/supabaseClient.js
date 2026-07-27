import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const BACKUP_ID = 'gestao-cpus-data';

// Helper para sanitizar strings e prevenir ataques XSS
export function sanitizeInput(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&#39;';
      case '"': return '&quot;';
      default: return c;
    }
  }).trim();
}

// Buscar dados em tempo real da nuvem (Supabase)
export async function fetchCloudData() {
  try {
    const { data, error } = await supabase
      .from('backups')
      .select('data')
      .eq('id', BACKUP_ID)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao buscar dados na nuvem:', error.message);
      return null;
    }

    return data?.data || null;
  } catch (err) {
    console.error('Falha de conexão com a nuvem:', err);
    return null;
  }
}

// Salvar dados em tempo real na nuvem (Supabase)
export async function saveCloudData(payload) {
  try {
    const backupData = {
      ...payload,
      timestamp: new Date().toISOString()
    };

    const { error } = await supabase
      .from('backups')
      .insert([{
        id: BACKUP_ID,
        data: backupData
      }], { upsert: true });

    if (error) {
      console.error('Erro ao salvar dados na nuvem:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Falha ao enviar para a nuvem:', err);
    return false;
  }
}

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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

// Buscar dados da nuvem no Supabase
export async function fetchCloudData() {
  try {
    const { data, error } = await supabase
      .from('backups')
      .select('data')
      .limit(1);

    if (error) {
      console.warn('Supabase busca:', error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data[0].data;
    }

    return null;
  } catch (err) {
    console.error('Falha de conexão com a nuvem:', err);
    return null;
  }
}

// Salvar dados na nuvem no Supabase
export async function saveCloudData(payload) {
  try {
    const backupData = {
      ...payload,
      timestamp: new Date().toISOString()
    };

    const { error } = await supabase
      .from('backups')
      .upsert({ id: 1, data: backupData });

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

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export default function Settings({ cpus, rooms, history, usersList, updateData }) {
  const [statusMsg, setStatusMsg] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const showStatus = (msg, error = false) => {
    setStatusMsg(msg);
    setIsError(error);
    setTimeout(() => setStatusMsg(''), 5000);
  };

  const getClient = () => {
    return createClient(SUPABASE_URL, SUPABASE_KEY);
  };

  const handleBackup = async () => {
    setIsLoading(true);
    const supabase = getClient();
    showStatus('Sincronizando com a nuvem...');

    const backupData = { cpus, rooms, history, users: usersList, timestamp: new Date().toISOString() };
    
    const { error } = await supabase
      .from('backups')
      .upsert({ id: 1, data: backupData });

    setIsLoading(false);
    if (error) {
      console.error(error);
      showStatus('Erro ao sincronizar. Verifique sua conexão e tente novamente.', true);
    } else {
      showStatus('Backup realizado com sucesso na nuvem!');
    }
  };

  const handleRestore = async () => {
    setIsLoading(true);
    const supabase = getClient();
    showStatus('Buscando backup na nuvem...');

    const { data, error } = await supabase
      .from('backups')
      .select('data')
      .eq('id', 1)
      .single();

    setIsLoading(false);
    if (error || !data) {
      showStatus('Nenhum backup encontrado ou erro ao restaurar.', true);
    } else {
      const restored = data.data;
      if (restored) {
        updateData({ 
          cpus: restored.cpus || [], 
          rooms: restored.rooms || [], 
          history: restored.history || [],
          users: (restored.users && restored.users.length > 0) ? restored.users : usersList
        });
        showStatus('Base de dados restaurada com sucesso!');
      }
    }
  };

  return (
    <div className="settings-manager">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2>Backup em Nuvem</h2>
          <p className="text-muted">Seus dados estão sendo salvos e protegidos via Supabase.</p>
        </div>
      </div>
      
      <div className="glass-card" style={{maxWidth: '500px', width: '100%'}}>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4" style={{padding: '16px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '12px'}}>
            <div style={{width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary-color)', boxShadow: '0 0 10px var(--primary-color)'}}></div>
            <div>
              <strong style={{color: 'var(--primary-color)', display: 'block'}}>Conexão Ativa</strong>
              <span className="text-sm text-muted">Projeto Supabase conectado automaticamente.</span>
            </div>
          </div>
          
          {statusMsg && (
            <div style={{padding: '12px', borderRadius: '8px', fontSize: '0.9rem', textAlign: 'center', background: isError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', color: isError ? '#ef4444' : '#22c55e'}}>
              {statusMsg}
            </div>
          )}

          <div className="flex gap-4">
            <button onClick={handleBackup} className="primary btn-glow flex-1" disabled={isLoading}>
              {isLoading ? 'Sincronizando...' : 'Fazer Backup Agora'}
            </button>
            <button onClick={handleRestore} className="flex-1" style={{border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-color)'}} disabled={isLoading}>
              Restaurar Dados
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

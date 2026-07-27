import { useState } from 'react';
import { supabase } from './supabaseClient';

export default function Settings() {
  return (
    <div className="settings-manager">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2>Configurações do Sistema</h2>
          <p className="text-muted">Status da conexão em tempo real com a nuvem.</p>
        </div>
      </div>
      
      <div className="glass-card" style={{maxWidth: '500px', width: '100%'}}>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4" style={{padding: '16px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '12px'}}>
            <div style={{
              width: '12px', height: '12px', borderRadius: '50%', 
              background: '#22c55e', boxShadow: '0 0 10px #22c55e',
              animation: 'pulse 2s infinite'
            }}></div>
            <div>
              <strong style={{color: '#22c55e', display: 'block'}}>Conexão em Tempo Real Ativa</strong>
              <span className="text-sm text-muted">Todos os dados são salvos instantaneamente na nuvem. Nenhum backup manual é necessário!</span>
            </div>
          </div>

          <div style={{padding: '16px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', fontSize: '0.9rem', color: 'var(--text-color)'}}>
            <h4 style={{marginBottom: '8px', color: 'var(--primary-color)'}}>Como funciona agora?</h4>
            <ul style={{marginLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <li>Toda vez que você mover uma CPU ou criar uma sala, a nuvem é atualizada na mesma hora.</li>
              <li>Se o seu computador desligar do nada, nenhuma informação será perdida.</li>
              <li>Sua equipe inteira pode acessar simultaneamente e ver as mudanças ao vivo.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

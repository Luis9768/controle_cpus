import { useState, useEffect } from 'react';
import './Login.css';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.readDB().then(data => {
        if (data && data.users) {
          setUsers(data.users);
        }
      });
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, preencha e-mail e senha.');
      return;
    }

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      setError('Credenciais inválidas.');
      return;
    }

    onLogin(user);
  };

  return (
    <div className="login-container flex flex-col items-center justify-center">
      <div className="glass-card login-card">
        <h2 className="login-title">Gestão de CPUs</h2>
        <p className="login-subtitle">Bem-vindo(a) de volta</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="input-group">
            <label>E-mail Corporativo</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@headsetbrasil.com" 
              className="premium-input"
            />
          </div>
          
          <div className="input-group">
            <label>Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="premium-input"
            />
          </div>
          
          <button type="submit" className="primary btn-glow mt-2 w-full">Entrar no Sistema</button>
        </form>
      </div>
      
      {/* Background decoration */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
    </div>
  );
}

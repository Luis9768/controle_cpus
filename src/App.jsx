import { useState, useEffect } from 'react'
import Login from './Login'
import RoomsManager from './RoomsManager'
import CpuInventory from './CpuInventory'
import History from './History'
import Settings from './Settings'
import UsersManager from './UsersManager'
import { fetchCloudData, saveCloudData } from './supabaseClient'
import './index.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('gestao-cpus-user');
  })
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('gestao-cpus-user');
    return saved ? JSON.parse(saved) : null;
  })
  const [theme, setTheme] = useState('dark')
  const [loading, setLoading] = useState(true)
  
  // Data state
  const [cpus, setCpus] = useState([])
  const [rooms, setRooms] = useState([])
  const [history, setHistory] = useState([])
  const [usersList, setUsersList] = useState([])
  
  const [activeTab, setActiveTab] = useState('dashboard')

  const applyDataState = (data) => {
    if (!data) return;
    let loadedRooms = data.rooms || [];
    
    loadedRooms.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA === 'tim') return -1;
      if (nameB === 'tim') return 1;
      if (nameA === 'affix') return -1;
      if (nameB === 'affix') return 1;
      return 0;
    });

    setCpus(data.cpus || []);
    setRooms(loadedRooms);
    setHistory(data.history || []);
    setUsersList(data.users || []);
    if (data.settings?.theme) {
      setTheme(data.settings.theme);
      document.documentElement.setAttribute('data-theme', data.settings.theme);
    }
  };

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      // 1. Tentar buscar da nuvem (Supabase)
      const cloudData = await fetchCloudData();
      if (cloudData) {
        applyDataState(cloudData);
      } else if (window.electronAPI) {
        // Fallback local se estiver rodando via Electron desktop
        const localData = await window.electronAPI.readDB();
        applyDataState(localData);
      } else {
        // Default inicial para sala de TIM e Affix se estiver zerado na nuvem
        applyDataState({
          rooms: [
            { id: 1, name: 'TIM', capacity: 24, paStatus: [] },
            { id: 2, name: 'Affix', capacity: 28, paStatus: [] }
          ],
          cpus: [],
          history: [],
          users: [
            {
              id: 1,
              name: 'Luis Miguel',
              email: 'luis.miguel@headsetbrasil.com',
              password: 'Headset@2021#$!',
              role: 'admin'
            }
          ]
        });
      }
      setLoading(false);
    };

    initData();
  }, []);

  const updateData = async (newData) => {
    const payload = {
      cpus,
      rooms,
      history,
      users: usersList,
      settings: { theme },
      ...newData
    };

    // Salvar na nuvem (Supabase)
    await saveCloudData(payload);

    // Salvar localmente se for Electron
    if (window.electronAPI) {
      window.electronAPI.writeDB(payload);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    updateData({ settings: { theme: newTheme } });
  };

  const handleLogin = (loggedUser) => {
    setUser(loggedUser);
    setIsAuthenticated(true);
    localStorage.setItem('gestao-cpus-user', JSON.stringify(loggedUser));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('gestao-cpus-user');
  };

  if (loading) {
    return (
      <div className="login-container flex items-center justify-center text-center">
        <div className="glass-card">
          <h3 className="login-title">Gestão de CPUs</h3>
          <p className="text-muted mt-2">Conectando ao banco de dados na nuvem...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2>Gestão de CPUs</h2>
        <div className="user-info text-sm text-muted mb-4">
          Logado como:<br/><strong>{user?.name || user?.email}</strong><br/>
          <span style={{fontSize: '0.75rem', color: 'var(--primary-color)'}}>{user?.role === 'admin' ? 'Administrador' : 'Usuário Comum'}</span>
        </div>
        
        <nav className="flex flex-col gap-2">
          <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            Dashboard
          </div>
          <div className={`nav-item ${activeTab === 'rooms' ? 'active' : ''}`} onClick={() => setActiveTab('rooms')}>
            Gestão de Salas
          </div>
          <div className={`nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
            Histórico
          </div>
          {user?.role === 'admin' && (
            <>
              <div className={`nav-item ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>
                Estoque de CPUs
              </div>
              <div className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                Gestão de Usuários
              </div>
              <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                Configurações e Backup
              </div>
            </>
          )}
        </nav>

        <button className="theme-toggle mt-auto" onClick={toggleTheme}>
          {theme === 'light' ? '🌙 Modo Escuro' : '☀️ Modo Claro'}
        </button>
        <button onClick={handleLogout} className="mt-2" style={{background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-color)'}}>
          Sair
        </button>
      </aside>
      
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <div>
            <h2>Dashboard</h2>
            <div className="flex gap-4 mt-4 flex-wrap">
              <div className="card flex-1" style={{minWidth: '200px'}}>
                <h3>Total de Salas</h3>
                <p style={{fontSize: '2rem', fontWeight: 'bold'}}>{rooms.length}</p>
              </div>
              <div className="card flex-1" style={{minWidth: '200px'}}>
                <h3>CPUs no Estoque</h3>
                <p style={{fontSize: '2rem', fontWeight: 'bold'}}>{cpus.filter(c => c.location === 'estoque').length}</p>
              </div>
              <div className="card flex-1" style={{minWidth: '200px'}}>
                <h3>Total de CPUs</h3>
                <p style={{fontSize: '2rem', fontWeight: 'bold'}}>{cpus.length}</p>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'rooms' && (
          <RoomsManager 
            cpus={cpus} setCpus={setCpus} 
            rooms={rooms} setRooms={setRooms} 
            history={history} setHistory={setHistory} 
            updateData={updateData} 
          />
        )}
        {activeTab === 'inventory' && (
          <CpuInventory 
            cpus={cpus} setCpus={setCpus} 
            rooms={rooms}
            updateData={updateData} 
          />
        )}
        {activeTab === 'history' && (
          <History history={history} setHistory={setHistory} updateData={updateData} />
        )}
        {activeTab === 'users' && user?.role === 'admin' && (
          <UsersManager usersList={usersList} setUsersList={setUsersList} updateData={updateData} currentUser={user} />
        )}
        {activeTab === 'settings' && user?.role === 'admin' && (
          <Settings cpus={cpus} rooms={rooms} history={history} usersList={usersList} updateData={updateData} />
        )}
      </main>
    </div>
  )
}

export default App

import { useState, useEffect } from 'react'
import Login from './Login'
import RoomsManager from './RoomsManager'
import CpuInventory from './CpuInventory'
import History from './History'
import Settings from './Settings'
import UsersManager from './UsersManager'
import './index.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [theme, setTheme] = useState('light')
  
  // Data state
  const [cpus, setCpus] = useState([])
  const [rooms, setRooms] = useState([])
  const [history, setHistory] = useState([])
  const [usersList, setUsersList] = useState([])
  
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    // Carregar tema e dados iniciais
    if (window.electronAPI) {
      window.electronAPI.readDB().then(data => {
        if (data) {
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

          setCpus(data.cpus || [])
          setRooms(loadedRooms)
          setHistory(data.history || [])
          setUsersList(data.users || [])
          if (data.settings?.theme) {
            setTheme(data.settings.theme)
            document.documentElement.setAttribute('data-theme', data.settings.theme)
          }
        }
      })
    }
  }, [])

  const updateData = (newData) => {
    if (window.electronAPI) {
      window.electronAPI.readDB().then(data => {
        const payload = { ...data, ...newData };
        window.electronAPI.writeDB(payload);
      });
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    
    if (window.electronAPI) {
      window.electronAPI.readDB().then(data => {
        const newData = { ...data, settings: { ...data.settings, theme: newTheme } };
        window.electronAPI.writeDB(newData);
      });
    }
  }

  const handleLogin = (loggedUser) => {
    setUser(loggedUser)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setUser(null)
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
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
            <div className="flex gap-4 mt-4">
              <div className="card flex-1">
                <h3>Total de Salas</h3>
                <p style={{fontSize: '2rem', fontWeight: 'bold'}}>{rooms.length}</p>
              </div>
              <div className="card flex-1">
                <h3>CPUs no Estoque</h3>
                <p style={{fontSize: '2rem', fontWeight: 'bold'}}>{cpus.filter(c => c.location === 'estoque').length}</p>
              </div>
              <div className="card flex-1">
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

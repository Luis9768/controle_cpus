const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const isDev = !app.isPackaged && (process.defaultApp || /node_modules[\\/]electron[\\/]/.test(process.execPath));
const dbPath = path.join(app.getPath('userData'), 'db.json');

// Helper para inicializar o DB
function initDB() {
  let data = {};
  const defaultData = {
    users: [
      {
        id: 1,
        name: 'Luis Miguel',
        email: 'luis.miguel@headsetbrasil.com',
        password: 'Headset@2021#$!',
        role: 'admin'
      }
    ],
    cpus: [],
    rooms: [
      { id: 1, name: 'Sala 1', capacity: 24, paStatus: [] },
      { id: 2, name: 'Sala 2', capacity: 28, paStatus: [] }
    ],
    history: [],
    settings: { theme: 'dark' }
  };

  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2));
  } else {
    try {
      data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      let needsSave = false;
      if (!data.users) {
        data.users = defaultData.users;
        needsSave = true;
      }
      if (needsSave) {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
      }
    } catch (e) {}
  }
}

function createWindow() {
  initDB();

  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    show: false, // para mostrar apenas quando estiver pronto
  });

  win.once('ready-to-show', () => {
    win.show();
  });

  if (isDev) {
    // Em dev, carrega do servidor do vite
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    // Em prod, carrega os arquivos estáticos buildados
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// --- IPC Handlers (Para comunicação com o React) ---

ipcMain.handle('read-db', () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler db.json', error);
    return null;
  }
});

ipcMain.handle('write-db', (event, newData) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(newData, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Erro ao escrever db.json', error);
    return { success: false, error: error.message };
  }
});

const { app, BrowserWindow, ipcMain } = require('electron');
const { exec, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

let mainWindow;
let pythonSubprocess = null;
let agentStatus = 'idle'; // idle | installing | ready | running | error
let installLogs = [];

// Determine OS-specific paths for Python Virtual Environment
const isWindows = process.platform === 'win32';
const venvDir = path.join(__dirname, '.venv');
const pythonExec = isWindows 
  ? path.join(venvDir, 'Scripts', 'python.exe') 
  : path.join(venvDir, 'bin', 'python');
const pipExec = isWindows 
  ? path.join(venvDir, 'Scripts', 'pip.exe') 
  : path.join(venvDir, 'bin', 'pip');

function logInstall(message) {
  console.log(`[Venv Setup] ${message}`);
  installLogs.push(message);
  if (mainWindow) {
    mainWindow.webContents.send('installation-progress', {
      status: agentStatus,
      message,
      logs: installLogs
    });
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Load the web app URL. Fallback to local port 3000.
  const webAppUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  mainWindow.loadURL(webAppUrl);

  // Check if virtual environment and requirements are already set up
  if (fs.existsSync(pythonExec) && fs.existsSync(venvDir)) {
    agentStatus = 'ready';
  }

  mainWindow.on('closed', () => {
    stopPythonAgent();
    mainWindow = null;
  });
}

// 1. Python Environment Auto-Installer Flow
function runCommand(command, cwd = __dirname) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
      } else {
        resolve(stdout);
      }
    });
  });
}

async function setupPythonEnvironment() {
  agentStatus = 'installing';
  installLogs = [];
  logInstall("Checking local Python installation...");

  let pythonCmd = 'python';
  try {
    await runCommand('python --version');
  } catch (e) {
    try {
      await runCommand('python3 --version');
      pythonCmd = 'python3';
    } catch (err) {
      agentStatus = 'error';
      logInstall("Error: Python is not installed or not in system PATH. Please install Python 3 and restart the app.");
      return;
    }
  }

  logInstall("Found Python. Creating virtual environment (.venv)...");
  try {
    if (!fs.existsSync(venvDir)) {
      await runCommand(`${pythonCmd} -m venv .venv`);
      logInstall("Virtual environment successfully created.");
    } else {
      logInstall("Virtual environment (.venv) already exists. Upgrading packages...");
    }
  } catch (err) {
    agentStatus = 'error';
    logInstall(`Failed to create venv: ${err}`);
    return;
  }

  logInstall("Installing required Python libraries in background...");
  const reqPath = path.join(__dirname, 'requirements.txt');
  const installCmd = `"${pipExec}" install -r "${reqPath}"`;
  
  try {
    await runCommand(installCmd);
    agentStatus = 'ready';
    logInstall("Setup Complete! All monitoring components downloaded successfully.");
  } catch (err) {
    agentStatus = 'error';
    logInstall(`Failed to install requirements: ${err}`);
  }
}

// 2. Manage Python Agent Subprocess
function startPythonAgent(wsUrl) {
  if (pythonSubprocess) {
    stopPythonAgent();
  }

  const agentScriptPath = path.join(__dirname, 'agent.py');
  const dbPath = path.join(app.getPath('userData'), 'telemetry_buffer.db');
  
  logInstall(`Spawning monitoring agent with DB: ${dbPath}`);
  
  pythonSubprocess = spawn(pythonExec, [
    agentScriptPath, 
    '--ws-url', wsUrl,
    '--db-path', dbPath
  ], {
    cwd: __dirname
  });

  agentStatus = 'running';

  pythonSubprocess.stdout.on('data', (data) => {
    const logStr = data.toString().trim();
    console.log(`[Python Agent] ${logStr}`);
    if (mainWindow) {
      mainWindow.webContents.send('agent-log', logStr);
    }
  });

  pythonSubprocess.stderr.on('data', (data) => {
    const logStr = data.toString().trim();
    console.error(`[Python Agent Error] ${logStr}`);
    if (mainWindow) {
      mainWindow.webContents.send('agent-log', `ERROR: ${logStr}`);
    }
  });

  pythonSubprocess.on('close', (code) => {
    console.log(`[Python Agent] Subprocess exited with code ${code}`);
    pythonSubprocess = null;
    if (agentStatus === 'running') {
      agentStatus = 'ready';
    }
  });
}

function stopPythonAgent() {
  if (pythonSubprocess) {
    console.log("[Electron] Stopping Python Agent subprocess...");
    pythonSubprocess.kill();
    pythonSubprocess = null;
    agentStatus = 'ready';
  }
}

// 3. Register IPC Handlers
ipcMain.handle('get-agent-status', () => {
  return agentStatus;
});

ipcMain.on('start-installation', () => {
  if (agentStatus !== 'installing' && agentStatus !== 'running') {
    setupPythonEnvironment();
  }
});

ipcMain.on('start-agent', (event, wsUrl) => {
  if (agentStatus === 'ready' || agentStatus === 'running' || agentStatus === 'error') {
    startPythonAgent(wsUrl);
  }
});

ipcMain.on('stop-agent', () => {
  stopPythonAgent();
});

// App Lifecycle Hook
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  stopPythonAgent();
  if (process.platform !== 'darwin') app.quit();
});

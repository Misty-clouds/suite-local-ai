/**
 * Suite desktop — Electron main process.
 *
 * Hosts the on-device QVAC inference (qvac.ts) and exposes it to the renderer
 * over IPC, then loads the Suite web dashboard:
 *   • dev  → the running Next.js dev server (http://localhost:3001)
 *   • prod → the bundled Next.js standalone server, spawned on a local port
 *
 * The NestJS API (data/auth) is expected to run locally on :5050. See the
 * README for how to start it (`pnpm dev` or `docker compose up`).
 */
import { app, BrowserWindow, ipcMain } from 'electron';
import { fork, type ChildProcess } from 'node:child_process';
import * as http from 'node:http';
import * as path from 'node:path';
import { chat, insights, getStatus, unload, type ReviewContext } from './qvac';

const DEV = !app.isPackaged;
const WEB_DEV_URL = process.env.SUITE_WEB_URL ?? 'http://localhost:3001';
const PROD_WEB_PORT = Number(process.env.SUITE_WEB_PORT ?? 41730);

let mainWindow: BrowserWindow | null = null;
let webServer: ChildProcess | null = null;

function registerIpc(): void {
  ipcMain.handle(
    'qvac:chat',
    (_e, args: { message: string; context?: string }) =>
      chat(args.message, args.context),
  );
  ipcMain.handle('qvac:insights', (_e, args: { ctx: ReviewContext }) =>
    insights(args.ctx),
  );
  ipcMain.handle('qvac:status', () => getStatus());
}

/** Wait until an HTTP server answers on the given URL (or time out). */
function waitForHttp(url: string, timeoutMs = 30_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  return new Promise((resolve, reject) => {
    const ping = () => {
      const req = http.get(url, (res) => {
        res.destroy();
        resolve();
      });
      req.on('error', () => {
        if (Date.now() > deadline) reject(new Error(`Timed out waiting for ${url}`));
        else setTimeout(ping, 400);
      });
    };
    ping();
  });
}

/** In production, spawn the bundled Next.js standalone server and return its URL. */
async function startProdServer(): Promise<string> {
  // electron-builder copies apps/web/.next/standalone → resources/web.
  const serverEntry = path.join(
    process.resourcesPath,
    'web',
    'apps',
    'web',
    'server.js',
  );
  webServer = fork(serverEntry, [], {
    env: {
      ...process.env,
      PORT: String(PROD_WEB_PORT),
      HOSTNAME: '127.0.0.1',
    },
    stdio: 'inherit',
  });
  const url = `http://127.0.0.1:${PROD_WEB_PORT}`;
  await waitForHttp(url);
  return url;
}

async function createWindow(): Promise<void> {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    backgroundColor: '#0b0b0f',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const url = DEV ? WEB_DEV_URL : await startProdServer();
  await mainWindow.loadURL(url);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  registerIpc();
  void createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) void createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  void unload();
  webServer?.kill();
});

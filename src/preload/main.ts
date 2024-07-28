import { contextBridge } from 'electron';
import methods from '../common/IPCProtocol/client';
import { connectWorker } from '../common/MPConnect/connecter';
declare global {
  interface Window {
    native?: any; // 根据 'methods' 的实际类型替换 'any'
  }
}
document.addEventListener('DOMContentLoaded', () => {
  connectWorker();
})

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('native', methods);
} else {
  window.native = methods;
}

import { contextBridge } from 'electron';
import methods from '../common/IPCProtocol/client';

declare global {
  interface Window {
    native?: any; // 根据 'methods' 的实际类型替换 'any'
  }
}

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('native', methods);
} else {
  window.native = methods;
}

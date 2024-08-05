import { contextBridge } from 'electron';
import methods from '../common/R2M/client';
import r2rServerConnect from '../common/R2R/connecter';
import { R2M_MAIN_WORLD_NAME } from '../common/dictionary';

document.addEventListener('DOMContentLoaded', () => {
  r2rServerConnect();
});

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld(R2M_MAIN_WORLD_NAME, methods);
} else {
  // @ts-ignore
  window[R2M_MAIN_WORLD_NAME] = methods;
}

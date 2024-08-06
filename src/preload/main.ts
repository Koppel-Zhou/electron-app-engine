import { contextBridge } from 'electron';
import methods from '../common/R2M/client';
import r2rConnect from '../common/R2R/connecter';
import m2rServerRegister from '../common/M2R/server';
import { R2M_MAIN_WORLD_NAME } from '../common/dictionary';

document.addEventListener('DOMContentLoaded', () => {
  r2rConnect();
  m2rServerRegister();
});

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld(R2M_MAIN_WORLD_NAME, methods);
} else {
  // @ts-ignore
  window[R2M_MAIN_WORLD_NAME] = methods;
}

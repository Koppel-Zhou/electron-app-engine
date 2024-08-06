import r2mExport from '../SDK/IPC/R2M/client';
import r2rConnect from '../SDK/IPC/R2R/connecter';
import m2rServerRegister from '../SDK/IPC/M2R/server';

document.addEventListener('DOMContentLoaded', () => {
  r2mExport();
  r2rConnect();
  m2rServerRegister();
});

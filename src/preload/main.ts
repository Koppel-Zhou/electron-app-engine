import r2mExport from '../common/R2M/client';
import r2rConnect from '../common/R2R/connecter';
import m2rServerRegister from '../common/M2R/server';

document.addEventListener('DOMContentLoaded', () => {
  r2mExport();
  r2rConnect();
  m2rServerRegister();
});

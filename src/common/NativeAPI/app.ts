import { app } from 'electron';

const openAtLogin = () => {
  const { openAtLogin: currentState } = app.getLoginItemSettings();
  app.setLoginItemSettings({ openAtLogin: !currentState });
};
const getLoginItemSettings = () => {
  return app.getLoginItemSettings();
};

export const methods = {
  openAtLogin,
  getLoginItemSettings,
};

export type KeyType = keyof typeof methods;

export const method_keys = Object.keys(methods) as KeyType[];

export default {
  methods,
  method_keys,
};

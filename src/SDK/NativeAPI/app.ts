import { app } from 'electron';

const method_set: Handlers = {
  openAtLogin() {
    const { openAtLogin: currentState } = app.getLoginItemSettings();
    app.setLoginItemSettings({ openAtLogin: !currentState });
  },
  getLoginItemSettings() {
    return app.getLoginItemSettings();
  },
};

const export_methods: Handlers = {};

Object.keys(method_set).forEach((method_name) => {
  export_methods[`app.${method_name}`] = method_set[method_name];
});

export const methods = export_methods;

export const method_keys = Object.keys(methods);

export default {
  methods: export_methods,
  method_keys,
};

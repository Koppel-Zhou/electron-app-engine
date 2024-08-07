import { ipcRenderer } from 'electron';
import { ERROR, EVENT, R2R_REPEATER_TYPE } from '../SDK/IPC/dictionary';

// MessagePort 对象可以在渲染器或主进程中创建，
// 并使用 [ipcRenderer.postMessage][] 和 [WebContents.postMessage][] 方法互相传递。
// 请注意，通常的 IPC 方法，例如 send 和 invoke 不能用来传输 MessagePort，
// 只有 postMessage 方法可以传输 MessagePort。

// 以窗口 id 为 key, port 为 value 的 port 集合
const portMap = new Map();
// 我们可能会得到多个 clients, 比如有多个 windows,
// 或者假如 main window 重新加载了.
ipcRenderer.on(EVENT.R2R_REGISTER, (regEvent, id) => {
  const [port] = regEvent.ports;
  portMap.set(id, port);
  port.onmessage = (event) => {
    const { from, target, req_id, req_timestamp } = event.data;
    const isNotice = !Object.prototype.hasOwnProperty.call(event.data, 'req_id');
    function sendToTarget(t: Target) {
      if (isNotice && (!portMap.get(t) || t === from)) {
        return 0;
      }
      if (!portMap.get(t)) {
        return portMap.get(from).postMessage({
          jsonrpc: '2.0',
          error: ERROR.TARGET_NOT_FOUND,
          target: from,
          from: R2R_REPEATER_TYPE.MP,
          req_id,
          req_timestamp,
          res_timestamp: Date.now(),
        });
      }
      // 事件数据可以是任何可序列化的对象 (事件甚至可以携带其他 MessagePorts 对象!)
      portMap.get(t).postMessage(event.data);
    }

    if (isNotice) {
      if (Array.isArray(target)) {
        target.forEach((t) => sendToTarget(t));
      } else if (['string', 'number'].includes(typeof target)) {
        sendToTarget(target);
      } else {
        portMap.forEach((_, t) => sendToTarget(t));
      }
    } else {
      sendToTarget(target);
    }
  };
});

ipcRenderer.on(EVENT.R2R_UNREGISTER, (_unregEvent, id) => {
  portMap.delete(id);
});

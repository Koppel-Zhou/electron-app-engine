import { ipcRenderer } from 'electron';
import { EVENT } from '../common/MPConnect/constants';

// MessagePort 对象可以在渲染器或主进程中创建，
// 并使用 [ipcRenderer.postMessage][] 和 [WebContents.postMessage][] 方法互相传递。
// 请注意，通常的 IPC 方法，例如 send 和 invoke 不能用来传输 MessagePort，
// 只有 postMessage 方法可以传输 MessagePort。

// 以窗口 id 为 key, port 为 value 的 port 集合
const portMap = new Map();
// 我们可能会得到多个 clients, 比如有多个 windows,
// 或者假如 main window 重新加载了.
ipcRenderer.on(EVENT.REGISTER, (event, id) => {
  const [port] = event.ports;
  portMap.set(id, port);
  port.onmessage = event => {
    const { target } = event.data;
    // 事件数据可以是任何可序列化的对象 (事件甚至可以携带其他 MessagePorts 对象!)
    portMap.get(target).postMessage(event.data);
  };
});

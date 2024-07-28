import { ipcRenderer } from 'electron';

  // MessagePort 对象可以在渲染器或主进程中创建，
  // 并使用 [ipcRenderer.postMessage][] 和 [WebContents.postMessage][] 方法互相传递。
  // 请注意，通常的 IPC 方法，例如 send 和 invoke 不能用来传输 MessagePort，
  // 只有 postMessage 方法可以传输 MessagePort。
  const doWork = input =>
    // 一些对CPU要求较高的任务
     input * 2;

  // 我们可能会得到多个 clients, 比如有多个 windows,
  // 或者假如 main window 重新加载了.
  console.log('>>>>> worker on new client');
  ipcRenderer.on('new-client', (event, ...args) => {
    console.log('>>>>> in worker on new client', event, args);
    const [port] = event.ports;
    port.onmessage = event => {
      console.log('>>>>> worker onmessage', event);
      // 事件数据可以是任何可序列化的对象 (事件甚至可以携带其他 MessagePorts 对象!)
      const result = doWork(event.data);
      port.postMessage(result);
    };
  });

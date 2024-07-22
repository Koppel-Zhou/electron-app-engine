import { ipcMain } from 'electron';
import { PIPE_PATH, PipeClient, PipeServer } from '.';

export const init = () => {
  if (process.env.PORT === '8888') {
    const rpcServer = new PipeServer(PIPE_PATH);
    rpcServer
      .on('message', (message) => {
        console.log('Get message From Client:', message);
      })
      .on('error', (error) => {
        console.log('NamedPipe Server Error:', error);
      })
      .on('end', () => {
        console.log('NamedPipe Server End...');
      });
    ipcMain.on('namedpipe-send', async () => {
      rpcServer.send({ a: {}, b: 2, c: '3' });
    });
  } else {
    const rpcClient = new PipeClient(PIPE_PATH);
    rpcClient
      .on('message', (message) => {
        console.log('Get message From Client:', message);
      })
      .on('error', (error) => {
        console.log('NamedPipe Server Error:', error);
      })
      .on('end', () => {
        console.log('NamedPipe Server End...');
      });
    ipcMain.on('namedpipe-send', async () => {
      rpcClient.send('get.reply', { a: 1, b: '2', c: [] });
    });
  }
}

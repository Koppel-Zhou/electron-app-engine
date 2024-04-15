import net from 'net';
import logger from 'electron-log';
import {v1 as uuidv1 } from 'uuid';
import EventEmitter from 'events';
let instance: RPCClient | null = null;

class RPCClient extends EventEmitter {
  pipePath!: string;
  clientID!: string;
  client!: net.Socket;
    constructor(pipePath: string) {
      super();
      if (!instance) {
          instance = this;
          this.clientID = uuidv1();
          this.pipePath = pipePath;
          this.connect();
      }
      return instance;
    }

    connect() {
      this.client = net.createConnection(this.pipePath, () => {
        logger.info('NamedPipe Connected');
      });
      this.client.on('data', (data: { toString: () => string; }) => {
        console.log('Get message From Server:', data.toString());
        const message = JSON.parse(data.toString())
        this.emit('message', message)
      });

      this.client.on('error', (error: any) => {
        this.emit('error', error)
      });

      this.client.on('end', () => {
        this.emit('end')
      });
    }

    send(method: string, params: any) {
      const message ={
        jsonrpc: '2.0',
        method,
        params: {
          payload: params,
          rpc_req_id: uuidv1(),
          rpc_timestamp: Date.now()
        },
        id: this.clientID,
      }
      if (!this.client) {
        throw new Error('RPC client is not ready yet.')
      }
      this.client.write(JSON.stringify(message));
    }
}

export default RPCClient;

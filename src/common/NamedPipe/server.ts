import net from 'net';
import EventEmitter from 'events';
import logger from 'electron-log';

let instance: RPCServer | null = null;

class RPCServer extends EventEmitter {
  pipePath!: string;
  server!: net.Server;
  stream!: net.Socket;
  constructor(pipePath: string) {
    super();
    if (!instance) {
      instance = this;
      this.pipePath = pipePath;
      this.server = net.createServer((stream: any) => {
        this.stream = stream;
        logger.info('Server Connected')
        this.stream.on('data', (data: { toString: () => string; }) => {
          logger.info('Get Message From Client:', data.toString())

          const message = JSON.parse(data.toString())
          this.emit('message', message)
        })

        this.stream.on('error', (error) => {
          logger.info('Client Disconnected')
          this.emit('error', error)
        })

        this.stream.on('end', () => {
          logger.info('Client Disconnected')
          this.emit('end')
        })
      });
      this.server.listen(this.pipePath, () => {
        logger.info('NamedPipe Start')
      })
    }
    return instance;
  }





  send(message: any) {
    logger.info('+++> rpc inner send', message);
    if(!this.stream) {
      throw new Error('RPC service is not ready yet.')
    }
    this.stream.write(JSON.stringify(message))
  }

  stop() {
    if(!this.stream) {
      throw new Error('RPC service is not running.')
    }
    this.server.close()
  }
}
export default RPCServer;

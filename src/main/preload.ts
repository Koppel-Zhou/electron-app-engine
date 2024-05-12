import { contextBridge } from 'electron';
import methods from '../common/JSONRPC/client';

contextBridge.exposeInMainWorld('native', methods);

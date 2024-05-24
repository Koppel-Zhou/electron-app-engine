import { contextBridge } from 'electron';
import methods from '../common/IPCProtocol/client';

contextBridge.exposeInMainWorld('native', methods);

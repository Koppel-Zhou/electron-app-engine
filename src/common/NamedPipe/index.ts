import path from 'path';
import PipeServer from './server';
import PipeClient from './client';

const PIPE_PATH = path.join('\\\\?\\pipe', 'ENGINE');
export { PIPE_PATH, PipeClient, PipeServer };

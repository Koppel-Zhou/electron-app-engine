import { createRoot } from 'react-dom/client';
import App from '../../example/App';
import initSentry from '../SDK/sentry';

initSentry();

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);

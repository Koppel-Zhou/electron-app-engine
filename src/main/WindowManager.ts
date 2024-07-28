import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';

class WindowManager {
    private windows: Map<string, BrowserWindow>;

    constructor() {
        this.windows = new Map();
    }

    public createWindow(name: string, url: string, options: BrowserWindowConstructorOptions): BrowserWindow {
        if (this.windows.has(name)) {
            return this.windows.get(name)!;
        }

        const window = new BrowserWindow(options);

        window.loadURL(url);

        this.windows.set(name, window);

        window.on('closed', () => {
            this.windows.delete(name);
        });

        return window;
    }

    public getWindow(name: string): BrowserWindow | undefined {
        return this.windows.get(name);
    }

    public closeAllWindows(): void {
        this.windows.forEach(window => window.close());
    }
}

const WindowMG = new WindowManager();

export default WindowMG;
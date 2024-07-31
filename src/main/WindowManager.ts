import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';

class WindowManager {
    public windows: Map<string | number, BrowserWindow>;
    public names: Map<number, string | number>;
    constructor() {
        this.windows = new Map();
        this.names = new Map();
    }

    public createWindow(name: string, url: string, options: BrowserWindowConstructorOptions): BrowserWindow {
        if (this.windows.has(name)) {
            return this.windows.get(name)!;
        }

        const window = new BrowserWindow(options);

        window.loadURL(url);

        this.windows.set(name || window.id, window);
        this.names.set(window.id, name || window.id);
        window.on('closed', () => {
            this.windows.delete(name);
        });

        return window;
    }

    public getWindowByName(name: string): BrowserWindow | undefined {
        return this.windows.get(name);
    }

    public getWindowNameById(id: number): string | number {
        return this.names.get(id);
    }

    public getWindowById(id: number): BrowserWindow | undefined {
        return this.windows.get(this.getWindowNameById(id));
    }

    public closeAllWindows(): void {
        this.windows.forEach(window => window.close());
    }
}

const WindowMG = new WindowManager();

export default WindowMG;
import { BaseStorage } from './base';
type Theme = 'light' | 'dark';
type ThemeStorage = BaseStorage<Theme> & {
    toggle: () => Promise<void>;
};
export declare const exampleThemeStorage: ThemeStorage;
export {};

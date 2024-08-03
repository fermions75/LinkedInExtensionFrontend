import type { PluginOption } from 'vite';
type PluginConfig = {
    onStart?: () => void;
    reload?: boolean;
    refresh?: boolean;
};
export declare function watchRebuildPlugin(config: PluginConfig): PluginOption;
export {};

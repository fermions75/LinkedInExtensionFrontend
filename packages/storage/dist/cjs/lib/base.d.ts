/**
 * Storage area type for persisting and exchanging data.
 * @see https://developer.chrome.com/docs/extensions/reference/storage/#overview
 */
export declare enum StorageType {
    /**
     * Persist data locally against browser restarts. Will be deleted by uninstalling the extension.
     * @default
     */
    Local = "local",
    /**
     * Uploads data to the users account in the cloud and syncs to the users browsers on other devices. Limits apply.
     */
    Sync = "sync",
    /**
     * Requires an [enterprise policy](https://www.chromium.org/administrators/configuring-policy-for-extensions) with a
     * json schema for company wide config.
     */
    Managed = "managed",
    /**
     * Only persist data until the browser is closed. Recommended for service workers which can shutdown anytime and
     * therefore need to restore their state. Set {@link SessionAccessLevel} for permitting content scripts access.
     * @implements Chromes [Session Storage](https://developer.chrome.com/docs/extensions/reference/storage/#property-session)
     */
    Session = "session"
}
/**
 * Global access level requirement for the {@link StorageType.Session} Storage Area.
 * @implements Chromes [Session Access Level](https://developer.chrome.com/docs/extensions/reference/storage/#method-StorageArea-setAccessLevel)
 */
export declare enum SessionAccessLevel {
    /**
     * Storage can only be accessed by Extension pages (not Content scripts).
     * @default
     */
    ExtensionPagesOnly = "TRUSTED_CONTEXTS",
    /**
     * Storage can be accessed by both Extension pages and Content scripts.
     */
    ExtensionPagesAndContentScripts = "TRUSTED_AND_UNTRUSTED_CONTEXTS"
}
type ValueOrUpdate<D> = D | ((prev: D) => Promise<D> | D);
export type BaseStorage<D> = {
    get: () => Promise<D>;
    set: (value: ValueOrUpdate<D>) => Promise<void>;
    getSnapshot: () => D | null;
    subscribe: (listener: () => void) => () => void;
};
type StorageConfig<D = string> = {
    /**
     * Assign the {@link StorageType} to use.
     * @default Local
     */
    storageType?: StorageType;
    /**
     * Only for {@link StorageType.Session}: Grant Content scripts access to storage area?
     * @default false
     */
    sessionAccessForContentScripts?: boolean;
    /**
     * Keeps state live in sync between all instances of the extension. Like between popup, side panel and content scripts.
     * To allow chrome background scripts to stay in sync as well, use {@link StorageType.Session} storage area with
     * {@link StorageConfig.sessionAccessForContentScripts} potentially also set to true.
     * @see https://stackoverflow.com/a/75637138/2763239
     * @default false
     */
    liveUpdate?: boolean;
    /**
     * An optional props for converting values from storage and into it.
     * @default undefined
     */
    serialization?: {
        /**
         * convert non-native values to string to be saved in storage
         */
        serialize: (value: D) => string;
        /**
         * convert string value from storage to non-native values
         */
        deserialize: (text: string) => D;
    };
};
/**
 * Creates a storage area for persisting and exchanging data.
 */
export declare function createStorage<D = string>(key: string, fallback: D, config?: StorageConfig<D>): BaseStorage<D>;
export {};

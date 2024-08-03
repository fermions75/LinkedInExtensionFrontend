import { BaseStorage } from '@chrome-extension-boilerplate/storage';
export declare function useStorageSuspense<Storage extends BaseStorage<Data>, Data = Storage extends BaseStorage<infer Data> ? Data : unknown>(storage: Storage): Data;
export declare function useStorage<Storage extends BaseStorage<Data>, Data = Storage extends BaseStorage<infer Data> ? Data : unknown>(storage: Storage): Data;

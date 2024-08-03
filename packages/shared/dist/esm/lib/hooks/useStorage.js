import { useSyncExternalStore } from 'react';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
var storageMap = new Map();
export function useStorageSuspense(storage) {
    var _data = useSyncExternalStore(storage.subscribe, storage.getSnapshot);
    if (!storageMap.has(storage)) {
        storageMap.set(storage, wrapPromise(storage.get()));
    }
    if (_data !== null) {
        storageMap.set(storage, { read: function () { return _data; } });
    }
    return _data !== null && _data !== void 0 ? _data : storageMap.get(storage).read();
}
function wrapPromise(promise) {
    var status = 'pending';
    var result;
    var suspender = promise.then(function (r) {
        status = 'success';
        result = r;
    }, function (e) {
        status = 'error';
        result = e;
    });
    return {
        read: function () {
            switch (status) {
                case 'pending':
                    throw suspender;
                case 'error':
                    throw result;
                default:
                    return result;
            }
        },
    };
}
export function useStorage(storage) {
    var _data = useSyncExternalStore(storage.subscribe, storage.getSnapshot);
    // eslint-disable-next-line
    // @ts-ignore
    if (!storageMap.has(storage)) {
        // eslint-disable-next-line
        // @ts-ignore
        storageMap.set(storage, wrapPromise(storage.get()));
    }
    if (_data !== null) {
        // eslint-disable-next-line
        // @ts-ignore
        storageMap.set(storage, { read: function () { return _data; } });
    }
    // eslint-disable-next-line
    // @ts-ignore
    return _data !== null && _data !== void 0 ? _data : storageMap.get(storage).read();
}

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionAccessLevel = exports.StorageType = void 0;
exports.createStorage = createStorage;
/**
 * Storage area type for persisting and exchanging data.
 * @see https://developer.chrome.com/docs/extensions/reference/storage/#overview
 */
var StorageType;
(function (StorageType) {
    /**
     * Persist data locally against browser restarts. Will be deleted by uninstalling the extension.
     * @default
     */
    StorageType["Local"] = "local";
    /**
     * Uploads data to the users account in the cloud and syncs to the users browsers on other devices. Limits apply.
     */
    StorageType["Sync"] = "sync";
    /**
     * Requires an [enterprise policy](https://www.chromium.org/administrators/configuring-policy-for-extensions) with a
     * json schema for company wide config.
     */
    StorageType["Managed"] = "managed";
    /**
     * Only persist data until the browser is closed. Recommended for service workers which can shutdown anytime and
     * therefore need to restore their state. Set {@link SessionAccessLevel} for permitting content scripts access.
     * @implements Chromes [Session Storage](https://developer.chrome.com/docs/extensions/reference/storage/#property-session)
     */
    StorageType["Session"] = "session";
})(StorageType || (exports.StorageType = StorageType = {}));
/**
 * Global access level requirement for the {@link StorageType.Session} Storage Area.
 * @implements Chromes [Session Access Level](https://developer.chrome.com/docs/extensions/reference/storage/#method-StorageArea-setAccessLevel)
 */
var SessionAccessLevel;
(function (SessionAccessLevel) {
    /**
     * Storage can only be accessed by Extension pages (not Content scripts).
     * @default
     */
    SessionAccessLevel["ExtensionPagesOnly"] = "TRUSTED_CONTEXTS";
    /**
     * Storage can be accessed by both Extension pages and Content scripts.
     */
    SessionAccessLevel["ExtensionPagesAndContentScripts"] = "TRUSTED_AND_UNTRUSTED_CONTEXTS";
})(SessionAccessLevel || (exports.SessionAccessLevel = SessionAccessLevel = {}));
/**
 * Sets or updates an arbitrary cache with a new value or the result of an update function.
 */
function updateCache(valueOrUpdate, cache) {
    return __awaiter(this, void 0, void 0, function () {
        // Type guard to check if our value or update is a function
        function isFunction(value) {
            return typeof value === 'function';
        }
        // Type guard to check in case of a function, if its a Promise
        function returnsPromise(func) {
            // Use ReturnType to infer the return type of the function and check if it's a Promise
            return func instanceof Promise;
        }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isFunction(valueOrUpdate)) return [3 /*break*/, 4];
                    if (!returnsPromise(valueOrUpdate)) return [3 /*break*/, 2];
                    return [4 /*yield*/, valueOrUpdate(cache)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2: return [2 /*return*/, valueOrUpdate(cache)];
                case 3: return [3 /*break*/, 5];
                case 4: return [2 /*return*/, valueOrUpdate];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * If one session storage needs access from content scripts, we need to enable it globally.
 * @default false
 */
var globalSessionAccessLevelFlag = false;
/**
 * Checks if the storage permission is granted in the manifest.json.
 */
function checkStoragePermission(storageType) {
    if (chrome.storage[storageType] === undefined) {
        throw new Error("Check your storage permission in manifest.json: ".concat(storageType, " is not defined"));
    }
}
/**
 * Creates a storage area for persisting and exchanging data.
 */
function createStorage(key, fallback, config) {
    var _this = this;
    var _a, _b, _c, _d, _e, _f;
    var cache = null;
    var listeners = [];
    var storageType = (_a = config === null || config === void 0 ? void 0 : config.storageType) !== null && _a !== void 0 ? _a : StorageType.Local;
    var liveUpdate = (_b = config === null || config === void 0 ? void 0 : config.liveUpdate) !== null && _b !== void 0 ? _b : false;
    var serialize = (_d = (_c = config === null || config === void 0 ? void 0 : config.serialization) === null || _c === void 0 ? void 0 : _c.serialize) !== null && _d !== void 0 ? _d : (function (v) { return v; });
    var deserialize = (_f = (_e = config === null || config === void 0 ? void 0 : config.serialization) === null || _e === void 0 ? void 0 : _e.deserialize) !== null && _f !== void 0 ? _f : (function (v) { return v; });
    // Set global session storage access level for StoryType.Session, only when not already done but needed.
    if (globalSessionAccessLevelFlag === false &&
        storageType === StorageType.Session &&
        (config === null || config === void 0 ? void 0 : config.sessionAccessForContentScripts) === true) {
        checkStoragePermission(storageType);
        chrome.storage[storageType]
            .setAccessLevel({
            accessLevel: SessionAccessLevel.ExtensionPagesAndContentScripts,
        })
            .catch(function (error) {
            console.warn(error);
            console.warn('Please call setAccessLevel into different context, like a background script.');
        });
        globalSessionAccessLevelFlag = true;
    }
    // Register life cycle methods
    var _getDataFromStorage = function () { return __awaiter(_this, void 0, void 0, function () {
        var value;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    checkStoragePermission(storageType);
                    return [4 /*yield*/, chrome.storage[storageType].get([key])];
                case 1:
                    value = _b.sent();
                    return [2 /*return*/, (_a = deserialize(value[key])) !== null && _a !== void 0 ? _a : fallback];
            }
        });
    }); };
    var _emitChange = function () {
        listeners.forEach(function (listener) { return listener(); });
    };
    var set = function (valueOrUpdate) { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, updateCache(valueOrUpdate, cache)];
                case 1:
                    cache = _b.sent();
                    return [4 /*yield*/, chrome.storage[storageType].set((_a = {}, _a[key] = serialize(cache), _a))];
                case 2:
                    _b.sent();
                    _emitChange();
                    return [2 /*return*/];
            }
        });
    }); };
    var subscribe = function (listener) {
        listeners = __spreadArray(__spreadArray([], __read(listeners), false), [listener], false);
        return function () {
            listeners = listeners.filter(function (l) { return l !== listener; });
        };
    };
    var getSnapshot = function () {
        return cache;
    };
    _getDataFromStorage().then(function (data) {
        cache = data;
        _emitChange();
    });
    // Listener for live updates from the browser
    function _updateFromStorageOnChanged(changes) {
        return __awaiter(this, void 0, void 0, function () {
            var valueOrUpdate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Check if the key we are listening for is in the changes object
                        if (changes[key] === undefined)
                            return [2 /*return*/];
                        valueOrUpdate = deserialize(changes[key].newValue);
                        if (cache === valueOrUpdate)
                            return [2 /*return*/];
                        return [4 /*yield*/, updateCache(valueOrUpdate, cache)];
                    case 1:
                        cache = _a.sent();
                        _emitChange();
                        return [2 /*return*/];
                }
            });
        });
    }
    // Register listener for live updates for our storage area
    if (liveUpdate) {
        chrome.storage[storageType].onChanged.addListener(_updateFromStorageOnChanged);
    }
    return {
        get: _getDataFromStorage,
        set: set,
        getSnapshot: getSnapshot,
        subscribe: subscribe,
    };
}

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchRebuildPlugin = watchRebuildPlugin;
const ws_1 = require("ws");
const interpreter_1 = __importDefault(require("../interpreter"));
const constant_1 = require("../constant");
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const injectionsPath = path_1.default.resolve(__dirname, '..', '..', '..', 'build', 'injections');
const refreshCode = fs.readFileSync(path_1.default.resolve(injectionsPath, 'refresh.js'), 'utf-8');
const reloadCode = fs.readFileSync(path_1.default.resolve(injectionsPath, 'reload.js'), 'utf-8');
function watchRebuildPlugin(config) {
    let ws = null;
    const id = Math.random().toString(36);
    const { refresh, reload } = config;
    const hmrCode = (refresh ? refreshCode : '') + (reload ? reloadCode : '');
    function initializeWebSocket() {
        if (!ws) {
            ws = new ws_1.WebSocket(constant_1.LOCAL_RELOAD_SOCKET_URL);
            ws.onopen = () => {
                console.log(`[HMR] Connected to dev-server at ${constant_1.LOCAL_RELOAD_SOCKET_URL}`);
            };
            ws.onerror = () => {
                console.error(`[HMR] Failed to start server at ${constant_1.LOCAL_RELOAD_SOCKET_URL}`);
                console.warn('Retrying in 5 seconds...');
                ws = null;
                setTimeout(() => initializeWebSocket(), 5000);
            };
        }
    }
    return {
        name: 'watch-rebuild',
        writeBundle() {
            var _a;
            (_a = config.onStart) === null || _a === void 0 ? void 0 : _a.call(config);
            if (!ws) {
                initializeWebSocket();
                return;
            }
            /**
             * When the build is complete, send a message to the reload server.
             * The reload server will send a message to the client to reload or refresh the extension.
             */
            if (!ws) {
                throw new Error('WebSocket is not initialized');
            }
            ws.send(interpreter_1.default.send({ type: 'build_complete', id }));
        },
        generateBundle(_options, bundle) {
            for (const module of Object.values(bundle)) {
                if (module.type === 'chunk') {
                    module.code = `(function() {let __HMR_ID = "${id}";\n` + hmrCode + '\n' + '})();' + '\n' + module.code;
                }
            }
        },
    };
}

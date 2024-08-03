#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const constant_1 = require("./constant");
const interpreter_1 = __importDefault(require("./interpreter"));
const clientsThatNeedToUpdate = new Set();
function initReloadServer() {
    try {
        const wss = new ws_1.WebSocketServer({ port: constant_1.LOCAL_RELOAD_SOCKET_PORT });
        wss.on('listening', () => console.log(`[HMR] Server listening at ${constant_1.LOCAL_RELOAD_SOCKET_URL}`));
        wss.on('connection', ws => {
            clientsThatNeedToUpdate.add(ws);
            ws.addEventListener('close', () => clientsThatNeedToUpdate.delete(ws));
            ws.addEventListener('message', event => {
                if (typeof event.data !== 'string')
                    return;
                const message = interpreter_1.default.receive(event.data);
                if (message.type === 'done_update') {
                    ws.close();
                }
                if (message.type === 'build_complete') {
                    clientsThatNeedToUpdate.forEach((ws) => ws.send(interpreter_1.default.send({ type: 'do_update', id: message.id })));
                }
            });
        });
        ping();
    }
    catch (_a) {
        console.error(`[HMR] Failed to start server at ${constant_1.LOCAL_RELOAD_SOCKET_URL}`);
    }
}
initReloadServer();
function ping() {
    clientsThatNeedToUpdate.forEach(ws => ws.send(interpreter_1.default.send({ type: 'ping' })));
    setTimeout(() => {
        ping();
    }, 15000);
}

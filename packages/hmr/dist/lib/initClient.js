"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = initReloadClient;
const constant_1 = require("./constant");
const interpreter_1 = __importDefault(require("./interpreter"));
function initReloadClient({ id, onUpdate }) {
    let ws = null;
    try {
        ws = new WebSocket(constant_1.LOCAL_RELOAD_SOCKET_URL);
        ws.onopen = () => {
            ws === null || ws === void 0 ? void 0 : ws.addEventListener('message', event => {
                const message = interpreter_1.default.receive(String(event.data));
                if (message.type === 'ping') {
                    console.log('[HMR] Client OK');
                }
                if (message.type === 'do_update' && message.id === id) {
                    sendUpdateCompleteMessage();
                    onUpdate();
                    return;
                }
            });
        };
        ws.onclose = () => {
            console.log(`Reload server disconnected.\nPlease check if the WebSocket server is running properly on ${constant_1.LOCAL_RELOAD_SOCKET_URL}. This feature detects changes in the code and helps the browser to reload the extension or refresh the current tab.`);
            setTimeout(() => {
                initReloadClient({ onUpdate, id });
            }, 1000);
        };
    }
    catch (e) {
        setTimeout(() => {
            initReloadClient({ onUpdate, id });
        }, 1000);
    }
    function sendUpdateCompleteMessage() {
        ws === null || ws === void 0 ? void 0 : ws.send(interpreter_1.default.send({ type: 'done_update' }));
    }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MessageInterpreter {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() { }
    static send(message) {
        return JSON.stringify(message);
    }
    static receive(serializedMessage) {
        return JSON.parse(serializedMessage);
    }
}
exports.default = MessageInterpreter;

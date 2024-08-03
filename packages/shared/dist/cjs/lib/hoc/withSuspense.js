"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withSuspense = withSuspense;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
function withSuspense(Component, SuspenseComponent) {
    return function WithSuspense(props) {
        return ((0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: SuspenseComponent, children: (0, jsx_runtime_1.jsx)(Component, __assign({}, props)) }));
    };
}

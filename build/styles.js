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
var react_native_1 = require("react-native");
var absoluteStretch = {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
};
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    menu: __assign({}, absoluteStretch),
    frontView: {
        flex: 1,
        position: "absolute",
        left: 0,
        top: 0,
        backgroundColor: "transparent",
        overflow: "hidden",
    },
    overlay: __assign({}, absoluteStretch),
});
exports.default = styles;
//# sourceMappingURL=styles.js.map
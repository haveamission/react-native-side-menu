"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const absoluteStretch = {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
};
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    menu: {
        ...absoluteStretch,
    },
    frontView: {
        flex: 1,
        position: "absolute",
        left: 0,
        top: 0,
        backgroundColor: "transparent",
        overflow: "hidden",
    },
    overlay: {
        ...absoluteStretch,
    },
});
exports.default = styles;
//# sourceMappingURL=styles.js.map
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var react_native_side_menu_1 = __importDefault(require("react-native-side-menu"));
var Menu_1 = __importDefault(require("./Menu"));
var image = require('./assets/menu.png');
var styles = react_native_1.StyleSheet.create({
    button: {
        position: 'absolute',
        top: 20,
        padding: 10,
    },
    caption: {
        fontSize: 20,
        fontWeight: 'bold',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
var Basic = /** @class */ (function (_super) {
    __extends(Basic, _super);
    function Basic(props) {
        var _this = _super.call(this, props) || this;
        _this.onMenuItemSelected = function (item) {
            return _this.setState({
                isOpen: false,
                selectedItem: item,
            });
        };
        _this.toggle = _this.toggle.bind(_this);
        _this.state = {
            isOpen: false,
            selectedItem: 'About',
        };
        return _this;
    }
    Basic.prototype.toggle = function () {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    };
    Basic.prototype.updateMenuState = function (isOpen) {
        this.setState({ isOpen: isOpen });
    };
    Basic.prototype.render = function () {
        var _this = this;
        var menu = react_1.default.createElement(Menu_1.default, { onItemSelected: this.onMenuItemSelected });
        return (react_1.default.createElement(react_native_1.SafeAreaView, null,
            react_1.default.createElement(react_native_side_menu_1.default, { menu: menu, isOpen: this.state.isOpen, onChange: function (isOpen) { return _this.updateMenuState(isOpen); } },
                react_1.default.createElement(react_native_1.View, { style: styles.container },
                    react_1.default.createElement(react_native_1.Text, { style: styles.welcome }, "Welcome to React Native!"),
                    react_1.default.createElement(react_native_1.Text, { style: styles.instructions }, "To get started, edit index.ios.js"),
                    react_1.default.createElement(react_native_1.Text, { style: styles.instructions },
                        "Press Cmd+R to reload,",
                        '\n',
                        "Cmd+Control+Z for dev menu"),
                    react_1.default.createElement(react_native_1.Text, { style: styles.instructions },
                        "Current selected menu item is: ",
                        this.state.selectedItem)),
                react_1.default.createElement(react_native_1.TouchableOpacity, { onPress: this.toggle, style: styles.button },
                    react_1.default.createElement(react_native_1.Image, { source: image, style: { width: 32, height: 32 } })))));
    };
    return Basic;
}(react_1.Component));
exports.default = Basic;
//# sourceMappingURL=Basic.js.map
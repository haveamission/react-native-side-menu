"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var prop_types_1 = __importDefault(require("prop-types"));
var react_native_1 = require("react-native");
var window = react_native_1.Dimensions.get('window');
var uri = 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png';
var styles = react_native_1.StyleSheet.create({
    menu: {
        flex: 1,
        width: window.width,
        height: window.height,
        backgroundColor: 'gray',
        padding: 20,
    },
    avatarContainer: {
        marginBottom: 20,
        marginTop: 20,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        flex: 1,
    },
    name: {
        position: 'absolute',
        left: 70,
        top: 20,
    },
    item: {
        fontSize: 14,
        fontWeight: '300',
        paddingTop: 5,
    },
});
function Menu(_a) {
    var onItemSelected = _a.onItemSelected;
    return (react_1.default.createElement(react_native_1.ScrollView, { scrollsToTop: false, style: styles.menu },
        react_1.default.createElement(react_native_1.View, { style: styles.avatarContainer },
            react_1.default.createElement(react_native_1.Image, { style: styles.avatar, source: { uri: uri } }),
            react_1.default.createElement(react_native_1.Text, { style: styles.name }, "Your name")),
        react_1.default.createElement(react_native_1.Text, { onPress: function () { return onItemSelected('About'); }, style: styles.item }, "About"),
        react_1.default.createElement(react_native_1.Text, { onPress: function () { return onItemSelected('Contacts'); }, style: styles.item }, "Contacts")));
}
exports.default = Menu;
Menu.propTypes = {
    onItemSelected: prop_types_1.default.func.isRequired,
};
//# sourceMappingURL=Menu.js.map
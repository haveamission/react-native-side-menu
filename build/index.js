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
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const styles_1 = __importDefault(require("./styles"));
const SideMenu = ({ edgeHitWidth = 60, toleranceX = 10, toleranceY = 10, menuPosition = "left", onChange = () => { }, onMove = () => { }, openMenuOffset = react_native_1.Dimensions.get("window").width * (2 / 3), hiddenMenuOffset = 0, disableGestures = false, animationFunction = (prop, value) => react_native_1.Animated.spring(prop, {
    toValue: value,
    friction: 8,
    useNativeDriver: true,
}), onAnimationComplete = () => { }, onStartShouldSetResponderCapture = () => true, isOpen = false, bounceBackOnOverdraw = true, autoClosing = true, allowOverlayPressPropagation = false, overlayOpacity = 1, animateOverlayOpacity = true, children, menu, overlayColor, onSliding = () => { }, animationStyle = (value) => ({
    transform: [{ translateX: value }],
}), }) => {
    const deviceScreen = react_native_1.Dimensions.get("window");
    const barrierForward = deviceScreen.width / 4;
    const [width, setWidth] = (0, react_1.useState)(deviceScreen.width);
    const [height, setHeight] = (0, react_1.useState)(deviceScreen.height);
    const [openOffsetMenuPercentage] = (0, react_1.useState)(openMenuOffset / deviceScreen.width);
    const [hiddenMenuOffsetPercentage] = (0, react_1.useState)(hiddenMenuOffset / deviceScreen.width);
    const [left] = (0, react_1.useState)(new react_native_1.Animated.Value(isOpen ? openMenuOffset : hiddenMenuOffset));
    const [prevLeft, setPrevLeft] = (0, react_1.useState)(0);
    const [menuIsOpen, setMenuIsOpen] = (0, react_1.useState)(isOpen);
    const openMenu = (isOpen) => {
        moveLeft(isOpen ? openMenuOffset : hiddenMenuOffset);
        setMenuIsOpen(isOpen);
        onChange(isOpen);
    };
    const handlePanResponderMove = (e, gestureState) => {
        // TODO figure out a more idiomatic way of doing this (maybe a ref?)
        //@ts-ignore
        if (left.__getValue() * menuPositionMultiplier() >= 0) {
            let newLeft = prevLeft + gestureState.dx;
            if (!bounceBackOnOverdraw && Math.abs(newLeft) > openMenuOffset) {
                newLeft = menuPositionMultiplier() * openMenuOffset;
            }
            onMove(newLeft);
            left.setValue(newLeft);
        }
    };
    const handlePanResponderEnd = (e, gestureState) => {
        // TODO figure out a more idiomatic way of doing this (maybe a ref?)
        const offsetLeft = 
        //@ts-ignore
        menuPositionMultiplier() * (left.__getValue() + gestureState.dx);
        openMenu(shouldOpenMenu(offsetLeft));
    };
    const handleMoveShouldSetPanResponder = (e, gestureState) => {
        if (gesturesAreEnabled()) {
            const x = Math.round(Math.abs(gestureState.dx));
            const y = Math.round(Math.abs(gestureState.dy));
            const touchMoved = x > toleranceX && y < toleranceY;
            if (menuIsOpen) {
                return touchMoved;
            }
            const withinEdgeHitWidth = menuPosition === "right"
                ? gestureState.moveX > deviceScreen.width - edgeHitWidth
                : gestureState.moveX < edgeHitWidth;
            const swipingToOpen = menuPositionMultiplier() * gestureState.dx > 0;
            return withinEdgeHitWidth && touchMoved && swipingToOpen;
        }
        return false;
    };
    const responder = (0, react_1.useRef)(react_native_1.PanResponder.create({
        onStartShouldSetPanResponderCapture: onStartShouldSetResponderCapture,
        onMoveShouldSetPanResponder: handleMoveShouldSetPanResponder,
        onPanResponderMove: handlePanResponderMove,
        onPanResponderRelease: handlePanResponderEnd,
        onPanResponderTerminate: handlePanResponderEnd,
    })).current;
    (0, react_1.useEffect)(() => {
        const listener = left.addListener(({ value }) => onSliding(Math.abs((value - hiddenMenuOffset) / (openMenuOffset - hiddenMenuOffset))));
        return () => {
            left.removeListener(listener);
        };
    }, [hiddenMenuOffset, left, onSliding, openMenuOffset]);
    (0, react_1.useEffect)(() => {
        if (typeof isOpen !== "undefined" &&
            menuIsOpen !== isOpen &&
            (autoClosing || !menuIsOpen)) {
            openMenu(isOpen);
        }
    }, [autoClosing, isOpen, menuIsOpen, openMenu]);
    const getOverlayColor = () => {
        if (allowOverlayPressPropagation)
            return overlayColor || "transparent";
        // stopPropagation doesn't work with transparent background
        if (!overlayColor || overlayColor == "transparent") {
            return "#00000001";
        }
        return overlayColor;
    };
    const onLayoutChange = (e) => {
        const { width, height } = e.nativeEvent.layout;
        const openMenuOffset = width * openOffsetMenuPercentage;
        const hiddenMenuOffset = width * hiddenMenuOffsetPercentage;
        setWidth(width);
        setHeight(height);
        left.setValue(menuIsOpen ? openMenuOffset : hiddenMenuOffset);
    };
    const shouldOpenMenu = (dx) => {
        return dx > barrierForward;
    };
    const moveLeft = (offset) => {
        const newOffset = menuPositionMultiplier() * offset;
        animationFunction(left, newOffset).start(onAnimationComplete);
        setPrevLeft(newOffset);
    };
    const menuPositionMultiplier = () => {
        return menuPosition === "right" ? -1 : 1;
    };
    const gesturesAreEnabled = () => {
        if (typeof disableGestures === "function") {
            return !disableGestures();
        }
        return !disableGestures;
    };
    const getContentView = () => {
        const overlayContainer = (<react_native_1.TouchableWithoutFeedback onPress={(e) => {
                if (!allowOverlayPressPropagation) {
                    e.stopPropagation();
                }
                openMenu(false);
            }}>
        <react_native_1.Animated.View pointerEvents={menuIsOpen ? "auto" : "none"} style={[
                styles_1.default.overlay,
                {
                    backgroundColor: getOverlayColor(),
                    opacity: animateOverlayOpacity
                        ? left.interpolate({
                            inputRange: [hiddenMenuOffset, openMenuOffset],
                            outputRange: [0, overlayOpacity],
                        })
                        : overlayOpacity,
                },
            ]}/>
      </react_native_1.TouchableWithoutFeedback>);
        const ref = (0, react_1.useRef)(null);
        const style = [styles_1.default.frontView, { width, height }, animationStyle(left)];
        return (
        // TODO some issue with style - look into
        //@ts-ignore
        <react_native_1.Animated.View style={style} ref={ref} {...responder.panHandlers}>
        {children}
        {overlayContainer}
      </react_native_1.Animated.View>);
    };
    const boundryStyle = menuPosition === "right"
        ? { left: width - openMenuOffset }
        : { right: width - openMenuOffset };
    const menuElement = <react_native_1.View style={[styles_1.default.menu, boundryStyle]}>{menu}</react_native_1.View>;
    return (<react_native_1.View style={styles_1.default.container} onLayout={onLayoutChange}>
      {menuElement}
      {getContentView()}
    </react_native_1.View>);
};
exports.default = SideMenu;
//# sourceMappingURL=index.js.map
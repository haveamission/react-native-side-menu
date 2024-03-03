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
import React, { useState, useRef, useEffect } from "react";
import { PanResponder, View, Dimensions, Animated, TouchableWithoutFeedback, } from "react-native";
import styles from "./styles";
var SideMenu = function (_a) {
    var _b = _a.edgeHitWidth, edgeHitWidth = _b === void 0 ? 60 : _b, _c = _a.toleranceX, toleranceX = _c === void 0 ? 10 : _c, _d = _a.toleranceY, toleranceY = _d === void 0 ? 10 : _d, _e = _a.menuPosition, menuPosition = _e === void 0 ? "left" : _e, _f = _a.onChange, onChange = _f === void 0 ? function () { } : _f, _g = _a.onMove, onMove = _g === void 0 ? function () { } : _g, _h = _a.openMenuOffset, openMenuOffset = _h === void 0 ? Dimensions.get("window").width * (2 / 3) : _h, _j = _a.hiddenMenuOffset, hiddenMenuOffset = _j === void 0 ? 0 : _j, _k = _a.disableGestures, disableGestures = _k === void 0 ? false : _k, _l = _a.animationFunction, animationFunction = _l === void 0 ? function (prop, value) {
        return Animated.spring(prop, {
            toValue: value,
            friction: 8,
            useNativeDriver: true,
        });
    } : _l, _m = _a.onAnimationComplete, onAnimationComplete = _m === void 0 ? function () { } : _m, _o = _a.onStartShouldSetResponderCapture, onStartShouldSetResponderCapture = _o === void 0 ? function () { return true; } : _o, _p = _a.isOpen, isOpen = _p === void 0 ? false : _p, _q = _a.bounceBackOnOverdraw, bounceBackOnOverdraw = _q === void 0 ? true : _q, _r = _a.autoClosing, autoClosing = _r === void 0 ? true : _r, _s = _a.allowOverlayPressPropagation, allowOverlayPressPropagation = _s === void 0 ? false : _s, _t = _a.overlayOpacity, overlayOpacity = _t === void 0 ? 1 : _t, _u = _a.animateOverlayOpacity, animateOverlayOpacity = _u === void 0 ? true : _u, children = _a.children, menu = _a.menu, overlayColor = _a.overlayColor, _v = _a.onSliding, onSliding = _v === void 0 ? function () { } : _v, _w = _a.animationStyle, animationStyle = _w === void 0 ? function (value) { return ({
        transform: [{ translateX: value }],
    }); } : _w;
    var deviceScreen = Dimensions.get("window");
    var barrierForward = deviceScreen.width / 4;
    var _x = useState(deviceScreen.width), width = _x[0], setWidth = _x[1];
    var _y = useState(deviceScreen.height), height = _y[0], setHeight = _y[1];
    var openOffsetMenuPercentage = useState(openMenuOffset / deviceScreen.width)[0];
    var hiddenMenuOffsetPercentage = useState(hiddenMenuOffset / deviceScreen.width)[0];
    var left = useState(new Animated.Value(isOpen ? openMenuOffset : hiddenMenuOffset))[0];
    var _z = useState(0), prevLeft = _z[0], setPrevLeft = _z[1];
    var _0 = useState(isOpen), menuIsOpen = _0[0], setMenuIsOpen = _0[1];
    var openMenu = function (isOpen) {
        moveLeft(isOpen ? openMenuOffset : hiddenMenuOffset);
        setMenuIsOpen(isOpen);
        onChange(isOpen);
    };
    var handlePanResponderMove = function (e, gestureState) {
        // TODO figure out a more idiomatic way of doing this (maybe a ref?)
        //@ts-ignore
        if (left.__getValue() * menuPositionMultiplier() >= 0) {
            var newLeft = prevLeft + gestureState.dx;
            if (!bounceBackOnOverdraw && Math.abs(newLeft) > openMenuOffset) {
                newLeft = menuPositionMultiplier() * openMenuOffset;
            }
            onMove(newLeft);
            left.setValue(newLeft);
        }
    };
    var handlePanResponderEnd = function (e, gestureState) {
        // TODO figure out a more idiomatic way of doing this (maybe a ref?)
        var offsetLeft = 
        //@ts-ignore
        menuPositionMultiplier() * (left.__getValue() + gestureState.dx);
        openMenu(shouldOpenMenu(offsetLeft));
    };
    var handleMoveShouldSetPanResponder = function (e, gestureState) {
        if (gesturesAreEnabled()) {
            var x = Math.round(Math.abs(gestureState.dx));
            var y = Math.round(Math.abs(gestureState.dy));
            var touchMoved = x > toleranceX && y < toleranceY;
            if (menuIsOpen) {
                return touchMoved;
            }
            var withinEdgeHitWidth = menuPosition === "right"
                ? gestureState.moveX > deviceScreen.width - edgeHitWidth
                : gestureState.moveX < edgeHitWidth;
            var swipingToOpen = menuPositionMultiplier() * gestureState.dx > 0;
            return withinEdgeHitWidth && touchMoved && swipingToOpen;
        }
        return false;
    };
    var responder = useRef(PanResponder.create({
        onStartShouldSetPanResponderCapture: onStartShouldSetResponderCapture,
        onMoveShouldSetPanResponder: handleMoveShouldSetPanResponder,
        onPanResponderMove: handlePanResponderMove,
        onPanResponderRelease: handlePanResponderEnd,
        onPanResponderTerminate: handlePanResponderEnd,
    })).current;
    useEffect(function () {
        var listener = left.addListener(function (_a) {
            var value = _a.value;
            return onSliding(Math.abs((value - hiddenMenuOffset) / (openMenuOffset - hiddenMenuOffset)));
        });
        return function () {
            left.removeListener(listener);
        };
    }, [hiddenMenuOffset, left, onSliding, openMenuOffset]);
    useEffect(function () {
        if (typeof isOpen !== "undefined" &&
            menuIsOpen !== isOpen &&
            (autoClosing || !menuIsOpen)) {
            openMenu(isOpen);
        }
    }, [autoClosing, isOpen, menuIsOpen, openMenu]);
    var getOverlayColor = function () {
        if (allowOverlayPressPropagation)
            return overlayColor || "transparent";
        // stopPropagation doesn't work with transparent background
        if (!overlayColor || overlayColor == "transparent") {
            return "#00000001";
        }
        return overlayColor;
    };
    var onLayoutChange = function (e) {
        var _a = e.nativeEvent.layout, width = _a.width, height = _a.height;
        var openMenuOffset = width * openOffsetMenuPercentage;
        var hiddenMenuOffset = width * hiddenMenuOffsetPercentage;
        setWidth(width);
        setHeight(height);
        left.setValue(menuIsOpen ? openMenuOffset : hiddenMenuOffset);
    };
    var shouldOpenMenu = function (dx) {
        return dx > barrierForward;
    };
    var moveLeft = function (offset) {
        var newOffset = menuPositionMultiplier() * offset;
        animationFunction(left, newOffset).start(onAnimationComplete);
        setPrevLeft(newOffset);
    };
    var menuPositionMultiplier = function () {
        return menuPosition === "right" ? -1 : 1;
    };
    var gesturesAreEnabled = function () {
        if (typeof disableGestures === "function") {
            return !disableGestures();
        }
        return !disableGestures;
    };
    var getContentView = function () {
        var overlayContainer = (React.createElement(TouchableWithoutFeedback, { onPress: function (e) {
                if (!allowOverlayPressPropagation) {
                    e.stopPropagation();
                }
                openMenu(false);
            } },
            React.createElement(Animated.View, { pointerEvents: menuIsOpen ? "auto" : "none", style: [
                    styles.overlay,
                    {
                        backgroundColor: getOverlayColor(),
                        opacity: animateOverlayOpacity
                            ? left.interpolate({
                                inputRange: [hiddenMenuOffset, openMenuOffset],
                                outputRange: [0, overlayOpacity],
                            })
                            : overlayOpacity,
                    },
                ] })));
        var ref = useRef(null);
        var style = [styles.frontView, { width: width, height: height }, animationStyle(left)];
        return (
        // TODO some issue with style - look into
        //@ts-ignore
        React.createElement(Animated.View, __assign({ style: style, ref: ref }, responder.panHandlers),
            children,
            overlayContainer));
    };
    var boundryStyle = menuPosition === "right"
        ? { left: width - openMenuOffset }
        : { right: width - openMenuOffset };
    var menuElement = React.createElement(View, { style: [styles.menu, boundryStyle] }, menu);
    return (React.createElement(View, { style: styles.container, onLayout: onLayoutChange },
        menuElement,
        getContentView()));
};
export default SideMenu;
//# sourceMappingURL=index.js.map
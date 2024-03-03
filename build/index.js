import React, { useState, useRef, useEffect } from "react";
import { PanResponder, View, Dimensions, Animated, TouchableWithoutFeedback, } from "react-native";
import styles from "./styles";
const SideMenu = ({ edgeHitWidth = 60, toleranceX = 10, toleranceY = 10, menuPosition = "left", onChange = () => { }, onMove = () => { }, openMenuOffset = Dimensions.get("window").width * (2 / 3), hiddenMenuOffset = 0, disableGestures = false, animationFunction = (prop, value) => Animated.spring(prop, {
    toValue: value,
    friction: 8,
    useNativeDriver: true,
}), onAnimationComplete = () => { }, onStartShouldSetResponderCapture = () => true, isOpen = false, bounceBackOnOverdraw = true, autoClosing = true, allowOverlayPressPropagation = false, overlayOpacity = 1, animateOverlayOpacity = true, children, menu, overlayColor, onSliding = () => { }, animationStyle = (value) => ({
    transform: [{ translateX: value }],
}), }) => {
    const deviceScreen = Dimensions.get("window");
    const barrierForward = deviceScreen.width / 4;
    const [width, setWidth] = useState(deviceScreen.width);
    const [height, setHeight] = useState(deviceScreen.height);
    const [openOffsetMenuPercentage] = useState(openMenuOffset / deviceScreen.width);
    const [hiddenMenuOffsetPercentage] = useState(hiddenMenuOffset / deviceScreen.width);
    const [left] = useState(new Animated.Value(isOpen ? openMenuOffset : hiddenMenuOffset));
    const [prevLeft, setPrevLeft] = useState(0);
    const [menuIsOpen, setMenuIsOpen] = useState(isOpen);
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
    const responder = useRef(PanResponder.create({
        onStartShouldSetPanResponderCapture: onStartShouldSetResponderCapture,
        onMoveShouldSetPanResponder: handleMoveShouldSetPanResponder,
        onPanResponderMove: handlePanResponderMove,
        onPanResponderRelease: handlePanResponderEnd,
        onPanResponderTerminate: handlePanResponderEnd,
    })).current;
    useEffect(() => {
        const listener = left.addListener(({ value }) => onSliding(Math.abs((value - hiddenMenuOffset) / (openMenuOffset - hiddenMenuOffset))));
        return () => {
            left.removeListener(listener);
        };
    }, [hiddenMenuOffset, left, onSliding, openMenuOffset]);
    useEffect(() => {
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
        const overlayContainer = (<TouchableWithoutFeedback onPress={(e) => {
                if (!allowOverlayPressPropagation) {
                    e.stopPropagation();
                }
                openMenu(false);
            }}>
        <Animated.View pointerEvents={menuIsOpen ? "auto" : "none"} style={[
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
            ]}/>
      </TouchableWithoutFeedback>);
        const ref = useRef(null);
        const style = [styles.frontView, { width, height }, animationStyle(left)];
        return (
        // TODO some issue with style - look into
        //@ts-ignore
        <Animated.View style={style} ref={ref} {...responder.panHandlers}>
        {children}
        {overlayContainer}
      </Animated.View>);
    };
    const boundryStyle = menuPosition === "right"
        ? { left: width - openMenuOffset }
        : { right: width - openMenuOffset };
    const menuElement = <View style={[styles.menu, boundryStyle]}>{menu}</View>;
    return (<View style={styles.container} onLayout={onLayoutChange}>
      {menuElement}
      {getContentView()}
    </View>);
};
export default SideMenu;
//# sourceMappingURL=index.js.map
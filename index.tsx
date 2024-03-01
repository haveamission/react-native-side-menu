import React, { useState, useRef, useEffect } from "react";
import {
  PanResponder,
  View,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import styles from "./styles";

type WindowDimensions = { width: number; height: number };

type Props = {
  edgeHitWidth?: number;
  toleranceX?: number;
  toleranceY?: number;
  menuPosition?: "left" | "right";
  onChange?: (isOpen: boolean) => void;
  onMove?: (offset: number) => void;
  onSliding?: (value: number) => void;
  openMenuOffset?: number;
  hiddenMenuOffset?: number;
  disableGestures?: boolean | (() => boolean);
  animationFunction?: (
    prop: Animated.Value,
    value: number
  ) => Animated.CompositeAnimation;
  onAnimationComplete?: () => void;
  onStartShouldSetResponderCapture?: () => boolean;
  isOpen?: boolean;
  bounceBackOnOverdraw?: boolean;
  autoClosing?: boolean;
  allowOverlayPressPropagation?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
  animateOverlayOpacity?: boolean;
  children?: React.ReactNode;
  menu?: React.ReactNode;
};

const SideMenu: React.FC<Props> = ({
  edgeHitWidth = 60,
  toleranceX = 10,
  toleranceY = 10,
  menuPosition = "left",
  onChange = () => {},
  onMove = () => {},
  openMenuOffset = Dimensions.get("window").width * (2 / 3),
  hiddenMenuOffset = 0,
  disableGestures = false,
  animationFunction = (prop, value) =>
    Animated.spring(prop, {
      toValue: value,
      friction: 8,
      useNativeDriver: true,
    }),
  onAnimationComplete = () => {},
  onStartShouldSetResponderCapture = () => true,
  isOpen = false,
  bounceBackOnOverdraw = true,
  autoClosing = true,
  allowOverlayPressPropagation = false,
  overlayOpacity = 1,
  animateOverlayOpacity = true,
  children,
  menu,
  overlayColor,
  onSliding = () => {},
}) => {
  const deviceScreen: WindowDimensions = Dimensions.get("window");
  const barrierForward: number = deviceScreen.width / 4;
  const [width, setWidth] = useState(deviceScreen.width);
  const [height, setHeight] = useState(deviceScreen.height);
  const [openOffsetMenuPercentage] = useState(
    openMenuOffset / deviceScreen.width
  );
  const [hiddenMenuOffsetPercentage] = useState(
    hiddenMenuOffset / deviceScreen.width
  );
  const [left] = useState(
    new Animated.Value(isOpen ? openMenuOffset : hiddenMenuOffset)
  );
  const [prevLeft, setPrevLeft] = useState(0);
  const [menuIsOpen, setMenuIsOpen] = useState(isOpen);

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetResponderCapture: onStartShouldSetResponderCapture,
      onMoveShouldSetPanResponder: handleMoveShouldSetPanResponder,
      onPanResponderMove: handlePanResponderMove,
      onPanResponderRelease: handlePanResponderEnd,
      onPanResponderTerminate: handlePanResponderEnd,
    })
  ).current;

  useEffect(() => {
    const listener = left.addListener(({ value }) =>
      onSliding(
        Math.abs(
          (value - hiddenMenuOffset) / (openMenuOffset - hiddenMenuOffset)
        )
      )
    );
    return () => {
      left.removeListener(listener);
    };
  }, [hiddenMenuOffset, left, onSliding, openMenuOffset]);

  useEffect(() => {
    if (
      typeof isOpen !== "undefined" &&
      menuIsOpen !== isOpen &&
      (autoClosing || !menuIsOpen)
    ) {
      openMenu(isOpen);
    }
  }, [autoClosing, isOpen, menuIsOpen, openMenu]);

  const getOverlayColor = () => {
    if (allowOverlayPressPropagation) return overlayColor || "transparent";
    // stopPropagation doesn't work with transparent background
    if (!overlayColor || overlayColor == "transparent") {
      return "#00000001";
    }
    return overlayColor;
  };

  const onLayoutChange = (e: {
    nativeEvent: { layout: { width: number; height: number } };
  }) => {
    const { width, height } = e.nativeEvent.layout;
    const openMenuOffset = width * openOffsetMenuPercentage;
    const hiddenMenuOffset = width * hiddenMenuOffsetPercentage;
    setWidth(width);
    setHeight(height);
    left.setValue(menuIsOpen ? openMenuOffset : hiddenMenuOffset);
  };

  const shouldOpenMenu = (dx: number): boolean => {
    return dx > barrierForward;
  };

  const moveLeft = (offset: number) => {
    const newOffset = menuPositionMultiplier() * offset;

    animationFunction(left, newOffset).start(onAnimationComplete);

    setPrevLeft(newOffset);
  };

  const menuPositionMultiplier = (): -1 | 1 => {
    return menuPosition === "right" ? -1 : 1;
  };

  const handlePanResponderMove = (e: any, gestureState: any) => {
    if (left.__getValue() * menuPositionMultiplier() >= 0) {
      let newLeft = prevLeft + gestureState.dx;

      if (!bounceBackOnOverdraw && Math.abs(newLeft) > openMenuOffset) {
        newLeft = menuPositionMultiplier() * openMenuOffset;
      }

      onMove(newLeft);
      left.setValue(newLeft);
    }
  };

  const handlePanResponderEnd = (e: any, gestureState: any) => {
    const offsetLeft =
      menuPositionMultiplier() * (left.__getValue() + gestureState.dx);

    openMenu(shouldOpenMenu(offsetLeft));
  };

  const handleMoveShouldSetPanResponder = (
    e: any,
    gestureState: any
  ): boolean => {
    if (gesturesAreEnabled()) {
      const x = Math.round(Math.abs(gestureState.dx));
      const y = Math.round(Math.abs(gestureState.dy));

      const touchMoved = x > toleranceX && y < toleranceY;

      if (menuIsOpen) {
        return touchMoved;
      }

      const withinEdgeHitWidth =
        menuPosition === "right"
          ? gestureState.moveX > deviceScreen.width - edgeHitWidth
          : gestureState.moveX < edgeHitWidth;

      const swipingToOpen = menuPositionMultiplier() * gestureState.dx > 0;
      return withinEdgeHitWidth && touchMoved && swipingToOpen;
    }

    return false;
  };

  const openMenu = (isOpen: boolean) => {
    const { hiddenMenuOffset, openMenuOffset } = state;
    moveLeft(isOpen ? openMenuOffset : hiddenMenuOffset);
    setMenuIsOpen(isOpen);
    onChange(isOpen);
  };

  const gesturesAreEnabled = (): boolean => {
    if (typeof disableGestures === "function") {
      return !disableGestures();
    }
    return !disableGestures;
  };

  const getContentView = () => {
    const overlayContainer = (
      <TouchableWithoutFeedback
        onPress={(e) => {
          if (!allowOverlayPressPropagation) {
            e.stopPropagation();
          }
          openMenu(false);
        }}
      >
        <Animated.View
          pointerEvents={menuIsOpen ? "auto" : "none"}
          style={[
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
          ]}
        />
      </TouchableWithoutFeedback>
    );

    const ref = useRef(null);
    const style = [styles.frontView, { width, height }, animationStyle(left)];

    return (
      <Animated.View style={style} ref={ref} {...responder.panHandlers}>
        {children}
        {overlayContainer}
      </Animated.View>
    );
  };

  const boundryStyle =
    menuPosition === "right"
      ? { left: width - openMenuOffset }
      : { right: width - openMenuOffset };

  const menuElement = <View style={[styles.menu, boundryStyle]}>{menu}</View>;

  return (
    <View style={styles.container} onLayout={onLayoutChange}>
      {menuElement}
      {getContentView()}
    </View>
  );
};

export default SideMenu;

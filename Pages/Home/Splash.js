import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Text, Animated, Easing, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path, Polygon, Line } from "react-native-svg";

const { width, height } = Dimensions.get("window");

export default function Splash({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const moveAnim = useRef(new Animated.Value(0)).current;
  const drawAnim = useRef(new Animated.Value(0)).current;
  const gradientX = useRef(new Animated.Value(0)).current;
  const gradientY = useRef(new Animated.Value(0)).current;
  const gradientRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade + scale animation for title & icon
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    // Icon draw animation
    Animated.timing(drawAnim, {
      toValue: 1,
      duration: 2500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();

    // Floating animation for the icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(moveAnim, {
          toValue: -8,
          duration: 1800,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(moveAnim, {
          toValue: 8,
          duration: 1800,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();

    // Infinite smooth diagonal gradient motion with slight rotation
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(gradientX, {
            toValue: -width * 1.5,
            duration: 12000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(gradientX, {
            toValue: 0,
            duration: 12000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(gradientY, {
            toValue: -height * 1.5,
            duration: 10000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(gradientY, {
            toValue: 0,
            duration: 10000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
        Animated.loop(
          Animated.sequence([
            Animated.timing(gradientRotate, {
              toValue: 1,
              duration: 15000,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(gradientRotate, {
              toValue: 0,
              duration: 15000,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ])
        ),
      ])
    ).start();

    // Navigate after 7 seconds
    const timer = setTimeout(() => {
      navigation.replace("Account");
    }, 7000);

    return () => clearTimeout(timer);
  }, [navigation]);

  const strokeOffset = drawAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0],
  });

  // Interpolate rotation for the gradient
  const rotateInterpolation = gradientRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["-3deg", "3deg"], // subtle rotation
  });

  return (
    <View style={styles.container}>
      {/* Liquid-like flowing diagonal gradient */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [
              { translateX: gradientX },
              { translateY: gradientY },
              { rotate: rotateInterpolation },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={[
            "#ffffff",
            "#ffffff",
            "#0a84ff",
            "#001f4d",
            "#0a84ff",
            "#ffffff",
            "#ffffff",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ width: width * 3, height: height * 3 }}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* 🎓 Graduate Hat Icon */}
        <Animated.View style={{ transform: [{ translateY: moveAnim }] }}>
          <Svg height="130" width="130" viewBox="0 0 120 120">
            <AnimatedPolygon
              points="60,15 110,50 60,85 10,50"
              fill="none"
              stroke="#ffffff"
              strokeWidth="4"
              strokeDasharray="500"
              strokeDashoffset={strokeOffset}
            />
            {/* Hat tassel */}
            <AnimatedLine
              x1="60"
              y1="15"
              x2="60"
              y2="0"
              stroke="#00bfff"
              strokeWidth="3"
              strokeDasharray="100"
              strokeDashoffset={strokeOffset}
            />
          </Svg>
        </Animated.View>

        <Text style={styles.title}>Attendify</Text>
        <Text style={styles.subtitle}>Smart Attendance System</Text>
      </Animated.View>
    </View>
  );
}

const AnimatedPolygon = Animated.createAnimatedComponent(Polygon);
const AnimatedLine = Animated.createAnimatedComponent(Line);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#001f4d", // fallback behind gradient
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 2,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
    marginTop: 20,
  },
  subtitle: {
    color: "#e0f2ff",
    fontSize: 16,
    marginTop: 8,
    letterSpacing: 1,
  },
});

import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
  Image,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  interpolateColor,
  Extrapolate,
  SharedValue,
} from "react-native-reanimated";
import LottieView from "lottie-react-native";
import { Colors } from "@/constants/colors";
import { useTranslation } from "@/lib/i18n";

const { width, height } = Dimensions.get("window");

// We fallback to generated static images if Lottie animations aren't provided yet
const getSlides = (t: (key: string) => string) => [
  {
    id: "1",
    title: t("ob1_title"),
    subtitle: t("ob1_sub"),
    image: null,
    lottie: require("@/assets/lottie/Capsule.json"),
    glowColor: "rgba(255, 255, 255, 0.05)",
  },
  {
    id: "2",
    title: t("ob2_title"),
    subtitle: t("ob2_sub"),
    image: require("@/assets/images/onboarding/ai_calls.png"),
    lottie: null,
    glowColor: "rgba(255, 255, 255, 0.03)",
  },
  {
    id: "3",
    title: t("ob3_title"),
    subtitle: t("ob3_sub"),
    image: null,
    lottie: require("@/assets/lottie/registro.json"),
    glowColor: "rgba(255, 255, 255, 0.04)",
  },
  {
    id: "4",
    title: t("ob4_title"),
    subtitle: t("ob4_sub"),
    image: null,
    lottie: require("@/assets/lottie/Document OCR Scan.json"),
    glowColor: "rgba(255, 255, 255, 0.06)",
  },
];

const IMAGE_SIZE = Math.min(width * 0.65, 280);

interface DotProps {
  index: number;
  scrollX: SharedValue<number>;
}

const Dot = ({ index, scrollX }: DotProps) => {
  const animatedDotStyle = useAnimatedStyle(() => {
    const widthDot = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [6, 24, 6],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [0.2, 1, 0.2],
      Extrapolate.CLAMP
    );

    return {
      width: widthDot,
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        animatedDotStyle,
        { backgroundColor: Colors.textWarm },
      ]}
    />
  );
};

const SlideItem = ({ item, index, scrollX }: { item: any; index: number; scrollX: SharedValue<number> }) => {
  // Parallax effect calculations
  const animatedImageStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [width * 0.4, 0, -width * 0.4]
    );
    const scale = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [0.8, 1, 0.8]
    );
    return { transform: [{ translateX }, { scale }] };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [width * 0.7, 0, -width * 0.7]
    );
    return { transform: [{ translateX }] };
  });

  return (
    <View style={[styles.slide, { width }]}>
      {/* Premium Parallax Illustration / Lottie */}
      <Animated.View style={[styles.imageContainer, animatedImageStyle]}>
        <View style={[styles.imageGlow, { backgroundColor: item.glowColor }]} />
        {item.lottie ? (
          <LottieView
            autoPlay
            loop
            source={item.lottie}
            style={styles.slideImage}
          />
        ) : (
          <Image
            source={item.image}
            style={styles.slideImage}
            resizeMode="contain"
          />
        )}
      </Animated.View>

      {/* Text Content with delayed parallax */}
      <Animated.View style={[styles.textContainer, animatedTextStyle]}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </Animated.View>
    </View>
  );
};

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const slides = getSlides(t);
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<Animated.FlatList<any>>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToOffset({
        offset: (currentIndex + 1) * width,
        animated: true
      });
    } else {
      router.replace("/auth/login");
    }
  };

  const handleSkip = () => {
    router.replace("/auth/login");
  };

  // Dynamic Glow Background based on Scroll Progress
  const animatedBackgroundGlowStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      scrollX.value,
      slides.map((_, i) => i * width),
      slides.map((s) => s.glowColor)
    );

    return { backgroundColor };
  });

  return (
    <View style={[styles.container, { paddingTop: topPad, paddingBottom: bottomPad }]}>
      <StatusBar barStyle="light-content" />

      {/* Ambient background glow shifting across slides */}
      <Animated.View style={[styles.ambientGlow, animatedBackgroundGlowStyle]} />
      <View style={styles.ambientGlowOverlay} />

      <View style={styles.header}>
        <View style={styles.logo}>
          <View style={styles.logoIcon}>
            <Feather name="heart" size={14} color={Colors.text} />
          </View>
          <Text style={styles.logoText}>CareDose AI</Text>
        </View>
        {currentIndex < slides.length - 1 && (
          <TouchableOpacity onPress={handleSkip} activeOpacity={0.7} style={styles.skipBtn}>
            <Text style={styles.skipText}>{t("skip")}</Text>
          </TouchableOpacity>
        )}
      </View>

      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <SlideItem item={item} index={index} scrollX={scrollX} />}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, index) => (
            <Dot key={index} index={index} scrollX={scrollX} />
          ))}
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Animated.Text style={styles.nextButtonText}>
            {currentIndex === slides.length - 1 ? t("get_started") : t("continue")}
          </Animated.Text>
          <Feather
            name={currentIndex === slides.length - 1 ? "arrow-right" : "chevron-right"}
            size={18}
            color={Colors.background}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  ambientGlow: {
    position: "absolute",
    top: -height * 0.2,
    left: -width * 0.5,
    width: width * 2,
    height: height * 0.8,
    borderRadius: height,
    opacity: 0.8,
  },
  ambientGlowOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background,
    opacity: 0.95,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    zIndex: 10,
  },
  logo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 17,
    fontFamily: "DMSans_700Bold",
    color: Colors.text,
    letterSpacing: -0.3,
  },
  skipBtn: {
    backgroundColor: Colors.glass.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  skipText: {
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
    color: Colors.textSecondary,
  },
  slide: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingBottom: height * 0.05,
  },
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  imageGlow: {
    position: "absolute",
    width: IMAGE_SIZE * 0.7,
    height: IMAGE_SIZE * 0.7,
    borderRadius: IMAGE_SIZE * 0.35,
    opacity: 0.8,
    // Add heavy blur in a real environment if needed, but opacity works for a soft shadow
  },
  slideImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 24,
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontFamily: "DMSerifDisplay_400Regular",
    color: Colors.textWarm,
    textAlign: "center",
    lineHeight: 40,
    marginBottom: 18,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 32,
    zIndex: 10,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  nextButton: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
    borderRadius: 100, // Pill shape
  },
  nextButtonText: {
    fontSize: 17,
    fontFamily: "DMSans_700Bold",
    color: "#000000",
  },
});

import { useEffect, useState } from "react";
import { Pressable, Text, View, type PressableProps } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import { cn } from "../../utils/cn";

type ButtonVariant = "primary" | "secondary" | "icon";

type ButtonProps = PressableProps & {
  variant?: ButtonVariant;
  label?: string;
  children?: React.ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "rounded-full bg-primary px-4 py-2 shadow-sm active:opacity-80",
  secondary: "rounded-full border border-border px-4 py-2 active:bg-surface",
  icon: "rounded-lg p-2 active:bg-surface",
};

const labelClasses: Record<ButtonVariant, string> = {
  primary: "font-medium text-white",
  secondary: "font-medium text-primary",
  icon: "text-primary",
};

const rippleColors: Record<ButtonVariant, string> = {
  primary: "rgba(255,255,255,0.3)",
  secondary: "rgba(204,120,92,0.15)",
  icon: "rgba(204,120,92,0.15)",
};

export function Button({
  variant = "primary",
  label,
  disabled,
  className,
  children,
  onPress,
  ...rest
}: ButtonProps) {
  const [rippleTick, setRippleTick] = useState(0);
  const rippleOpacity = useSharedValue(0);
  const rippleScale = useSharedValue(0);

  useEffect(() => {
    if (rippleTick === 0) return;
    rippleScale.value = withSequence(
      withTiming(0, { duration: 0 }),
      withTiming(1, { duration: 250 }),
    );
    rippleOpacity.value = withSequence(
      withTiming(1, { duration: 0 }),
      withTiming(0, { duration: 250 }),
    );
  }, [rippleTick, rippleScale, rippleOpacity]);

  const rippleStyle = useAnimatedStyle(() => ({
    opacity: rippleOpacity.value,
    transform: [{ scale: rippleScale.value }],
  }));

  return (
    <Pressable
      className={cn(
        "overflow-hidden",
        variantClasses[variant],
        { "opacity-50": disabled },
        className,
      )}
      disabled={disabled}
      onPress={(e) => {
        if (!disabled) setRippleTick((t) => t + 1);
        onPress?.(e);
      }}
      {...rest}
    >
      <View>
        {children ??
          (label ? (
            <Text className={labelClasses[variant]}>{label}</Text>
          ) : null)}
      </View>
      {!disabled && (
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 999,
              backgroundColor: rippleColors[variant],
            },
            rippleStyle,
          ]}
        />
      )}
    </Pressable>
  );
}

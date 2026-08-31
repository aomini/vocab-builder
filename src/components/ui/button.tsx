import { Pressable, Text } from "react-native";
import { cn } from "../../utils/cn";

type ButtonVariant = "primary" | "secondary" | "icon" | "danger";

type ButtonProps = {
  onPress: () => void;
  label: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  className?: string;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: "rounded-full bg-primary px-4 py-2",
  secondary: "rounded-full border border-border px-4 py-2",
  icon: "rounded-lg p-2",
  danger: "rounded-full bg-red-500 px-4 py-2",
};

const variantTextStyles: Record<ButtonVariant, string> = {
  primary: "font-medium text-white",
  secondary: "font-medium text-primary",
  icon: "text-lg text-primary",
  danger: "font-medium text-white",
};

export function Button({
  onPress,
  label,
  variant = "primary",
  disabled = false,
  className,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={cn(
        variantStyles[variant],
        { "opacity-50": disabled },
        className,
      )}
    >
      <Text className={variantTextStyles[variant]}>{label}</Text>
    </Pressable>
  );
}

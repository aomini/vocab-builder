import { Pressable, Text, type PressableProps } from "react-native";
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

export function Button({
  variant = "primary",
  label,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <Pressable
      className={cn(
        variantClasses[variant],
        { "opacity-50": disabled },
        className,
      )}
      disabled={disabled}
      {...rest}
    >
      {children ??
        (label ? <Text className={labelClasses[variant]}>{label}</Text> : null)}
    </Pressable>
  );
}

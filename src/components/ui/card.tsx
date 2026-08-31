import { Pressable } from "react-native";
import { cn } from "../../utils/cn";

type CardProps = {
  onPress?: () => void;
  children: React.ReactNode;
  className?: string;
};

export function Card({ onPress, children, className }: CardProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className={cn(
        "rounded-lg border border-border bg-background p-4",
        className,
      )}
    >
      {children}
    </Pressable>
  );
}

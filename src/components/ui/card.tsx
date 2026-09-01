import { Pressable, type PressableProps } from "react-native";
import { cn } from "../../utils/cn";

type CardProps = PressableProps & {
  children: React.ReactNode;
};

export function Card({ children, className, ...rest }: CardProps) {
  return (
    <Pressable
      className={cn(
        "rounded-lg border border-border bg-background p-4 shadow-sm active:shadow-md",
        className,
      )}
      {...rest}
    >
      {children}
    </Pressable>
  );
}

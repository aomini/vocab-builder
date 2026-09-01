import { useState } from "react";
import { View, TextInput, Text, type TextInputProps } from "react-native";
import { cn } from "../../utils/cn";

type InputProps = TextInputProps & {
  error?: string;
  maxLength?: number;
  showCounter?: boolean;
};

export function Input({
  error,
  maxLength,
  showCounter,
  className,
  onFocus,
  onBlur,
  value,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View className="w-full">
      <TextInput
        className={cn(
          "rounded-xl border bg-surface px-4 py-3 text-base text-text",
          { "border-primary": focused && !error },
          { "border-border": !focused && !error },
          { "border-red-500": !!error },
          className,
        )}
        placeholderTextColor="#9ca3af"
        value={value}
        maxLength={maxLength}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />
      <View className="flex-row justify-between px-1 pt-1">
        {error ? (
          <Text className="text-xs text-red-500">{error}</Text>
        ) : (
          <View />
        )}
        {showCounter && maxLength ? (
          <Text className="text-xs text-gray-400">
            {value?.length ?? 0}/{maxLength}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

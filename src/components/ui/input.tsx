import { useState } from "react";
import { View, TextInput, Text } from "react-native";
import { cn } from "../../utils/cn";

type InputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  placeholderTextColor?: string;
  onSubmitEditing?: () => void;
  returnKeyType?: "send" | "done" | "go" | "next" | "search";
  error?: string;
  maxLength?: number;
  showCharacterCount?: boolean;
  multiline?: boolean;
  className?: string;
};

export function Input({
  value,
  onChangeText,
  placeholder,
  placeholderTextColor = "#9ca3af",
  onSubmitEditing,
  returnKeyType,
  error,
  maxLength,
  showCharacterCount = false,
  multiline = false,
  className,
}: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View className="flex-1">
      <TextInput
        className={cn(
          "flex-1 rounded-lg border px-3 py-2 text-base text-text",
          { "border-primary": focused, "border-border": !focused && !error },
          { "border-red-500": !!error },
          className,
        )}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        onSubmitEditing={onSubmitEditing}
        returnKeyType={returnKeyType}
        maxLength={maxLength}
        multiline={multiline}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {error && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
      {showCharacterCount && maxLength && (
        <Text className="mt-1 text-right text-xs text-gray-400">
          {value.length}/{maxLength}
        </Text>
      )}
    </View>
  );
}

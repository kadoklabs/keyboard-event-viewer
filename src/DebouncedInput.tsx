import { useEffect, useState } from "react";
import { TextInput, type TextInputProps } from "@mantine/core";

type DebouncedInputProps = Omit<TextInputProps, "value" | "onChange"> & {
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
};

export function DebouncedInput({ value, onChange, debounceMs = 250, ...rest }: DebouncedInputProps) {
  const [localValue, setLocalValue] = useState(value);

  // Sync local state when the parent value changes (e.g. on clear)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Only propagate the value to the parent after the debounce delay
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [localValue, debounceMs, onChange]);

  return (
    <TextInput
      {...rest}
      value={localValue}
      onChange={(e) => setLocalValue(e.currentTarget.value)}
    />
  );
}

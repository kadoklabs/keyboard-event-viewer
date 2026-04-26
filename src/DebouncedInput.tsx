import { useCallback, useEffect, useRef, useState } from "react";
import { TextInput, type TextInputProps } from "@mantine/core";

type DebouncedInputProps = Omit<TextInputProps, "value" | "onChange"> & {
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
};

export function DebouncedInput({ value, onChange, debounceMs = 200, ...rest }: DebouncedInputProps) {
  const [localValue, setLocalValue] = useState(value);

  // Keep a ref to the latest onChange so the debounce effect doesn't need it
  // as a dependency and won't reset the timer when the parent re-renders.
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  const stableOnChange = useCallback((v: string) => onChangeRef.current(v), []);

  // Sync local state when the parent value changes (e.g. on clear)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Only propagate the value to the parent after the debounce delay
  useEffect(() => {
    const timer = setTimeout(() => {
      stableOnChange(localValue);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [localValue, debounceMs, stableOnChange]);

  return (
    <TextInput
      {...rest}
      value={localValue}
      onChange={(e) => setLocalValue(e.currentTarget.value)}
    />
  );
}

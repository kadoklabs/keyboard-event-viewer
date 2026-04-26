import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  Badge,
  Box,
  Button,
  createTheme,
  Group,
  MantineProvider,
  Paper,
  Stack,
  Switch,
  TextInput,
} from "@mantine/core";
import { DebouncedInput } from "./DebouncedInput";
import { EventTable } from "./EventTable";
import { get, last } from "lodash-es";

const theme = createTheme({
  components: {
    Badge: Badge.extend({
      defaultProps: {
        tt: "none",
      },
    }),
  },
});

const eventTypes: (keyof HTMLElementEventMap)[] = [
  "keydown",
  "keyup",
  "keypress",
  "input",
  "beforeinput",
  "beforematch",
];

const modifierKeys = [
  "Alt",
  "AltGraph",
  "CapsLock",
  "Control",
  "Fn",
  "Meta",
  "NumLock",
  "ScrollLock",
  "Shift",
  "Symbol",
  "SymbolLock",
];

export type TestEvent = {
  type: string;
  timeStamp: number;
  charCode: number;
  keyCode: number;
  which: number;
  modifiers: string;
  key: string;
  code: string;
  location: number;
  repeat: boolean;
  isComposing: boolean;
  inputType: string;
  data: string;
  delay: number;
};

export const App = memo(() => {
  const [botEvents, setBotEvents] = useState<TestEvent[]>([]);
  const [userEvents, setUserEvents] = useState<TestEvent[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"bot" | "user">("bot");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (!inputRef.current) return;

    console.log("Registering event listeners");

    const listener = (event: Event) => {
      const testEvent: TestEvent = {
        type: event.type,
        timeStamp: event.timeStamp || 0,
        charCode: get(event, "charCode", 0),
        keyCode: get(event, "keyCode", 0),
        which: get(event, "which", 0),
        modifiers: "",
        key: get(event, "key", ""),
        code: get(event, "code", ""),
        location: get(event, "location", 0),
        repeat: get(event, "repeat", false),
        isComposing: get(event, "isComposing", false),
        inputType: get(event, "inputType", ""),
        data: get(event, "data", ""),
        delay: 0,
      };

      if (event instanceof KeyboardEvent) {
        testEvent.modifiers = modifierKeys.filter((key) => event.getModifierState(key)).join(", ");
      }

      if (mode === "bot") {
        setBotEvents((prevEvents) => [
          ...prevEvents,
          {
            ...testEvent,
            delay: prevEvents.length > 0 ? testEvent.timeStamp - last(prevEvents)!.timeStamp : 0,
          },
        ]);
      } else {
        setUserEvents((prevEvents) => [
          ...prevEvents,
          {
            ...testEvent,
            delay: prevEvents.length > 0 ? testEvent.timeStamp - last(prevEvents)!.timeStamp : 0,
          },
        ]);
      }
    };

    const element = inputRef.current;

    eventTypes.forEach((type) => {
      element.addEventListener(type, listener);
    });

    return () => {
      eventTypes.forEach((type) => {
        element.removeEventListener(type, listener);
      });
    };
  }, [inputRef, mode]);

  const clearInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, []);

  const handleClear = useCallback(() => {
    setBotEvents([]);
    setUserEvents([]);
    setFilter("");
    clearInput();
  }, [clearInput]);

  useEffect(() => {
    clearInput();
  }, [mode, clearInput]);

  return (
    <MantineProvider defaultColorScheme="auto" theme={theme}>
      <Box p="md">
        <Paper withBorder p="md">
          <Stack>
            <Group gap="xs">
              <TextInput id="input" flex={1} placeholder="Type here" ref={inputRef} />
              <Button color="red" onClick={handleClear}>
                Clear
              </Button>
              <Switch
                label={mode === "bot" ? "Bot Mode" : "User Mode"}
                checked={mode === "bot"}
                onChange={(event) => {
                  setMode(event.currentTarget.checked ? "bot" : "user");
                }}
              />
            </Group>

            <DebouncedInput
              value={filter}
              onChange={setFilter}
              debounceMs={200}
              placeholder="Filter events by type, key, code…"
            />

            <EventTable
              events={mode === "bot" ? botEvents : userEvents}
              userEvents={userEvents}
              mode={mode}
              filter={filter}
            />
          </Stack>
        </Paper>
      </Box>
    </MantineProvider>
  );
});

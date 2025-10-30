import { memo, useEffect, useRef, useState } from "react";
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
  Table,
  TextInput,
} from "@mantine/core";
import { EventRow } from "./EventRow";
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

  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleClear = () => {
    setBotEvents([]);
    clearInput();
  };

  useEffect(() => {
    clearInput();
  }, [mode]);

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

            <Table striped>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>#</Table.Th>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Timestamp</Table.Th>
                  <Table.Th>Delay</Table.Th>
                  <Table.Th>Char Code</Table.Th>
                  <Table.Th>Key Code</Table.Th>
                  <Table.Th>Which</Table.Th>
                  <Table.Th>Modifiers</Table.Th>
                  <Table.Th>Key</Table.Th>
                  <Table.Th>Code</Table.Th>
                  <Table.Th>Location</Table.Th>
                  <Table.Th>Repeat</Table.Th>
                  <Table.Th>Composing</Table.Th>
                  <Table.Th>Input Type</Table.Th>
                  <Table.Th>Data</Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {(mode === "bot" ? botEvents : userEvents).map((event, index) => (
                  <EventRow key={`${mode}-${index}`} index={index} event={event} userEvent={userEvents[index]} />
                ))}
              </Table.Tbody>
            </Table>
          </Stack>
        </Paper>
      </Box>
    </MantineProvider>
  );
});

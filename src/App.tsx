import { memo, useEffect, useRef, useState } from "react";
import { Box, Button, Group, MantineProvider, Paper, Stack, Table, TextInput } from "@mantine/core";
import { EventRow } from "./EventRow";
import { useInputState } from "@mantine/hooks";

const eventTypes: (keyof HTMLElementEventMap)[] = [
  "keydown",
  "keyup",
  "keypress",
  "input",
  "beforeinput",
  "beforematch",
];

export const App = memo(() => {
  const [value, setValue] = useInputState("");
  const [events, setEvents] = useState<KeyboardEvent[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    const listener = (event: Event) => {
      setEvents((prevEvents) => [...prevEvents, event as KeyboardEvent]);
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
  }, [inputRef]);

  const handleClear = () => {
    setEvents([]);
  };

  return (
    <MantineProvider defaultColorScheme="auto">
      <Box p="md">
        <Paper withBorder p="md">
          <Stack>
            <Group>
              <TextInput id="input" flex={1} placeholder="Type here" ref={inputRef} value={value} onChange={setValue} />
              <Button color="red" onClick={handleClear}>
                Clear
              </Button>
            </Group>

            <Table striped>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>#</Table.Th>
                  <Table.Th>Timestamp</Table.Th>
                  <Table.Th>Type</Table.Th>
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
                {events.map((event, index) => (
                  <EventRow key={index} index={index} event={event} />
                ))}
              </Table.Tbody>
            </Table>
          </Stack>
        </Paper>
      </Box>
    </MantineProvider>
  );
});

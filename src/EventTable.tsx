import { memo, useMemo } from "react";
import { Table } from "@mantine/core";
import { EventRow } from "./EventRow";
import type { TestEvent } from "./App";

type EventTableProps = {
  events: TestEvent[];
  userEvents: TestEvent[];
  mode: "bot" | "user";
  filter: string;
};

export const EventTable = memo(({ events, userEvents, mode, filter }: EventTableProps) => {
  // Recompute only when events or filter changes, not on every parent render
  const filteredRows = useMemo(() => {
    if (!filter) {
      return events.map((event, index) => ({ event, index }));
    }
    const q = filter.toLowerCase();
    return events.reduce<{ event: TestEvent; index: number }[]>((acc, event, index) => {
      if (
        event.type.toLowerCase().includes(q) ||
        event.key.toLowerCase().includes(q) ||
        event.code.toLowerCase().includes(q) ||
        event.inputType.toLowerCase().includes(q) ||
        event.data.toLowerCase().includes(q)
      ) {
        acc.push({ event, index });
      }
      return acc;
    }, []);
  }, [events, filter]);

  return (
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
        {filteredRows.map(({ event, index }) => (
          <EventRow
            key={`${mode}-${index}`}
            index={index}
            event={event}
            userEvent={userEvents[index]}
          />
        ))}
      </Table.Tbody>
    </Table>
  );
});

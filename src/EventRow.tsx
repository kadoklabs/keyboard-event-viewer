import { Table } from "@mantine/core";
import { memo, useMemo } from "react";
import { get } from "lodash-es";

export type EventRowProps = {
  index: number;
  event: KeyboardEvent;
};

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

export const EventRow = memo(({ index, event }: EventRowProps) => {
  const modifiers = useMemo(() => {
    if (!event.getModifierState) return "";
    return modifierKeys.filter((key) => event.getModifierState(key)).join(", ");
  }, [event]);

  const inputType = useMemo(() => {
    return get(event, "inputType", "");
  }, [event]);

  const data = useMemo(() => {
    return get(event, "data", "");
  }, [event]);

  return (
    <Table.Tr>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{event.timeStamp.toFixed(2)}</Table.Td>
      <Table.Td>{event.type}</Table.Td>
      <Table.Td>{event.charCode}</Table.Td>
      <Table.Td>{event.keyCode}</Table.Td>
      <Table.Td>{event.which}</Table.Td>
      <Table.Td>{modifiers}</Table.Td>
      <Table.Td>{event.key}</Table.Td>
      <Table.Td>{event.code}</Table.Td>
      <Table.Td>{event.location}</Table.Td>
      <Table.Td>{event.repeat ? "Yes" : "No"}</Table.Td>
      <Table.Td>{event.isComposing ? "Yes" : "No"}</Table.Td>
      <Table.Td>{inputType}</Table.Td>
      <Table.Td>{data}</Table.Td>
    </Table.Tr>
  );
});

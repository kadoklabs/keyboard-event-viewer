import { Badge, Group, Table, Text, Tooltip } from "@mantine/core";
import { memo } from "react";
import { get } from "lodash-es";
import type { TestEvent } from "./App";

export type EventRowProps = {
  index: number;
  event: TestEvent;
  userEvent?: TestEvent;
};

const sortedKeys = [
  "type",
  "timeStamp",
  "delay",
  "charCode",
  "keyCode",
  "which",
  "modifiers",
  "key",
  "code",
  "location",
  "repeat",
  "isComposing",
  "inputType",
  "data",
] as (keyof TestEvent)[];

export const EventRow = memo(({ index, event, userEvent }: EventRowProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatEventValue = (key: string, value: any) => {
    if (["timeStamp", "delay"].includes(key)) return value.toFixed(2);

    return value;
  };

  return (
    <Table.Tr>
      <Table.Td>{index + 1}</Table.Td>
      {sortedKeys.map((key) => {
        const value = formatEventValue(key, event[key]);
        const userValue = formatEventValue(key, get(userEvent, key, event[key]));

        return (
          <Table.Td key={key}>
            <Tooltip
              hidden={value === userValue || key === "timeStamp"}
              color="dark"
              withArrow
              label={
                <Group gap="xs">
                  <Text size="sm">{value}</Text>
                  <Text c="gray" size="sm">
                    -
                  </Text>
                  <Text size="sm">{userValue}</Text>
                </Group>
              }
            >
              <Badge color={value !== userValue && key !== "timeStamp" ? "red" : "gray"}>{value}</Badge>
            </Tooltip>
          </Table.Td>
        );
      })}
    </Table.Tr>
  );
});

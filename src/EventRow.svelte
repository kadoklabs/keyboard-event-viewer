<script lang="ts">
	import { Badge } from "$lib/components/ui/badge/index.js";
	import {
		TableRow,
		TableCell,
	} from "$lib/components/ui/table/index.js";

	type TestEvent = {
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

	type Props = {
		index: number;
		event: TestEvent;
		userEvent?: TestEvent;
	};

	let { index, event, userEvent }: Props = $props();

	const sortedKeys: (keyof TestEvent)[] = [
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
	];

	function formatEventValue(key: string, value: any): any {
		if (["timeStamp", "delay"].includes(key)) return value.toFixed(2);
		return value;
	}
</script>

<TableRow>
	<TableCell class="text-center">{index + 1}</TableCell>
	{#each sortedKeys as key}
		{@const value = formatEventValue(key, event[key])}
		{@const userValue = formatEventValue(key, userEvent?.[key] ?? event[key])}
		{@const isDifferent = value !== userValue && key !== "timeStamp"}
		<TableCell>
			<div class="flex items-center gap-1">
				<Badge variant={isDifferent ? "destructive" : "secondary"}>
					{value}
				</Badge>
				{#if key === "keyCode" && !!value}
					<Badge variant="outline">
						{String.fromCharCode(Number(value))}
					</Badge>
				{/if}
			</div>
		</TableCell>
	{/each}
</TableRow>

<script lang="ts">
	import "./app.css";
	import EventRow from "./EventRow.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import {
		ToggleGroup,
		ToggleGroupItem,
	} from "$lib/components/ui/toggle-group/index.js";
	import {
		Table,
		TableBody,
		TableHead,
		TableHeader,
		TableRow,
	} from "$lib/components/ui/table/index.js";


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
		"SymbolLock"
	];

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
		delay: number
	 };

	let botEvents: TestEvent[] = $state([]);
	let userEvents: TestEvent[] = $state([]);
	let mode: "bot" | "user" = $state("bot");
	let inputValue = $state("");

	function getModifierState(event: KeyboardEvent): string {
		return modifierKeys.filter((key) => event.getModifierState(key as any)).join(", ");
	}

	function handleEvent(event: Event) {
		const testEvent: TestEvent = {
			type: event.type,
			timeStamp: event.timeStamp || 0,
			charCode: (event as any).charCode ?? 0,
			keyCode: (event as any).keyCode ?? 0,
			which: (event as any).which ?? 0,
			modifiers: "",
			key: (event as any).key ?? "",
			code: (event as any).code ?? "",
			location: (event as any).location ?? 0,
			repeat: (event as any).repeat ?? false,
			isComposing: (event as any).isComposing ?? false,
			inputType: (event as any).inputType ?? "",
			data: (event as any).data ?? "",
			delay: 0
		};

		if (event instanceof KeyboardEvent) {
			testEvent.modifiers = getModifierState(event);
		}

		if (mode === "bot") {
			const lastEvent = botEvents[botEvents.length - 1];

			testEvent.delay = lastEvent ? testEvent.timeStamp - lastEvent.timeStamp : 0;
			botEvents = [...botEvents, testEvent];
		} else {
			const lastEvent = userEvents[userEvents.length - 1];

			testEvent.delay = lastEvent ? testEvent.timeStamp - lastEvent.timeStamp : 0;
			userEvents = [...userEvents, testEvent];
		}
	}

	function clearInput() {
		inputValue = "";
	}

	function handleClear() {
		botEvents = [];
		userEvents = [];
		clearInput();
	}

	function handleExport() {
		const payload = {
			botEvents,
			userEvents,
		};
		const blob = new Blob([JSON.stringify(payload, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement("a");

		anchor.href = url;
		anchor.download = "keyboard-events.json";
		document.body.appendChild(anchor);
		anchor.click();
		anchor.remove();
		URL.revokeObjectURL(url);
	}

	function handleKeydown(event: Event) {
		handleEvent(event);
	}

	function handleKeyup(event: Event) {
		handleEvent(event);
	}

	function handleInput(event: Event) {
		handleEvent(event);
	}

	function handleBeforeinput(event: Event) {
		handleEvent(event);
	}

	function handleBeforematch(event: Event) {
		handleEvent(event);
	}

	$effect(() => {
		mode;
		clearInput();
	});

	let currentEvents = $derived(mode === "bot" ? botEvents : userEvents);
	let hasEvents = $derived(botEvents.length > 0 || userEvents.length > 0);
</script>

<div class="min-h-screen bg-background p-4">
	<div class="max-w-7xl mx-auto">
		<div class="border rounded-lg p-4 bg-card shadow-sm">
			<!-- Header Controls -->
			<div class="flex items-center gap-2 mb-4">
				<Input
					id="input"
					type="text"
					placeholder="Type here"
					class="flex-1"
					bind:value={inputValue}
					onkeydown={handleKeydown}
					onkeypress={handleKeydown}
					onkeyup={handleKeyup}
					oninput={handleInput}
					onbeforeinput={handleBeforeinput}
					onbeforematch={handleBeforematch}
				/>
				<Button variant="destructive" onclick={handleClear}>Clear</Button>
				<Button variant="outline" onclick={handleExport} disabled={!hasEvents}>Export JSON</Button>
				<ToggleGroup
					type="single"
					value={mode}
					onValueChange={(v) => {
						if (v) {
							mode = v as "bot" | "user";
						}
					}}
				>
					<ToggleGroupItem value="bot">Bot</ToggleGroupItem>
					<ToggleGroupItem value="user">User</ToggleGroupItem>
				</ToggleGroup>
			</div>

			<!-- Table -->
			<div class="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead class="w-[50px] text-center">#</TableHead>
							<TableHead>Type</TableHead>
							<TableHead>Timestamp</TableHead>
							<TableHead>Delay</TableHead>
							<TableHead>Char Code</TableHead>
							<TableHead>Key Code</TableHead>
							<TableHead>Which</TableHead>
							<TableHead>Modifiers</TableHead>
							<TableHead>Key</TableHead>
							<TableHead>Code</TableHead>
							<TableHead>Location</TableHead>
							<TableHead>Repeat</TableHead>
							<TableHead>Composing</TableHead>
							<TableHead>Input Type</TableHead>
							<TableHead>Data</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{#each currentEvents as event, index (index)}
							<EventRow index={index} {event} userEvent={userEvents[index]} />
						{/each}
					</TableBody>
				</Table>
			</div>
		</div>
	</div>
</div>

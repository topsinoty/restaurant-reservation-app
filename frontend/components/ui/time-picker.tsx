"use client";

import * as React from "react";
import { Clock3 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { TimePickerInput } from "@/components/ui/time-picker-input";

interface TimePickerProps {
	value?: string;
	onChange?: (value: string) => void;
	onBlur?: () => void;
	disabled?: boolean;
	className?: string;
	placeholder?: string;
	"aria-invalid"?: boolean;
}

const TIME_24H_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

function parseTimeValue(value?: string) {
	if (!value || !TIME_24H_REGEX.test(value)) {
		return undefined;
	}

	const [hours, minutes] = value.split(":").map(Number);
	const date = new Date();

	date.setHours(hours, minutes, 0, 0);

	return date;
}

function formatTimeValue(date: Date) {
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");

	return `${hours}:${minutes}`;
}

export function TimePicker({
	value,
	onChange,
	onBlur,
	disabled,
	className,
	placeholder = "Select time",
	"aria-invalid": ariaInvalid,
}: Readonly<TimePickerProps>) {
	const [open, setOpen] = React.useState(false);
	const [date, setDate] = React.useState<Date | undefined>(() =>
		parseTimeValue(value),
	);
	const hourRef = React.useRef<HTMLInputElement>(null);
	const minuteRef = React.useRef<HTMLInputElement>(null);
	const id = React.useId();

	React.useEffect(() => {
		setDate(parseTimeValue(value));
	}, [value]);

	const handleDateChange = React.useCallback(
		(nextDate: Date | undefined) => {
			if (!nextDate) {
				setDate(undefined);
				onChange?.("");
				return;
			}

			setDate(nextDate);
			onChange?.(formatTimeValue(nextDate));
		},
		[onChange],
	);

	return (
		<Popover
			open={open}
			onOpenChange={(nextOpen) => {
				setOpen(nextOpen);
				if (!nextOpen) {
					onBlur?.();
				}
			}}
		>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant="outline"
					disabled={disabled}
					aria-invalid={ariaInvalid}
					className={cn("w-full justify-between px-3 font-normal", className)}
				>
					<span
						className={cn("tabular-nums", !value && "text-muted-foreground")}
					>
						{value || placeholder}
					</span>
					<Clock3 className="size-4 text-muted-foreground" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-auto p-4"
				align="start"
				onOpenAutoFocus={(event) => {
					event.preventDefault();
					hourRef.current?.focus();
				}}
			>
				<div className="flex items-end gap-3">
					<div className="grid gap-1.5 text-center">
						<Label
							htmlFor={`${id}-hours`}
							className="text-xs text-muted-foreground"
						>
							Hour
						</Label>
						<TimePickerInput
							id={`${id}-hours`}
							picker="hours"
							date={date}
							setDate={handleDateChange}
							ref={hourRef}
							onRightFocus={() => minuteRef.current?.focus()}
						/>
					</div>
					<span className="pb-2 text-lg font-medium text-muted-foreground">
						:
					</span>
					<div className="grid gap-1.5 text-center">
						<Label
							htmlFor={`${id}-minutes`}
							className="text-xs text-muted-foreground"
						>
							Minute
						</Label>
						<TimePickerInput
							id={`${id}-minutes`}
							picker="minutes"
							date={date}
							setDate={handleDateChange}
							ref={minuteRef}
							onLeftFocus={() => hourRef.current?.focus()}
						/>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}

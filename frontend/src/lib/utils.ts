import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function splitString(str: string): string[] {
	const characters: string[] = [];
	const regex = /[\s\S]/gu;

	let match;

	while((match = regex.exec(str)) !== null) {
		characters.push(match[0]);
	}

	return characters;
}

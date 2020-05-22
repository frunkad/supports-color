import { parse } from "https://deno.land/std/flags/mod.ts";

const { args, env } = Deno;
console.log("DDD");

const parsedArgs = parse(args);

// Forcefully set a color preference

/**
 * forceColor
 * Forcefully set a color preference
 * Values: null (no preference), 1, 2, 3
 * In case 0, it will simply return false
 * In case 1 & above, it will check further
 */
let forceColor: number|null = null;
if (parsedArgs._.includes('no-color') ||
    parsedArgs._.includes('no-colors') ||
    parsedArgs.color !== undefined && (parsedArgs.color === false || parsedArgs.color === "false" || parsedArgs.color === "never") 
    ) {
	forceColor = 0;
} else if (parsedArgs._.includes('color') ||
    parsedArgs._.includes('colors') ||
	parsedArgs.color !== undefined && (parsedArgs.color === true || parsedArgs.color === "true" || parsedArgs.color === "always") 
	) {
	forceColor = 1;
}

function translateLevel(level: number): false | { level: number; hasBasic: boolean; has256: boolean; has16m: boolean; } {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: level >= 1,
		has256: level >= 2,
		has16m: level >= 3
	};
}

const checkSupportsColor = (haveStream: Deno.Writer & Deno.Closer & { rid: number }, streamIsTTY: boolean) => {

	// Deno.noColor to be respected above all
	// See https://no-color.org/
	if (Deno.noColor) return 0;

	if (forceColor === 0) {
		return 0;
	}

	if (parsedArgs.color !== undefined && (parsedArgs.color == "16m" || (parsedArgs.color == "full") || (parsedArgs.color == "truecolor"))) {
		return 3;
	}

	if (parsedArgs.color !== undefined && parsedArgs.color == "256") {
		return 2;
	}

	if (haveStream && !streamIsTTY && forceColor === null) {
		return 0;
	}

	const min = forceColor || 0;
	if (Deno.build.os === 'windows') {
		// Windows 10 build 10586 is the first Windows release that supports 256 colors.
		// Windows 10 build 14931 is the first release that supports 16m/TrueColor.

		// Unimplemented as of v1.0.1
		// [Issue #3802](https://github.com/denoland/deno/issues/3802)
		return 2; // Assumption

		// const osRelease = os.release().split('.');
		// if (
		// 	Number(osRelease[0]) >= 10 &&
		// 	Number(osRelease[2]) >= 10586
		// ) {
		// 	return Number(osRelease[2]) >= 14931 ? 3 : 2;
		// }
		// return 1;
	}
	return min;
}

function getSupportLevel(stream: Deno.Writer & Deno.Closer & { rid: number }) {
	const level = checkSupportsColor(stream, stream && Deno.isatty(stream.rid));
	return translateLevel(level);
}

export const supportsColorNoPerm = {
	supportsColor: getSupportLevel,
	stdout: translateLevel(checkSupportsColor(Deno.stdout, Deno.isatty(Deno.stdout.rid))),
	stderr: translateLevel(checkSupportsColor(Deno.stderr, Deno.isatty(Deno.stderr.rid)))
};

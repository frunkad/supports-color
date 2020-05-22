import { supportsColor } from './ported.ts'

if (supportsColor.stdout) {
	console.log('Terminal stdout supports color');
}

if (supportsColor.stdout && supportsColor.stdout.has256) {
	console.log('Terminal stdout supports 256 colors');
}

if (supportsColor.stderr && supportsColor.stderr.has16m) {
	console.log('Terminal stderr supports 16 million colors (truecolor)');
}
# supports-color

> Detect whether a terminal supports color, ported to Deno 🦕 from [support-color npm registry](https://npmjs.com/package/support-color)

## Permissions Required

To check for possible environment variables such as FORCE_COLOR, TERM, COLOR_TERM, `--allow-env` permission is required.

## Usage
The original implementation at [chalk/supports-color](https://github.com/chalk/supports-color) checks the environment variables as soon as the
module is loaded. This imply that --allow-env permission would be required every time your code runs. To avoid this, there are two implementation
methods in this repository. 

### Preferred Usage Methods
If you are creating a new repo from scratch, prefer this method. 

```js
import { supportColorCheck } from './mod.ts'
const supportsColor = supportColorCheck();

if (supportsColor.stdout) {
	console.log('Terminal stdout supports color');
}

if (supportsColor.stdout && supportsColor.stdout.has256) {
	console.log('Terminal stdout supports 256 colors');
}

if (supportsColor.stderr && supportsColor.stderr.has16m) {
	console.log('Terminal stderr supports 16 million colors (truecolor)');
}
```


### Ported Usage Methods
If you are porting another npm repo or your project needs `--allow-env` everywhere, you may use this method.

```js
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
```

## API

Returns an `Object` with a `stdout` and `stderr` property for testing either streams. Each property is an `Object`, or `false` if color is not supported.

The `stdout`/`stderr` objects specifies a level of support for color through a `.level` property and a corresponding flag:

- `.level = 1` and `.hasBasic = true`: Basic color support (16 colors)
- `.level = 2` and `.has256 = true`: 256 color support
- `.level = 3` and `.has16m = true`: Truecolor support (16 million colors)


## Info

It obeys the `--color` and `--no-color` CLI flags.

For situations where using `--color` is not possible, use the environment variable `FORCE_COLOR=1` (level 1), `FORCE_COLOR=2` (level 2), or `FORCE_COLOR=3` (level 3) to forcefully enable color, or `FORCE_COLOR=0` to forcefully disable. The use of `FORCE_COLOR` overrides all other color support checks.

The environment variable [`NO_COLOR`](https://no-color.org/) is also supported, though to `FORCE_COLOR` overrides it.

Explicit 256/Truecolor mode can be enabled using the `--color=256` and `--color=16m` flags, respectively.


## Related

- [supports-color-cli](https://github.com/chalk/supports-color-cli) - CLI for this module
- [chalk](https://github.com/chalk/chalk) - Terminal string styling done right


## Original Authors and Maintainers

- [Sindre Sorhus](https://github.com/sindresorhus)
- [Josh Junon](https://github.com/qix-)
- [Other Contributors](https://github.com/chalk/supports-color/graphs/contributors)

## Original License

[License](https://github.com/chalk/supports-color/blob/master/license)

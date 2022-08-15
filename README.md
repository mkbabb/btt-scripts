# btt-scripts

A collection of utility scripts, written in TypeScript, for [Better Touch Tool](https://bettertouchtool.com) (hereinafter `BTT`).

Uses `BTT`'s "_Run JavaScript for Automation_" to execute the compiled TypeScript as `JXA` (JavaScript for Automation; learn more [here](https://github.com/JXA-Cookbook/JXA-Cookbook)).

## Usage

The compiled JavaScript is available within the [`out`](out/) directory.
See the below sections for what each module does.

Outside of `BTT`:

1. Create a JSON caching file. This is used to persist states used in-between actions. The default location is `/tmp/betterTouchTool.json`, but you **must** manually create it first.


        touch /tmp/betterTouchTool.json
        echo "{}" > /tmp/betterTouchTool.json

Within `BTT`:

1.  Create a trigger:
2.  Select "Assigned Actions" and therein search for "Run JavaScript for Automation **(async in the background)**" (async is critical here).
3.  Click the "Source Type" and select "Apple JavaScript for Automation"
4.  Finally, copy and paste the code - into the text box below "Run" - from a chosen file in [`out`](out/); [`thirds/one/left.js`](out/thirds/one/left.js) for example.
5.  Save, and you're done 🎉.

You can find an example set of my `BTT` presets [here](data/presets.bttpreset).

## [`thirds`](src/thirds/)

For resizing the current window by 1 or 2 thirds increments. Each 1 or 2 third sub-dir contains two files: `left` and `right`. Calling `left` from `BTT` will advance the current window to the next `n`-segment of the screen. If the current screen is at the edge of the display, it will wrap back around to the right-most side thereof - conversely for calling `right`.

## Developing

     npm install && rollup -c rollup.config.js

[rollup.js](https://rollupjs.org/guide/en/) is used to bundle and compile the TypeScript code into JavaScript executable by `BTT`. Executing the above will install the necessary packages, thereupon running rollup.

### [`state-utils`](src/state-utils.ts)

Facilitates the caching of `JSON` state objects between calls to `BTT`.

The "states" then are arrays of objects that contain information necessary to execute a `BTT` process. Example entry:

```js
{
        BTTTriggerType: -1,
        BTTTriggerTypeDescription: "Please Select a Trigger ",
        BTTTriggerClass: "BTTTriggerTypeOtherTriggers",
        BTTPredefinedActionType: 108,
        BTTPredefinedActionName: "Resize window to Left Third",
        BTTEnabled2: 1,
        BTTAlternateModifierKeys: 0,
        BTTUUID: "5511861E-8666-4566-B7BE-AAD91F2BD108",
        BTTEnabled: 1,
        BTTModifierMode: 0,
        BTTOrder: 1,
        BTTDisplayOrder: 0,
        BTTMergeIntoTouchBarGroups: 0
    }
```

Which can be found be right-clicking on an action within `BTT`, and selecting "copy".

#### `CacheObject`

A wrapper for reading, writing, and manipulating the aforesaid `JSON` object.

#### `advanceState`

Bi-directionally advances an integer state counter (zero-indexed, used for indexing into the aforesaid states array), wrapping around as necessary. For example, if you have 10 states, and are currently at state 9, and then move one step right, the counter will wrap back around to 0.

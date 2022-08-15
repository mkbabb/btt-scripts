'use strict';

var Direction;
(function (Direction) {
    Direction[Direction["LEFT"] = 0] = "LEFT";
    Direction[Direction["RIGHT"] = 1] = "RIGHT";
})(Direction || (Direction = {}));
function writeTextToFile(text, filePath, overwriteExistingContent) {
    var app = Application.currentApplication();
    app.includeStandardAdditions = true;
    var path = Path(filePath.toString());
    try {
        var openedFile = app.openForAccess(path, {
            writePermission: true
        });
        if (overwriteExistingContent) {
            app.setEof(openedFile, { to: 0 });
        }
        app.write(text, { to: openedFile, startingAt: app.getEof(openedFile) });
        app.closeAccess(openedFile);
        return true;
    }
    catch (error) {
        try {
            app.closeAccess(path);
        }
        catch (error) {
            console.log("Couldn't close file: ".concat(error));
        }
        return false;
    }
}
function readFile(filePath) {
    var app = Application.currentApplication();
    app.includeStandardAdditions = true;
    var path = Path(filePath.toString());
    return app.read(path);
}
var CacheObject = /** @class */ (function () {
    function CacheObject(cacheFilePath) {
        this.cacheFilePath = cacheFilePath;
        this.stateObject = JSON.parse(readFile(cacheFilePath));
        this.currentState = undefined;
        return this;
    }
    CacheObject.prototype.getState = function (stateName) {
        this.currentState = this.stateObject[stateName];
        this.stateObject[stateName] = this.currentState;
        return this.currentState;
    };
    CacheObject.prototype.write = function (stateName, stateValue) {
        this.stateObject[stateName] = stateValue;
        return this;
    };
    CacheObject.prototype.save = function () {
        writeTextToFile(JSON.stringify(this.stateObject), this.cacheFilePath, true);
        return this;
    };
    return CacheObject;
}());
var advanceState = function (cacheObject, toggleKey, states, direction) {
    var _a;
    if (direction === void 0) { direction = Direction.LEFT; }
    var btt = Application("BetterTouchTool");
    var currentState = parseInt((_a = cacheObject.getState(toggleKey)) !== null && _a !== void 0 ? _a : "0");
    var newState = (function () {
        switch (direction) {
            case Direction.LEFT:
                return currentState + states.length - 1;
            case Direction.RIGHT:
                return currentState + 1;
        }
    })() % states.length;
    btt.trigger_action(JSON.stringify(states[newState]));
    cacheObject.write(toggleKey, newState.toString()).save();
    return cacheObject;
};

var twoThirdsStates = [
    {
        BTTTriggerType: 0,
        BTTTriggerClass: "BTTTriggerTypeKeyboardShortcut",
        BTTPredefinedActionType: 174,
        BTTPredefinedActionName: "Resize window to Left Two Thirds",
        BTTAdditionalConfiguration: "655426",
        BTTEnabled2: 1,
        BTTKeyboardShortcutKeyboardType: 52292,
        BTTRepeatDelay: 0,
        BTTUUID: "341E5116-C716-46DC-968A-3CFF1CEC2394",
        BTTTriggerOnDown: 1,
        BTTNotesInsteadOfDescription: 0,
        BTTLayoutIndependentChar: "TAB",
        BTTEnabled: 1,
        BTTModifierMode: 0,
        BTTShortcutKeyCode: 48,
        BTTShortcutModifierKeys: 655360,
        BTTOrder: 9,
        BTTDisplayOrder: 0,
        BTTAutoAdaptToKeyboardLayout: 0
    },
    {
        BTTTriggerType: 0,
        BTTTriggerClass: "BTTTriggerTypeKeyboardShortcut",
        BTTPredefinedActionType: 175,
        BTTPredefinedActionName: "Resize window to Right Two Thirds",
        BTTAdditionalConfiguration: "655426",
        BTTEnabled2: 1,
        BTTKeyboardShortcutKeyboardType: 52292,
        BTTRepeatDelay: 0,
        BTTUUID: "341E5116-C716-46DC-968A-3CFF1CEC2394",
        BTTTriggerOnDown: 1,
        BTTNotesInsteadOfDescription: 0,
        BTTLayoutIndependentChar: "TAB",
        BTTEnabled: 1,
        BTTModifierMode: 0,
        BTTShortcutKeyCode: 48,
        BTTShortcutModifierKeys: 655360,
        BTTOrder: 9,
        BTTDisplayOrder: 0,
        BTTAutoAdaptToKeyboardLayout: 0
    }
];

var cacheFilePath = "/tmp/betterTouchTool.json";
var cacheObject = new CacheObject(cacheFilePath);
var twoThirds = function (direction) {
    var toggleKey = "twoThirds";
    advanceState(cacheObject, toggleKey, twoThirdsStates, direction);
};

twoThirds(Direction.RIGHT);
//@ts-ignore
returnToBTT("Done");

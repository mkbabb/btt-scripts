'use strict';

var Direction;
(function (Direction) {
    Direction[Direction["LEFT"] = 0] = "LEFT";
    Direction[Direction["RIGHT"] = 1] = "RIGHT";
})(Direction || (Direction = {}));
function writeTextToFile(text, file, overwriteExistingContent) {
    var app = Application.currentApplication();
    app.includeStandardAdditions = true;
    try {
        var fileString = file.toString();
        var openedFile = app.openForAccess(Path(fileString), {
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
            app.closeAccess(file);
        }
        catch (error) {
            console.log("Couldn't close file: " + error);
        }
        return false;
    }
}
function readFile(file) {
    var app = Application.currentApplication();
    app.includeStandardAdditions = true;
    var fileString = file.toString();
    return app.read(Path(fileString));
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

var oneThirdsStates = [
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
    },
    {
        BTTTriggerType: -1,
        BTTTriggerTypeDescription: "Please Select a Trigger ",
        BTTTriggerClass: "BTTTriggerTypeOtherTriggers",
        BTTPredefinedActionType: 109,
        BTTPredefinedActionName: "Resize window to Middle Third",
        BTTEnabled2: 1,
        BTTAlternateModifierKeys: 0,
        BTTUUID: "D93C495B-09D3-43F7-9D11-9DACF51BA2F4",
        BTTEnabled: 1,
        BTTModifierMode: 0,
        BTTOrder: 2,
        BTTDisplayOrder: 0,
        BTTMergeIntoTouchBarGroups: 0
    },
    {
        BTTTriggerType: -1,
        BTTTriggerTypeDescription: "Please Select a Trigger ",
        BTTTriggerClass: "BTTTriggerTypeOtherTriggers",
        BTTPredefinedActionType: 110,
        BTTPredefinedActionName: "Resize window to Right Third",
        BTTEnabled2: 1,
        BTTAlternateModifierKeys: 0,
        BTTUUID: "020D20AA-5560-4ACE-A1DF-E51A48873BC9",
        BTTEnabled: 1,
        BTTModifierMode: 0,
        BTTOrder: 3,
        BTTDisplayOrder: 0,
        BTTMergeIntoTouchBarGroups: 0
    }
];

var cacheFilePath = "/Users/mkbabb/Library/Application Support/cachedApplicationStates/betterTouchTool.json";
var cacheObject = new CacheObject(cacheFilePath);
var oneThirds = function (direction) {
    var toggleKey = "oneThirds";
    advanceState(cacheObject, toggleKey, oneThirdsStates, direction);
};

oneThirds(Direction.LEFT);

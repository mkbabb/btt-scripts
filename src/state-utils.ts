import {} from "@jxa/global-type";

enum Direction {
    LEFT,
    RIGHT
}

function writeTextToFile(
    text: string,
    filePath: string,
    overwriteExistingContent: boolean
): boolean {
    const app = Application.currentApplication();
    app.includeStandardAdditions = true;
    const path = Path(filePath.toString());

    try {
        const openedFile = app.openForAccess(path, {
            writePermission: true
        });

        if (overwriteExistingContent) {
            app.setEof(openedFile, { to: 0 });
        }

        app.write(text, { to: openedFile, startingAt: app.getEof(openedFile) });
        app.closeAccess(openedFile);

        return true;
    } catch (error) {
        try {
            app.closeAccess(path);
        } catch (error) {
            console.log(`Couldn't close file: ${error}`);
        }
        return false;
    }
}

function readFile(filePath: string): string {
    const app = Application.currentApplication();
    app.includeStandardAdditions = true;
    const path = Path(filePath.toString());

    return app.read(path);
}

class CacheObject {
    cacheFilePath: string;
    stateObject: Object;
    currentState: string;

    constructor(cacheFilePath: string) {
        this.cacheFilePath = cacheFilePath;
        this.stateObject = JSON.parse(readFile(cacheFilePath));
        this.currentState = undefined;

        return this;
    }

    getState(stateName: string) {
        this.currentState = this.stateObject[stateName];
        this.stateObject[stateName] = this.currentState;

        return this.currentState;
    }

    write(stateName: string, stateValue: any) {
        this.stateObject[stateName] = stateValue;
        return this;
    }

    save() {
        writeTextToFile(JSON.stringify(this.stateObject), this.cacheFilePath, true);
        return this;
    }
}

const advanceState = function (
    cacheObject: CacheObject,
    toggleKey: string,
    states: Array<Object>,
    direction: Direction = Direction.LEFT
) {
    const btt = Application("BetterTouchTool");

    const currentState = parseInt(cacheObject.getState(toggleKey) ?? "0");

    const newState =
        (() => {
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

export { CacheObject, advanceState, Direction };

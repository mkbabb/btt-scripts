import { CacheObject, advanceState, Direction } from "../state-utils";
import { oneThirdsStates, twoThirdsStates } from "./states";

const cacheFilePath =
    "/Users/mkbabb/Library/Application Support/cachedApplicationStates/betterTouchTool.json";
const cacheObject = new CacheObject(cacheFilePath);

const oneThirds = (direction: Direction) => {
    const toggleKey = "oneThirds";
    advanceState(cacheObject, toggleKey, oneThirdsStates, direction);
};

const twoThirds = (direction: Direction) => {
    const toggleKey = "twoThirds";
    advanceState(cacheObject, toggleKey, twoThirdsStates, direction);
};

export { oneThirds, twoThirds };

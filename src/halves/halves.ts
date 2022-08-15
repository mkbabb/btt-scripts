import { CacheObject, advanceState, Direction } from "../state-utils";
import { halvesStates } from "./states";

const cacheFilePath = "/tmp/betterTouchTool.json";
const cacheObject = new CacheObject(cacheFilePath);

const halves = (direction: Direction) => {
    const toggleKey = "halves";
    advanceState(cacheObject, toggleKey, halvesStates, direction);
};

export { halves };

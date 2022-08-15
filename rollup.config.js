// import pkg from "./package.json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript";
import path from "path";

const plugins = [nodeResolve(), typescript()];

const genBaseConfig = (inputPath) => {
    const p = path.parse(inputPath);

    return {
        input: path.join("src", inputPath),
        output: {
            file: path.join("out", path.join(p.dir, `${p.name}.js`)),
            format: "cjs"
        },
        plugins: plugins
    };
};

const files = {
    thirds: ["one/left.ts", "one/right.ts", "two/left.ts", "two/right.ts"],
    halves: ["left.ts", "right.ts"],
};

export default Object.entries(files).reduce((acc, [module, paths]) => {
    const configs = paths.map((p) => {
        return genBaseConfig(path.join(module, p));
    });
    return acc.concat(configs);
}, []);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import * as configYml from "config-yml";

import githubProvider from "./provider/github/github.js";
import sourceforgeProvider from "./provider/sourceforge/sourceforge.js";

export const config = configYml.load("config.yml");

// test code

const t1 = await githubProvider({
	owner: "microsoft",
	repo: "PowerToys",
	resType: "release",
	newerThan: new Date("2021-09-01")
});

const t2 = await sourceforgeProvider({
	project: "codeblocks",
	resType: "tree"
});

console.log(t1, t2);

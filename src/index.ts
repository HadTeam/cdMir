// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import * as configYml from "config-yml";

import githubProvider from "./provider/github/github.js";
import sourceforgeProvider from "./provider/sourceforge/sourceforge.js";
import fosshubProvider from "./provider/fosshub/fosshub.js";

export const config = configYml.load("config.yml");

// test code

const t1 = await githubProvider({
	owner: "microsoft",
	repo: "PowerToys",
	resType: "release",
	newerThan: new Date("2021-09-01")
});

console.log(t1);

const t2 = await sourceforgeProvider({
	project: "codeblocks",
	resType: "tree"
});

console.log(t2);

const t3 = await fosshubProvider({
	project: "Code-Blocks",
	versionNewerThan: "20.03"
});

console.log(t3);
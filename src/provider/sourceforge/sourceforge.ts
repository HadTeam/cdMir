import req from "../req.js";
import * as cheerio from "cheerio";
import { config } from "../../index.js";

/**
 * Sourceforge Provider
 * @param {SourceforgeProviderParams} params
 * */
type SourceforgeProviderParams = {
	project: string;
	resType: string; // resource type, could be "tree"
	path?: string; // path, need to fill when `resType = tree`, default is "/"
	newerThan?: Date; // select release time, could be to fill when `resType = release`
}

export default async (params: SourceforgeProviderParams): Promise<DownloadParam[]> => {
	switch(params.resType) {
		case "tree": {
			if(params.path === undefined) params.path = "/";
			const { project, path, newerThan } = params;
			return fetchTree(`https://sourceforge.net/projects/${ project }/files${ path }`, newerThan);
		}
		default:
			throw new Error("Invalid resource type");
	}
};

const fetchTree = async (url: string, newerThan: Date | undefined): Promise<DownloadParam[]> => {
	const ret: DownloadParam[] = [];
	const res = await req({ url: url, method: "GET", siteMaxConn: config.sourceforge.maxConn });

	const hash = new Map<string, HashValue>();

	// Get hash info from the json data
	const start = "net.sf.files = ", end = ";\nnet.sf.staging_days =";
	const data = res.data.substring(res.data.indexOf(start) + start.length, res.data.indexOf(end));
	const json = JSON.parse(data);
	for(const i in json) {
		const e = json[i];
		if(e.type === "f" && e.downloadable === true) { // file
			hash.set(e.name, {
				md5: e.md5,
				sha1: e.sha1,
			});
		}
	}

	// Use cheerio to parse html, syntax the info from html table element

	const $ = cheerio.load(res.data);
	const list = $('table#files_list tbody tr');
	for(const i of list) {
		const e = $(i);
		if(newerThan !== undefined) {
			const time = new Date(`${ e.find("td[headers=files_date_h] abbr").attr("title") }`);
			if(time <= newerThan) continue;
		}

		if(e.hasClass("folder")) {
			const url = `https://sourceforge.net${ e.find("th[headers=files_name_h] a").attr("href") }`;
			fetchTree(url, newerThan).then(r => ret.push(...r));
		} else if(e.hasClass("file")) {
			const originalUrl = e.find("th[headers=files_name_h] a").attr("href");
			if(originalUrl === undefined) continue;
			let path = (new URL(originalUrl)).pathname;
			

			// like "/projects/codeblocks/files/readme/download" to "/project/codeblocks/readme/"
			path = path.replace(/^\/projects\//, "/project/");
			path = path.replace(/\/files\//, "/");
			path = path.replace(/\/download$/, "");

			const downloadUrl = `https://downloads.sourceforge.net${ path }`;
			ret.push({
				url: downloadUrl,
				filename: e.find("th a span").text(),
				referrer: url,
				hash: hash.get(e.find("th a span").text()),
			});
		}
	}

	hash.clear();
	return ret;
};
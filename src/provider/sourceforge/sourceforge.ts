import req from "../req.js";
import * as cheerio from "cheerio";

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
}

const fetchTree = async (url: string, newerThan: Date | undefined): Promise<DownloadParam[]> => {
	let ret: DownloadParam[] = [];
	let res = await req({ url: url, method: "GET", siteMaxConn: 15 });

	let hash = new Map<string, HashValue>();

	// Get hash info from the json data
	const start = "net.sf.files = ", end = ";\nnet.sf.staging_days =";
	let data = res.data.substring(res.data.indexOf(start) + start.length, res.data.indexOf(end));
	let json = JSON.parse(data);
	for(let i in json) {
		let e = json[i];
		if(e.type === "f" && e.downloadable) { // file
			hash.set(e.name, {
				md5: e.md5,
				sha1: e.sha1,
			});
		}
	}

	// Use cheerio to parse html, syntax the info from html table element

	const $ = cheerio.load(res.data);
	let list = $('table#files_list tbody tr');
	for(let i of list) {
		let e = $(i);
		if(newerThan !== undefined) {
			let time = new Date(`${ e.find("td[headers=files_date_h] abbr").attr("title") }`);
			if(time <= newerThan) continue;
		}

		if(e.hasClass("folder")) {
			let url = `https://sourceforge.net${ e.find("th[headers=files_name_h] a").attr("href") }`;
			fetchTree(url, newerThan).then(r => ret.push(...r));
		} else if(e.hasClass("file")) {
			ret.push({
				url: `${ e.find("th a").attr("href") }`,
				filename: e.find("th a span").text(),
				referrer: url,
				hash: hash.get(e.find("th a span").text()),
			});
		}
	}

	hash.clear();
	return ret;
}
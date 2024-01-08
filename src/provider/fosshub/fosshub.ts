import req from "../req.js";
import * as cheerio from "cheerio";
// import { config } from "../../index.js";
import * as axios from "axios";

/**
 * Fosshub Provider
 * @param {FosshubProviderParams} params
 * */
type FosshubProviderParams = {
	project: string;
	versionNewerThan?: string;
}

type FosshubDownloadApiPayload = {
	projectId: string;
	releaseId: string;
	projectUri: string;
	fileName: string;
	source: string;
}

export default async (params: FosshubProviderParams): Promise<DownloadParam[]> => {
	const { project, versionNewerThan } = params;
	const headers: axios.RawAxiosRequestHeaders = {
		"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
	};
	const res = await req({
		url: `https://www.fosshub.com/${ project }-old.html`,
		method: "GET",
		headers: headers,
	});
	const resNew = await req({
		url: `https://www.fosshub.com/${ project }.html`,
		method: "GET",
		headers: headers,
	});

	const hash = new Map<string, HashValue>();
	const releaseId = new Map<string, string>();

	const settingStr = res.data.match(`var settings =\{.*\}`)?.[0];
	if(settingStr === undefined) throw new Error("Can't find settings");
	const settings = JSON.parse(settingStr.replace("var settings =", ""));
	for(const file of settings.pool.f) {
		hash.set(file.n, {
			md5: file.hash.md5,
			sha1: file.hash.sha1,
			sha256: file.hash.sha256,
		});
		releaseId.set(file.n, file.r);
	}

	const ret: DownloadParam[] = [];

	const parseList = async (data: any) => {
		const $ = cheerio.load(data);
		const list = $('ul#fh-ssd__l-d li div dl');
		for(const i of list) {
			const properties = $(i).find("dd");
			if(versionNewerThan !== undefined) {
				if($(properties[2]).text() < versionNewerThan) continue;
			}

			const name = $(properties[0]).children("a").attr("data-file");
			if(name === undefined) continue;
			const rId = releaseId.get(name);
			const h = hash.get(name);
			if(rId === undefined || h === undefined) continue;

			const payload: FosshubDownloadApiPayload = {
				projectId: settings.projectId,
				releaseId: rId,
				projectUri: `${ project }-old.html`,
				fileName: name,
				source: "CF",
			};
			const apiRes = await req({
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json",
				},
				url: "https://api.fosshub.com/download/",
				data: payload,
			});
			if(apiRes.data.error !== null) throw new Error(apiRes.data.error);

			ret.push({
				url: apiRes.data.data.url,
				filename: name,
				hash: h,
			});
		}
	};

	await parseList(res.data);
	await parseList(resNew.data);
	return ret;
};

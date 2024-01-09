import req from "../req.js";
import { config } from "../../index.js";
import * as axios from "axios";

/**
 * GitHub Provider
 * @param {GithubProviderParams} params
 * */
type GithubProviderParams = {
	owner: string;
	repo: string;
	resType: string; // resource type,  could be "file" | "release"
	branch?: string; // branch, need to fill when `resType = file`
	newerThan?: Date; // select release time, could be to fill when `resType = release`
}

export default async (params: GithubProviderParams): Promise<DownloadParam[]> => {
	switch(params.resType) {
		case "release":
			const { owner, repo, newerThan } = params;
			const headers: axios.RawAxiosRequestHeaders = {};
			headers["Accept"]="application/vnd.github.v3+json";
			headers["X-GitHub-Api-Version"]="2022-11-28";
			if(config.github.token !== undefined) {
				headers["Authorization"] = `token ${ config.github.token }`;
			}
			const res = await req({
				url: `https://api.github.com/repos/${ owner }/${ repo }/releases`,
				method: "GET",
				headers: headers,
			});
			let endFlag = false;
			const ret: DownloadParam[] = [];
			for(const release of await res.data) {
				for(const asset of release.assets) {
					if(newerThan !== undefined) {
						const time = new Date(asset.updated_at);
						if(time <= newerThan) endFlag = true;
					}
					ret.push({
						url: asset.browser_download_url,
						filename: asset.name,
						referrer: asset.url,
					});
				}
				if(endFlag) break;
			}
			return ret;
		case "file":
		default:
			throw new Error("Invalid resource type");
	}
};
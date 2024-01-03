import * as axios from "axios";

interface config extends axios.AxiosRequestConfig {
	siteMaxConn?: number;
}

const genReqFunc = (maxConn: number): ReqFunction => {
	let conn = 0;
	let queue: Function[] = [];

	const next = () => {
		if(conn < maxConn && queue.length > 0) {
			let res = queue.shift();
			if(res !== undefined) {
				res();
			}
		}
	}

	const wait = async () => {
		return new Promise((resolve) => {
			queue.push(resolve);
		})
	}

	return async (config: config): Promise<axios.AxiosResponse> => {
		return new Promise(async (resolve, reject) => {
			if(conn > maxConn) {
				await wait();
			}
			conn++;
			try {
				// console.log(`[req] ${ config.url }, conn: ${ conn }`);
				const res = await axios.default.request(config);
				resolve(res);
			} catch(err) {
				reject(err);
			} finally {
				conn--;
				next();
			}
		});
	};
}

type ReqFunction = (config: config) => Promise<axios.AxiosResponse>;
let sites = new Map<string, ReqFunction>();

const req = genReqFunc(150);

export default (config: config): Promise<axios.AxiosResponse> => {
	if(config.siteMaxConn !== undefined && config.url !== undefined) {
		let siteName = new URL(config.url).host;
		let site = sites.get(siteName);
		if(site === undefined) {
			site = genReqFunc(config.siteMaxConn);
			sites.set(siteName, site);
		}
		return site(config);
	}
	return req(config);
}

//
// const maxConn = 150;
// let conn = 0;
// let queue: Function[] = [];
//
// const next = () => {
// 	if (conn < maxConn && queue.length > 0) {
// 		let res = queue.shift();
// 		if(res !== undefined) {
// 			res();
// 		}
// 	}
// }
//
// const wait = async () => {
// 	return new Promise((resolve) => {
// 		queue.push(resolve);
// 	})
// }
//
// export default async (config: config): Promise<axios.AxiosResponse> => {
// 	return new Promise(async (resolve, reject) => {
// 		if(conn > maxConn) {
// 			await wait();
// 		}
// 		conn++;
// 		try {
// 			const res = await axios.default.request(config);
// 			resolve(res);
// 		} catch (err) {
// 			reject(err);
// 		} finally {
// 			conn--;
// 			next();
// 		}
// 	});
// }

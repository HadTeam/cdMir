export {};

declare global {
	interface HashValue {
		md5?: string;
		sha1?: string;
		sha256?: string;
	}

	interface DownloadParam {
		url: string;
		filename: string;
		headers?: string[];
		cookies?: string[];
		referrer?: string;
		userAgent?: string;
		hash?: HashValue;
	}

	interface Aria2Params {

	}
}
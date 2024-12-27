export interface FileSource {
  filename: string;
  url: string;
}

export interface FileHash {
  md5?: string;
  sha1?: string;
  sha256?: string;
}

export interface FileTags {
  source: string;
  id: string;
  filetype: string;
  hash?: FileHash;
}

export interface File {
  filename: string;
  url: string;
  urlType: "directly" | "multiple";
  tags: FileTags;
  index?: number;
}

export interface Software {
  name: string;
  website: string;
  description: string;
  filesId: string[];
  recommend: boolean;
  slug: string;
  sources: {
    [key: string]: FileSource[];
  };
}

export interface Contributor {
  header: string;
  href: string;
  as: string;
  image: string;
  meta: string;
  description: string;
}

export interface FAQ {
  key: string;
  title: string;
  content: string;
}

export interface Link {
  text: string;
  href: string;
  as: string;
  target: string;
}

export interface BuildInfo {
  commitId: string;
  time: string;
}

export interface SearchState {
  loading: boolean;
  searchResults: SearchResult[];
  value: string;
}

export interface SearchResult {
  title: string;
  description: string;
  id: string;
  page: number;
}

export interface HomeModalState {
  open: boolean;
  download: {
    [key: string]: FileSource[];
  };
}

export interface DonateInfo {
  header: string;
  as: string;
  image: string;
  meta: string;
}
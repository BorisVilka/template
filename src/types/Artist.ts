export interface Artist {
  name: string;
  listeners: string;
  mbid: string;
  url: string;
  streamable: string;
  image: { '#text': string; size: string }[];
}
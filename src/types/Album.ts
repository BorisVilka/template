export interface Album {
  name: string;
  artist: string;
  listeners: string;
  mbid: string;
  url: string;
  streamable: string;
  image: { '#text': string; size: string }[];
}
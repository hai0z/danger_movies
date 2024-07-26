export interface MovieDetailResult {
  code: number;
  msg: string;
  page: number;
  pagecount: number;
  limit: string;
  total: number;
  list: List[];
}

export interface List {
  type_name: string;
  episodes: Episodes;
  id: number;
  name: string;
  slug: string;
  origin_name: string;
  tag: string;
  category: string[];
  poster_url: string;
  thumb_url: string;
  actor: string[];
  director: string[];
  description: string;
  movie_code: string;
  created_at: string;
  country: string[];
  year: string;
  quality: string;
  status: string;
  time: string;
}

interface Episodes {
  server_name: string;
  server_data: Serverdata;
}

interface Serverdata {
  Full: Full;
}

interface Full {
  slug: string;
  link_embed: string;
}

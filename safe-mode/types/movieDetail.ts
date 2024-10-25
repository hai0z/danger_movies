export interface MovieDetailResult {
  status: string;
  movie: Movie;
}

export interface Movie {
  id: string;
  name: string;
  slug: string;
  original_name: string;
  thumb_url: string;
  poster_url: string;
  created: string;
  modified: string;
  description: string;
  total_episodes: number;
  current_episode: string;
  time: string;
  quality: string;
  language: string;
  director: string;
  casts: string;
  category: Category;
  episodes: Episode[];
}

interface Episode {
  server_name: string;
  items: Item[];
}

interface Item {
  name: string;
  slug: string;
  embed: string;
  m3u8: string;
}

interface Category {
  "1": _1;
  "2": _1;
  "3": _1;
  "4": _1;
}

interface _1 {
  group: Group;
  list: Group[];
}

interface Group {
  id: string;
  name: string;
}

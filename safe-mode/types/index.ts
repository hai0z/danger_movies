export interface HomeResult {
  status: string;
  paginate: Paginate;
  items: Item[];
}

export interface Item {
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
  time: null | string;
  quality: string;
  language: string;
  director: null | string;
  casts: null | string;
}

interface Paginate {
  current_page: number;
  total_page: number;
  total_items: number;
  items_per_page: number;
}

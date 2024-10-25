interface MovieDetailRespone {
  status: boolean;
  msg: string;
  movie: Movie;
}

interface Movie {
  id: string;
  name: string;
  slug: string;
  content: string;
  type: string;
  status: string;
  thumb_url: string;
  time: string;
  quality: string;
  lang: null;
  actors: any[];
  categories: Category[];
  country: Category;
  episodes: Episode[];
}

interface Episode {
  server_name: string;
  server_data: Serverdatum[];
}

interface Serverdatum {
  name: string;
  slug: string;
  link: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}
interface ListMovieResponse {
  status: boolean;
  msg: string;
  movies: Movie[];
  page: Page;
}

interface Page {
  current_page: number;
  from: number;
  to: number;
  total: number;
  per_page: number;
  last_page: number;
}

interface Episode {
  server_name: string;
  server_data: Serverdatum[];
}

interface Serverdatum {
  name: string;
  slug: string;
  link: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export { MovieDetailRespone, Movie, ListMovieResponse };

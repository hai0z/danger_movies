import {ListMovieResponse, MovieDetailRespone} from "./MovieType";

export enum MOVIE_CATEGORY {
  "viet-nam-clip" = "viet-nam-clip",
  "chau-au" = "chau-au",
  "trung-quoc" = "trung-quoc",
  "han-quoc-18-" = "han-quoc-18-",
  "khong-che" = "khong-che",
  "jav-hd" = "jav-hd",
  "vietsub" = "vietsub",
}

class ApiService {
  private static readonly BASE_URL: string =
    "https://xxvnapi.com/api/" as const;

  public static async getMoiveDetail(
    slug: string
  ): Promise<MovieDetailRespone> {
    const response = await fetch(`${this.BASE_URL}phim/${slug}`);
    return await response.json();
  }

  public static async getNewMovies(page = 1): Promise<ListMovieResponse> {
    const response = await fetch(
      `${this.BASE_URL}phim-moi-cap-nhat?page=${page}`
    );
    return await response.json();
  }
  public static async getByCategory(
    Category: MOVIE_CATEGORY,
    page = 1
  ): Promise<ListMovieResponse> {
    const response = await fetch(
      `${this.BASE_URL}chuyen-muc/${Category}?page=${page}`
    );
    return await response.json();
  }
}

export default ApiService;

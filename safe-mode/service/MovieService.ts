import api from "../api";
import { HomeResult } from "../types";

export enum Category {
  phim_le,
  phim_bo,
  hoat_hinh,
  the_loai,
  quoc_gia,
  year,
}
enum MovieGenre {
  "hanh-dong" = "hanh-dong",
  "phieu-luu" = "phieu-luu",
  "hoat-hinh" = "hoat-hinh",
  "phim-hai" = "phim-hai",
  "hinh-su" = "hinh-su",
  "tai-lieu" = "tai-lieu",
  "chinh-kich" = "chinh-kich",
  "gia-dinh" = "gia-dinh",
  "gia-tuong" = "gia-tuong",
  "lich-su" = "lich-su",
  "kinh-di" = "kinh-di",
  "phim-nhac" = "phim-nhac",
  "bi-an" = "bi-an",
  "lang-man" = "lang-man",
  "khoa-hoc-vien-tuong" = "khoa-hoc-vien-tuong",
  "gay-can" = "gay-can",
  "chien-tranh" = "chien-tranh",
  "tam-ly" = "tam-ly",
  "tinh-cam" = "tinh-cam",
  "co-trang" = "co-trang",
  "mien-tay" = "mien-tay",
  "phim-18" = "phim-18",
}

export const movieGenres = [
  { id: MovieGenre["hanh-dong"], name: "Hành Động" },
  { id: MovieGenre["phieu-luu"], name: "Phiêu Lưu" },
  { id: MovieGenre["hoat-hinh"], name: "Hoạt Hình" },
  { id: MovieGenre["phim-hai"], name: "Hài" },
  { id: MovieGenre["hinh-su"], name: "Hình Sự" },
  { id: MovieGenre["tai-lieu"], name: "Tài Liệu" },
  { id: MovieGenre["chinh-kich"], name: "Chính Kịch" },
  { id: MovieGenre["gia-dinh"], name: "Gia Đình" },
  { id: MovieGenre["gia-tuong"], name: "Giả Tưởng" },
  { id: MovieGenre["lich-su"], name: "Lịch Sử" },
  { id: MovieGenre["kinh-di"], name: "Kinh Dị" },
  { id: MovieGenre["phim-nhac"], name: "Nhạc" },
  { id: MovieGenre["bi-an"], name: "Bí Ẩn" },
  { id: MovieGenre["lang-man"], name: "Lãng Mạn" },
  { id: MovieGenre["khoa-hoc-vien-tuong"], name: "Khoa Học Viễn Tưởng" },
  { id: MovieGenre["gay-can"], name: "Gây Cấn" },
  { id: MovieGenre["chien-tranh"], name: "Chiến Tranh" },
  { id: MovieGenre["tam-ly"], name: "Tâm Lý" },
  { id: MovieGenre["tinh-cam"], name: "Tình Cảm" },
  { id: MovieGenre["co-trang"], name: "Cổ Trang" },
  { id: MovieGenre["mien-tay"], name: "Miền Tây" },
  { id: MovieGenre["phim-18"], name: "Phim 18+" },
];

enum Country {
  "au-my" = "au-my",
  "anh" = "anh",
  "trung-quoc" = "trung-quoc",
  "indonesia" = "indonesia",
  "viet-nam" = "viet-nam",
  "phap" = "phap",
  "hong-kong" = "hong-kong",
  "han-quoc" = "han-quoc",
  "nhat-ban" = "nhat-ban",
  "thai-lan" = "thai-lan",
  "dai-loan" = "dai-loan",
  "nga" = "nga",
  "ha-lan" = "ha-lan",
  "philippines" = "philippines",
  "an-do" = "an-do",
  "quoc-gia-khac" = "quoc-gia-khac",
}

export const years = [
  { id: "2004", name: "2004" },
  { id: "2005", name: "2005" },
  { id: "2006", name: "2006" },
  { id: "2007", name: "2007" },
  { id: "2008", name: "2008" },
  { id: "2009", name: "2009" },
  { id: "2010", name: "2010" },
  { id: "2011", name: "2011" },
  { id: "2012", name: "2012" },
  { id: "2013", name: "2013" },
  { id: "2014", name: "2014" },
  { id: "2015", name: "2015" },
  { id: "2016", name: "2016" },
  { id: "2017", name: "2017" },
  { id: "2018", name: "2018" },
  { id: "2019", name: "2019" },
  { id: "2020", name: "2020" },
  { id: "2021", name: "2021" },
  { id: "2022", name: "2022" },
  { id: "2023", name: "2023" },
  { id: "2024", name: "2024" },
];

export const countries = [
  { id: Country["au-my"], name: "Âu Mỹ" },
  { id: Country["anh"], name: "Anh" },
  { id: Country["trung-quoc"], name: "Trung Quốc" },
  { id: Country["indonesia"], name: "Indonesia" },
  { id: Country["viet-nam"], name: "Việt Nam" },
  { id: Country["phap"], name: "Pháp" },
  { id: Country["hong-kong"], name: "Hồng Kông" },
  { id: Country["han-quoc"], name: "Hàn Quốc" },
  { id: Country["nhat-ban"], name: "Nhật Bản" },
  { id: Country["thai-lan"], name: "Thái Lan" },
  { id: Country["dai-loan"], name: "Đài Loan" },
  { id: Country["nga"], name: "Nga" },
  { id: Country["ha-lan"], name: "Hà Lan" },
  { id: Country["philippines"], name: "Philippines" },
  { id: Country["an-do"], name: "Ấn Độ" },
  { id: Country["quoc-gia-khac"], name: "Quốc gia khác" },
];

class MovieService {
  private getRandomParam = () => `&_=${new Date().getTime()}`;

  public getAll = async (page = 1) => {
    const response = await api.get<HomeResult>(
      `/films/phim-moi-cap-nhat?page=${page}${this.getRandomParam()}`
    );
    return response.data;
  };

  public getMovieDetail = async (slug: string) => {
    const response = await api.get(`/film/${slug}`);
    return response.data;
  };

  public search = async (keyword: string, page: number) => {
    const response = await api.get(
      `films/search?keyword=${keyword} &page=${page}`
    );
    return response.data;
  };

  public getByCategory = async (
    category: Category,
    page = 1,
    slug?: string
  ) => {
    switch (category) {
      case Category.phim_le: {
        const response = await api.get<HomeResult>(
          `films/danh-sach/phim-le?page=${page}${this.getRandomParam()}`
        );
        return response.data;
      }
      case Category.phim_bo: {
        const response = await api.get<HomeResult>(
          `films/danh-sach/phim-bo?page=${page}${this.getRandomParam()}`
        );
        return response.data;
      }
      case Category.hoat_hinh: {
        const response = await api.get<HomeResult>(
          `films/danh-sach/hoat-hinh?page=${page}${this.getRandomParam()}`
        );
        return response.data;
      }
      case Category.the_loai: {
        const response = await api.get<HomeResult>(
          `/films/the-loai/${slug}?page=${page}${this.getRandomParam()}`
        );
        return response.data;
      }
      case Category.quoc_gia: {
        const response = await api.get<HomeResult>(
          `films/quoc-gia/${slug}?page=${page}&limit=64${this.getRandomParam()}`
        );
        return response.data;
      }
      case Category.year: {
        const response = await api.get<HomeResult>(
          `films/nam-phat-hanh/${slug}?page=${page}&limit=64${this.getRandomParam()}`
        );
        return response.data;
      }
    }
  };
  public getRandomVideo = async () => {
    const page = Math.floor(Math.random() * 2715) + 1;
    const response = await api.get<HomeResult>(
      `films/phim-moi-cap-nhat?page=${page}${this.getRandomParam()}`
    );
    return response.data;
  };
}

const m = new MovieService();
export default m;

export interface SearchResult {
  status: string;
  msg: string;
  data: Data;
}

interface Data {
  seoOnPage: SeoOnPage;
  breadCrumb: BreadCrumb[];
  titlePage: string;
  items: Item[];
  params: Params;
  type_list: string;
  APP_DOMAIN_FRONTEND: string;
  APP_DOMAIN_CDN_IMAGE: string;
}

interface Params {
  type_slug: string;
  keyword: string;
  filterCategory: string[];
  filterCountry: string[];
  filterYear: string;
  filterType: string;
  sortField: string;
  sortType: string;
  pagination: Pagination;
}

interface Pagination {
  totalItems: number;
  totalItemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

interface Item {
  modified: Modified;
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  type: string;
  poster_url: string;
  thumb_url: string;
  sub_docquyen: boolean;
  chieurap: boolean;
  time: string;
  episode_current: string;
  quality: string;
  lang: string;
  year: number;
  category: Category[];
  country: Category[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Modified {
  time: string;
}

interface BreadCrumb {
  name: string;
  isCurrent: boolean;
  position: number;
}

interface SeoOnPage {
  og_type: string;
  titleHead: string;
  descriptionHead: string;
  og_image: string[];
  og_url: string;
}

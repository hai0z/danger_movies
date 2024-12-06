import axios from "axios"

const BASE_URL2 = "https://phim.nguonc.com/api/"
const api = axios.create({
  baseURL: BASE_URL2,
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
  },
})

export default api

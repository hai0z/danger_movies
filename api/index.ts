import axios from "axios";

const api = axios.create({
  baseURL: " https://avdbapi.com/api.php/",
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
  },
});

export default api;

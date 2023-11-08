import axios from "axios";

const BaseP2pApi = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

export default BaseP2pApi;

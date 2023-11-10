import axios from "axios";

const BaseServerApi = axios.create({
  baseURL: "http://192.168.1.9:5000",
  // baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const baseURL = "http://localhost:5000";

export default BaseServerApi;

import axios from "axios";

const BaseServerApi = axios.create({
<<<<<<< HEAD
  // baseURL: "http://172.16.1.156:5000",
  baseURL: "http://10.230.173.226:5000",
  // baseURL: "http://localhost:5000",
=======
  baseURL: "http://172.16.1.100:5000",
>>>>>>> 3206ba54b0bbb72f811502f4255349376e532aa8
  headers: {
    "Content-Type": "application/json",
  },
});

export const baseURL = "http://localhost:5000";

export default BaseServerApi;

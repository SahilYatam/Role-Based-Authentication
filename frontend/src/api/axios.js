import Axios from "axios";

const axios = Axios.create({
    baseURL: "https://role-based-authentication-lftj.onrender.com/api/v1",
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve();
    });
    failedQueue = [];
};

// 🔥 Centralized logout handler
const redirectToLogin = () => {
    window.history.pushState({}, "", "/login");
    window.dispatchEvent(new PopStateEvent("popstate"));
};

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        const isAuthRoute =
            originalRequest.url.includes("/auth") ||
            originalRequest.url.includes("/session/refresh-accessToken");

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !isAuthRoute
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => axios(originalRequest))
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await axios.post("/session/refresh-accessToken");

                processQueue(null);
                isRefreshing = false;

                return axios(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError);
                isRefreshing = false;

                // 🔥 Clean SPA-safe redirect
                redirectToLogin();

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axios;
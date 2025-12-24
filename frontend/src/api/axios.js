import Axios from "axios";

const axios = Axios.create({
    baseURL: "https://role-based-authentication-lftj.onrender.com/api/v1",
    withCredentials: true
});

let isRefreshing = false
let failedQueue = []

// eslint-disable-next-line no-unused-vars
const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if(error){
            prom.reject(error)
        } else {
            prom.resolve(error)
        }
    })

    failedQueue = []
}

// Response interceptor to handle token refresh
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if(error.response?.status === 401 && !originalRequest._retry){
            if(isRefreshing){
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({resolve, reject});
                })

                    .then(() => {
                        return axios(originalRequest);
                    })
                    .catch(err => {
                        return Promise.reject(err);
                    })
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Call refresh token endpoint
                await axios.post("/session/refresh-accessToken", {}, 
                    {withCredentials: true}
                );

                processQueue(null);
                isRefreshing = false;

                // Retry the original request
                return axios(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                isRefreshing = false

                // Redirect to login if refresh fails
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }

        }

        return Promise.reject(error)
    }
)

export default axios;
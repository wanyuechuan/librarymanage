import axios from "axios";
import router from "@/router";
import Cookies from "js-cookie";
const request = axios.create({
    baseURL: "http://localhost:9999/api",
    timeout: 20000
})


request.interceptors.request.use(config => {
    config.headers['Content-Type'] = "application/json;charset=utf-8";
    
    const adminJson = Cookies.get("admin"); 

    if(adminJson){
        // 设置token
        config.headers['token'] = JSON.parse(adminJson).token;
    }

    return config;
}, error => {
    return Promise.reject(error);
})


//response 拦截器

request.interceptors.response.use(response => {
        let res = response.data;
        if (typeof res === "string") {
            res = res ? JSON.parse(res) : res;
        }
        if(res.code === "401"){
            router.push("/login");
        }


        return res;
    },
    error => {
        console.log("err" + error);
        return Promise.reject(error);
    })


export default request;
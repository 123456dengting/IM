
import axios from "axios";
import qs from "qs";
import {caches} from "./common"


const Axios = axios.create({
  baseURL: "/",
  timeout: 6000,
  responseType: "json"
  // withCredentials: true, // 是否允许带cookie这些
});

let get = Axios.get,
  post = Axios.post,
  put = Axios.put,
  dele = Axios.delete;

//请求拦截
Axios.interceptors.request.use(
  config => {
    let Authorization = caches.get("Authorization");
    if (Authorization) {
      config.headers.Authorization = `Bearer ${Authorization}`
    }
    //POST请求的时候把需要的头部放在headerParam里面
    if (config.headerParam) {
      let param = config.headerParam;
      if (param instanceof Object) {
        Object.keys(param).forEach(key => {
          config.headers[key] = param[key]
        })
      }
    }
    return config;
  },

  error => {
    return Promise.reject(error);
  }
);

//响应拦截
Axios.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = "错误请求";
          break;
        case 401:
          error.message = "未授权，请重新登录";
          break;
        case 403:
          error.message = "拒绝访问";
          break;
        case 404:
          error.message = "请求错误,未找到该资源";
          break;
        case 405:
          error.message = "请求方法未允许";
          break;
        case 408:
          error.message = "请求超时";
          break;
        case 500:
          error.message = "服务器端出错";
          break;
        case 501:
          error.message = "网络未实现";
          break;
        case 502:
          error.message = "网络错误";
          break;
        case 503:
          error.message = "服务不可用";
          break;
        case 504:
          error.message = "网络超时";
          break;
        case 505:
          error.message = "http版本不支持该请求";
          break;
        default:
          error.message = `连接错误${error.response.status}`;
      }
    } else {
      error.message = "连接服务器失败";
    }
    return Promise.reject(error);
  }
);

/**
 * 对原方法的get做一层装饰
 * @param {*} args 参数 url data
 */
Axios.get = (...args) => {
  let url = args[0];
  let param = args[1];

  //参数中包含数组序列化方式
  args[1] = {
    params:  param,
    paramsSerializer: function(param){
      return qs.stringify(param, {arrayFormat: 'repeat',allowDots: true})
    }
  };
  return get(...args);
};

/**
 *
 * @param {*} args 参数 url data config
 */
Axios.post = (...args) => {
  return post(...args);
};

Axios.put = (...args) => {
  return put(...args);
};

Axios.delete = (...args) => {
  return dele(...args);
};

export default Axios;

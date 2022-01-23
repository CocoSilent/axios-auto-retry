import axios, {AxiosResponse} from 'axios';
import axiosAutoRetry from "axios-auto-retry";

const instance = axios.create({
    xsrfCookieName: 'xsrf-token',
    xsrfHeaderName: 'xsrf-token',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
});

axiosAutoRetry(instance,{
    // 最多重试次数
    retryCount: 3,
    // 请求成功的重试条件  即interceptors.response进入onFulfilled, 返回true则重试
    retryConditionFulfilled: (response: AxiosResponse)=> {
        console.log(response);
        return false
    },
    // 请求失败的重试条件  即interceptors.onRejected, 返回true则重试
    retryConditionRejected: (error: any)=> {
        console.log(error);
        return false;
    },
    // 重试延迟时间 ms
    retryDelay: (count: number) => 3,
});
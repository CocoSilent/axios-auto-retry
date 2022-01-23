import axios, {AxiosResponse} from 'axios';
import axiosAutoRetry from "axios-auto-retry";

const instance = axios.create({
    xsrfCookieName: 'xsrf-token',
    xsrfHeaderName: 'xsrf-token',
    headers: {'X-Requested-With': 'XMLHttpRequest'},
});

//第一个参数传入axios或instance均可，但是axiosAutoRetry一定要写在添加拦截器之前
axiosAutoRetry(instance, {
    // 最多重试次数
    retryCount: 3,
    // 请求成功的重试条件  即interceptors.response进入onFulfilled, 返回true则重试
    retryConditionFulfilled: (response: AxiosResponse) => {
        console.log('retryConditionFulfilled', response.status);
        // 一般可以通过与后端约定一个字段如retry放在headers里面，来决定是否要重试，也可直接放在data里面
        if (response.headers.retry === 'Y' || response.data.retry === 'retry') {
            // 如果什么信处需要回传给后端,可以修改config
            if (response.config.headers) {
                response.config.headers.retryTraceId = response.config.headers.traceId;
            }
            return true;
        }
        return true
    },
    // 请求失败的重试条件  即interceptors.onRejected, 返回true则重试
    retryConditionRejected: (error: any) => {
        // 可以通过error.code来判断是否需要重试  可参考这个npm包is-retry-allowed：https://www.npmjs.com/package/is-retry-allowed
        console.log('retryConditionRejected', error.code);
        if (['xxxx', 'ENOTFOUND'].includes(error.code)) {
            return true;
        }
        // 可通过请求失败的状态码来判断是否要重试
        console.log('retryConditionRejected', error.response?.status);
        if (['xxxx'].includes(error.response?.status)) {
            return true;
        }
        return false;
    },
    // count为重试次数从1开始，返回重试延迟时间 ms
    retryDelay: (count: number) => count * 2000,
});

instance.interceptors.response.use((response) => {
    console.log('自已的成功拦截器')
    return response
}, (error) => {
    console.log('自已的失败拦截器')
    throw error
})


instance({
    url: 'https://baidu.com'
}).then(res => {
    console.log(res.status);
}).catch(error => {
    console.log(error.code)
})


instance({
    url: 'https://baidu.com2/abc'
}).then(res => {
    console.log(res.status);
}).catch(error => {
    console.log(error.code)
})
import { AxiosResponse } from 'axios';

export type RetryConfig = {
    // 最多重试次数
    retryCount: number;
    // 请求成功的重试条件  即interceptors.response进入onFulfilled, 返回true则重试
    retryConditionFulfilled: (response: AxiosResponse)=> boolean;
    // 请求失败的重试条件  即interceptors.onRejected, 返回true则重试
    retryConditionRejected: (error: any)=> boolean;
    // 重试延迟时间 ms
    retryDelay: (count: number) => number;
}

export type RetryState = {
    count: number,
}


declare module 'axios' {
    export interface AxiosRequestConfig {
        retryConfig?: RetryConfig,
        retryState?: RetryState
    }
}

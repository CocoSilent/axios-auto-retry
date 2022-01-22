import { AxiosResponse } from 'axios';

export type RetryConfig = {
    // 最多重试次数
    retryCount: number;
    // 重试条件
    retryCondition: (response: AxiosResponse)=> boolean;
    // 重试延迟时间 ms
    retryDelay: (count: number) => number;
}

export type RetryState = {
    count: number,
}


declare module 'axios' {
    export interface AxiosRequestConfig {
        retryConfig: RetryConfig,
        retryState: RetryState
    }
}

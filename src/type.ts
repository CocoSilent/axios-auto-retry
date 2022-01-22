import { AxiosResponse } from 'axios';

export type RetryConfig = {
    retryCount: number;
    retryCondition: (response: AxiosResponse)=> boolean;
    retryDelay: (count: number) => number;
}

export type RetryState = {
    count: number,
}

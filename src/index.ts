import { RetryConfig, RetryState } from './type';
import { AxiosStatic, AxiosInstance, AxiosResponse } from 'axios';
import { sleep } from './util';


function whetherRetry(retryConfig: RetryConfig, retryState: RetryState, response: AxiosResponse) {
    const { retryCount, retryCondition } = retryConfig;

    let retry = false;
    let currentRetryCount = retryState?.count || 0;
    if ( currentRetryCount < retryCount) {
        retry = retryCondition(response);
    }
    return retry;
}

function getDelay(retryConfig: RetryConfig, retryState: RetryState) {
    let delay = 0;
    const retryStateCount = retryState.count || 0;
    if (retryConfig.retryDelay) {
        delay = retryConfig.retryDelay(retryStateCount + 1);
    }
    return delay;
}

function axiosAutoRetry(instance: AxiosStatic | AxiosInstance , retryConfig: RetryConfig) {
    // 必须保证axiosAutoRetry方法，在axios添加拦截器之前执行，保证拦截器添加在第一个

    // (instance.interceptors.response as any).handlers.unshift  这个方法可以添加到第一个，但不是axios暴露出来的方法

    instance.interceptors.response.use((response: AxiosResponse) => {
        const config = Object.assign(retryConfig, response.config.retryConfig);
        const retryState = response.config.retryState;
        const retry = whetherRetry(config, retryState, response);
        if (retry) {
            retryState.count += 1;
            const delay = getDelay(config, retryState);
            return sleep(delay).then(() => {
                return instance(response.config);
            });
        }
        return response;
    }, (error: any) => {
        Promise.reject(error);
    });
}
export default axiosAutoRetry;

import { RetryConfig, RetryState } from './type';
import { AxiosStatic, AxiosInstance, AxiosResponse } from 'axios';
import { sleep } from './util';


function whetherRetry(params: {
    retryConfig: RetryConfig,
    retryState: RetryState,
    response?: AxiosResponse,
    error?: any
}) {
    const { retryConfig: { retryCount, retryConditionFulfilled, retryConditionRejected }, retryState, response, error } = params;

    let retry = false;
    let currentRetryCount = retryState.count;
    if ( currentRetryCount < retryCount) {
        if (response) {
            retry = retryConditionFulfilled(response);
        } else if (error) {
            retry = retryConditionRejected(error);
        }
    }
    return retry;
}

function getDelay(retryConfig: RetryConfig, retryState: RetryState) {
    let delay = 0;
    const currentRetryCount = retryState.count;
    if (retryConfig.retryDelay) {
        delay = retryConfig.retryDelay(currentRetryCount + 1);
    }
    return delay;
}

function axiosAutoRetry(instance: AxiosStatic | AxiosInstance , retryConfig: RetryConfig) {
    // 必须保证axiosAutoRetry方法，在axios添加拦截器之前执行，保证拦截器添加在第一个

    // (instance.interceptors.response as any).handlers.unshift  这个方法可以添加到第一个，但不是axios暴露出来的方法

    instance.interceptors.response.use((response: AxiosResponse) => {
        const tmpRetryConfig = Object.assign(retryConfig, response.config.retryConfig);
        const retryState = response.config.retryState || { count: 0 };
        const retry = whetherRetry({
            retryConfig: tmpRetryConfig,
            retryState,
            response
        });
        if (retry) {
            const delay = getDelay(tmpRetryConfig, retryState);
            const config = {...response.config}
            config.retryState = {
                count : retryState.count + 1
            };
            return sleep(delay).then(() => {
                return instance(config);
            });
        }
        return response;
    }, (error: any) => {
        if (!error?.config) {
            return Promise.reject(error);
        }
        const tmpRetryConfig = Object.assign(retryConfig, error.config.retryConfig);
        const retryState = error.config.retryState || { count: 0 };
        const retry = whetherRetry({
            retryConfig: tmpRetryConfig,
            retryState,
            error,
        });
        if (retry) {
            const delay = getDelay(tmpRetryConfig, retryState);
            const config = {...error.config}
            config.retryState = {
                count : retryState.count + 1
            };
            return sleep(delay).then(() => {
                return instance(config);
            });
        }
        return Promise.reject(error);
    });
}
export default axiosAutoRetry;

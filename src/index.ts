import { RetryConfig, RetryState } from './type';
import { AxiosStatic, AxiosInstance, AxiosResponse } from 'axios';
import { sleep } from './util'

function axiosAutoRetry(instance: AxiosStatic | AxiosInstance , retryConfig: RetryConfig) {
    (instance.interceptors.response as any).handlers.unshift({
        fulfilled: (response: AxiosResponse & { config: { retryConfig: RetryConfig, retryState: RetryState } }) => {
            const config = Object.assign(retryConfig, response.config.retryConfig);
            const retryState = response.config.retryState;
            const { retryCount, retryCondition, retryDelay } = config;

            let retry = false;
            let currentRetryCount = retryState?.count || 0;
            if ( currentRetryCount < retryCount) {
                retry = retryCondition(response);
            }
            let delay = 0;
            if (retryDelay) {
                delay = retryDelay(currentRetryCount + 1);
            }
            if (retry) {
                return sleep(delay).then(() => {
                    return instance(response.config);
                });
            }
            return response;
        },
        rejected: (err: any) => {
            throw err
        },
    });
}
export default axiosAutoRetry;

import { AxiosRequestConfig, AxiosResponse } from "axios";
import { Data } from "react-auto-form-core/dist/Utils/CollectedData";
export interface SubmitConfig {
    url: string;
    method?: string;
    alterConfig?: (config: AxiosRequestConfig) => AxiosRequestConfig;
    headers?: any;
    data?: (data: Data) => any;
    dataAs?: "body" | "form-data";
    changeLoadingStatus?: boolean;
    onSuccess?: (response: AxiosResponse) => void;
    onFail?: (e: any) => void;
}

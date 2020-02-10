import CollectedData from "react-auto-form-core/dist/Utils/CollectedData";
import { AxiosPromise } from "axios";
import { SubmitConfig } from "./SubmitConfig";
export declare class RequestFactory {
    protected readonly data: CollectedData;
    protected readonly submitConfig: SubmitConfig;
    constructor(data: CollectedData, submitConfig: SubmitConfig);
    send(): AxiosPromise;
}

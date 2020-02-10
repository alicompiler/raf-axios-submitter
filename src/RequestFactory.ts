import CollectedData, {Data} from "react-auto-form-core/dist/Utils/CollectedData";
import Axios, {AxiosPromise, AxiosRequestConfig} from "axios";
import {SubmitConfig} from "./SubmitConfig";

export class RequestFactory {
    protected readonly data: CollectedData;
    protected readonly submitConfig: SubmitConfig;

    public constructor(data: CollectedData, submitConfig: SubmitConfig) {
        this.data = data;
        this.submitConfig = submitConfig;
    }

    send(): AxiosPromise {
        const type = this.submitConfig.method ? this.submitConfig.method.trim().toLowerCase() : 'get';
        switch (type) {
            case "get":
                return (new GetRequest(this.data, this.submitConfig)).send();
            case "post":
                return (new PostRequest(this.data, this.submitConfig)).send();
            case "put":
                return (new PutRequest(this.data, this.submitConfig)).send();
            case "patch":
                return (new PatchRequest(this.data, this.submitConfig)).send();
            case "delete":
                return (new DeleteRequest(this.data, this.submitConfig)).send();
            case "head":
                return (new HeadRequest(this.data, this.submitConfig)).send();
            case "options":
                return (new OptionsRequest(this.data, this.submitConfig)).send();

            case undefined:
                return (new GetRequest(this.data, this.submitConfig)).send();

            default:
                throw Error("CANNOT RECOGNIZE HTTP METHOD");
        }
    }


}


abstract class Request {
    protected readonly data: CollectedData;
    protected readonly submitConfig: SubmitConfig;

    public constructor(data: CollectedData, submitConfig: any) {
        this.data = data;
        this.submitConfig = submitConfig;
    }

    abstract send(): AxiosPromise;


    protected getData(): any {
        return this.data.getData();
    }

    protected getFiles(): any {
        return this.data.getFiles();
    }

    protected getQueryParams() {
        return this.data.getQuery();
    }

    protected getUrl() {
        return this.submitConfig.url;
    }

    protected getHeadersToAttach() {
        const headers = this.submitConfig.headers ?? {};
        return {...this.contentTypeHeaderForFileUpload(), ...headers};
    }

    protected contentTypeHeaderForFileUpload(): any {
        const filesCount = this.data.getFiles() ? Object.keys(this.data.getFiles()).length : 0;
        if (filesCount === 0) {
            return {};
        }
        return {
            'Content-Type': 'multipart/form-data'
        }
    }

    protected getConfig(): AxiosRequestConfig {
        const config: AxiosRequestConfig = {
            params: this.getQueryParams(),
            headers: this.getHeadersToAttach(),
        };

        if (this.submitConfig.alterConfig) {
            return this.submitConfig.alterConfig(config);
        }

        return config;
    }
}

class GetRequest extends Request {
    send(): AxiosPromise {
        return Axios.get(this.getUrl(), this.getConfig());
    }


    protected getQueryParams(): Data {
        return {...super.getQueryParams(), ...super.getData()};
    }

    protected contentTypeHeaderForFileUpload(): any {
        return {};
    }
}

class PostRequest extends Request {
    send(): AxiosPromise {
        return Axios.post(this.getUrl(), this.getData(), this.getConfig());
    }

    protected getData(): any {
        if (this.submitConfig.data) {
            return this.submitConfig.data(super.getData());
        }

        const filesCount = this.getFiles() ? Object.keys(this.getFiles()).length : 0;
        const dataAs = this.submitConfig.dataAs ?? (filesCount === 0 ? "body" : "form-data");

        if (dataAs === "body") {
            return super.getData();
        } else if (dataAs === "form-data") {
            const data = new FormData();
            const collectedData = super.getData();
            const collectedFiles = super.getFiles();
            Object.keys(collectedData).forEach(key => data.append(key, collectedData[key]));
            Object.keys(collectedFiles).forEach(key => data.append(key, collectedFiles[key]));
            return data;
        }
    }
}

class PutRequest extends PostRequest {
    send(): AxiosPromise {
        return Axios.put(this.getUrl(), this.getData(), this.getConfig());
    }
}

class DeleteRequest extends Request {
    send(): AxiosPromise {
        return Axios.delete(this.getUrl(), this.getConfig());
    }

    protected contentTypeHeaderForFileUpload(): any {
        return {};
    }
}

class OptionsRequest extends Request {
    send(): AxiosPromise {
        return Axios.options(this.getUrl(), this.getConfig());
    }

    protected contentTypeHeaderForFileUpload(): any {
        return {};
    }
}

class HeadRequest extends Request {
    send(): AxiosPromise {
        return Axios.head(this.getUrl(), this.getConfig());
    }

    protected contentTypeHeaderForFileUpload(): any {
        return {};
    }
}

class PatchRequest extends PostRequest {
    send(): AxiosPromise {
        return Axios.patch(this.getUrl(), this.getData(), this.getConfig());
    }

    protected contentTypeHeaderForFileUpload(): any {
        return {};
    }
}



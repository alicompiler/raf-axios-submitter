var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import Axios from "axios";
var RequestFactory = /** @class */ (function () {
    function RequestFactory(data, submitConfig) {
        this.data = data;
        this.submitConfig = submitConfig;
    }
    RequestFactory.prototype.send = function () {
        var type = this.submitConfig.method ? this.submitConfig.method.trim().toLowerCase() : 'get';
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
    };
    return RequestFactory;
}());
export { RequestFactory };
var Request = /** @class */ (function () {
    function Request(data, submitConfig) {
        this.data = data;
        this.submitConfig = submitConfig;
    }
    Request.prototype.getData = function () {
        return this.data.getData();
    };
    Request.prototype.getFiles = function () {
        return this.data.getFiles();
    };
    Request.prototype.getQueryParams = function () {
        return this.data.getQuery();
    };
    Request.prototype.getUrl = function () {
        return this.submitConfig.url;
    };
    Request.prototype.getHeadersToAttach = function () {
        var _a;
        var headers = (_a = this.submitConfig.headers, (_a !== null && _a !== void 0 ? _a : {}));
        return __assign(__assign({}, this.contentTypeHeaderForFileUpload()), headers);
    };
    Request.prototype.contentTypeHeaderForFileUpload = function () {
        var filesCount = this.data.getFiles() ? Object.keys(this.data.getFiles()).length : 0;
        if (filesCount === 0) {
            return {};
        }
        return {
            'Content-Type': 'multipart/form-data'
        };
    };
    Request.prototype.getConfig = function () {
        var config = {
            params: this.getQueryParams(),
            headers: this.getHeadersToAttach(),
        };
        if (this.submitConfig.alterConfig) {
            return this.submitConfig.alterConfig(config);
        }
        return config;
    };
    return Request;
}());
var GetRequest = /** @class */ (function (_super) {
    __extends(GetRequest, _super);
    function GetRequest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GetRequest.prototype.send = function () {
        return Axios.get(this.getUrl(), this.getConfig());
    };
    GetRequest.prototype.getQueryParams = function () {
        return __assign(__assign({}, _super.prototype.getQueryParams.call(this)), _super.prototype.getData.call(this));
    };
    GetRequest.prototype.contentTypeHeaderForFileUpload = function () {
        return {};
    };
    return GetRequest;
}(Request));
var PostRequest = /** @class */ (function (_super) {
    __extends(PostRequest, _super);
    function PostRequest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PostRequest.prototype.send = function () {
        return Axios.post(this.getUrl(), this.getData(), this.getConfig());
    };
    PostRequest.prototype.getData = function () {
        var _a;
        if (this.submitConfig.data) {
            return this.submitConfig.data(_super.prototype.getData.call(this));
        }
        var filesCount = this.getFiles() ? Object.keys(this.getFiles()).length : 0;
        var dataAs = (_a = this.submitConfig.dataAs, (_a !== null && _a !== void 0 ? _a : (filesCount === 0 ? "body" : "form-data")));
        if (dataAs === "body") {
            return _super.prototype.getData.call(this);
        }
        else if (dataAs === "form-data") {
            var data_1 = new FormData();
            var collectedData_1 = _super.prototype.getData.call(this);
            var collectedFiles_1 = _super.prototype.getFiles.call(this);
            Object.keys(collectedData_1).forEach(function (key) { return data_1.append(key, collectedData_1[key]); });
            Object.keys(collectedFiles_1).forEach(function (key) { return data_1.append(key, collectedFiles_1[key]); });
            return data_1;
        }
    };
    return PostRequest;
}(Request));
var PutRequest = /** @class */ (function (_super) {
    __extends(PutRequest, _super);
    function PutRequest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PutRequest.prototype.send = function () {
        return Axios.put(this.getUrl(), this.getData(), this.getConfig());
    };
    return PutRequest;
}(PostRequest));
var DeleteRequest = /** @class */ (function (_super) {
    __extends(DeleteRequest, _super);
    function DeleteRequest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeleteRequest.prototype.send = function () {
        return Axios.delete(this.getUrl(), this.getConfig());
    };
    DeleteRequest.prototype.contentTypeHeaderForFileUpload = function () {
        return {};
    };
    return DeleteRequest;
}(Request));
var OptionsRequest = /** @class */ (function (_super) {
    __extends(OptionsRequest, _super);
    function OptionsRequest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OptionsRequest.prototype.send = function () {
        return Axios.options(this.getUrl(), this.getConfig());
    };
    OptionsRequest.prototype.contentTypeHeaderForFileUpload = function () {
        return {};
    };
    return OptionsRequest;
}(Request));
var HeadRequest = /** @class */ (function (_super) {
    __extends(HeadRequest, _super);
    function HeadRequest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HeadRequest.prototype.send = function () {
        return Axios.head(this.getUrl(), this.getConfig());
    };
    HeadRequest.prototype.contentTypeHeaderForFileUpload = function () {
        return {};
    };
    return HeadRequest;
}(Request));
var PatchRequest = /** @class */ (function (_super) {
    __extends(PatchRequest, _super);
    function PatchRequest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PatchRequest.prototype.send = function () {
        return Axios.patch(this.getUrl(), this.getData(), this.getConfig());
    };
    PatchRequest.prototype.contentTypeHeaderForFileUpload = function () {
        return {};
    };
    return PatchRequest;
}(PostRequest));

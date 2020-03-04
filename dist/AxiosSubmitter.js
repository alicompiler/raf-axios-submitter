import { RequestFactory } from "./RequestFactory";
import { PreDefinedEventType } from "react-auto-form-core/dist/Form/AutoFormEvent";
var AxiosSubmitter = /** @class */ (function () {
    function AxiosSubmitter(form) {
        this.form = form;
    }
    AxiosSubmitter.prototype.submit = function () {
        var _this = this;
        var data = this.form.collect();
        if (this.changeLoadingStatus())
            this.getForm().startLoading();
        new RequestFactory(data, this.getSubmitConfig()).send()
            .then(function (response) {
            _this.onSuccess(response);
        })
            .catch(function (e) {
            _this.onFail(e);
        });
    };
    AxiosSubmitter.prototype.onFail = function (e) {
        if (this.changeLoadingStatus())
            this.getForm().stopLoading();
        this.getForm().emitEvent({
            type: PreDefinedEventType.ON_FAIL_SUBMITTING,
            payload: e
        });
        if (this.getSubmitConfig().onFail)
            this.getSubmitConfig().onFail(e);
    };
    AxiosSubmitter.prototype.onSuccess = function (response) {
        if (this.changeLoadingStatus())
            this.getForm().stopLoading();
        this.getForm().emitEvent({
            type: PreDefinedEventType.ON_SUCCESS_SUBMITTING,
            payload: response
        });
        if (this.getSubmitConfig().onSuccess)
            this.getSubmitConfig().onSuccess(response);
    };
    AxiosSubmitter.prototype.getForm = function () {
        return this.form;
    };
    AxiosSubmitter.prototype.getSubmitConfig = function () {
        var submitConfig = this.form.props.submitConfig;
        return (submitConfig !== null && submitConfig !== void 0 ? submitConfig : { url: '' });
    };
    AxiosSubmitter.prototype.changeLoadingStatus = function () {
        if (this.getSubmitConfig().changeLoadingStatus === undefined)
            return false;
        return this.getSubmitConfig().changeLoadingStatus;
    };
    return AxiosSubmitter;
}());
export default AxiosSubmitter;

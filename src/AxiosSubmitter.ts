import Submitter from "react-auto-form-core/dist/Protocol/Submitter";
import IForm from "react-auto-form-core/dist/Form/IForm";
import {AxiosResponse} from "axios";
import {RequestFactory} from "./RequestFactory";
import {SubmitConfig} from "./SubmitConfig";
import {PreDefinedEventType} from "react-auto-form-core/dist/Form/AutoFormEvent";

export default class AxiosSubmitter implements Submitter {
    private readonly form: IForm;

    constructor(form: IForm) {
        this.form = form;
    }

    public submit() {
        const data = this.form.collect();

        if (this.changeLoadingStatus())
            this.getForm().startLoading();

        new RequestFactory(data, this.getSubmitConfig()).send()
            .then((response: AxiosResponse) => {
                this.onSuccess(response);
            })
            .catch((e: any) => {
                this.onFail(e);
            });
    }

    private onFail(e: any) {
        if (this.changeLoadingStatus())
            this.getForm().stopLoading();

        this.getForm().emitEvent({
            type: PreDefinedEventType.ON_FAIL_SUBMITTING,
            payload: e
        });

        if (this.getSubmitConfig().onFail)
            this.getSubmitConfig().onFail!(e);
    }

    private onSuccess(response: AxiosResponse<any>) {
        if (this.changeLoadingStatus())
            this.getForm().stopLoading();

        this.getForm().emitEvent({
            type: PreDefinedEventType.ON_SUCCESS_SUBMITTING,
            payload: response
        });

        if (this.getSubmitConfig().onSuccess)
            this.getSubmitConfig().onSuccess!(response);
    }

    getForm(): IForm {
        return this.form;
    }

    private getSubmitConfig(): SubmitConfig {
        const submitConfig = (this.form as any).props.submitConfig;
        return submitConfig ?? {url: ''};
    }

    private changeLoadingStatus(): boolean {
        if (this.getSubmitConfig().changeLoadingStatus === undefined)
            return false;
        return this.getSubmitConfig().changeLoadingStatus!;
    }
}
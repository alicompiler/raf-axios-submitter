import Submitter from "react-auto-form-core/dist/Protocol/Submitter";
import IForm from "react-auto-form-core/dist/Form/IForm";
export default class AxiosSubmitter implements Submitter {
    private readonly form;
    constructor(form: IForm);
    submit(): void;
    private onFail;
    private onSuccess;
    getForm(): IForm;
    private getSubmitConfig;
    private changeLoadingStatus;
}

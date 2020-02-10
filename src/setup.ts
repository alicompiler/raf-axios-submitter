import FormDefault from "react-auto-form-core/dist/Form/FormDefault";
import AxiosSubmitter from "./AxiosSubmitter";

export function setRafAxiosSubmitterAsDefaultSubmitter() {
    FormDefault.setSubmitter(form => new AxiosSubmitter(form));
}
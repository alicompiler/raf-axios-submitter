import React from 'react';
import { setRafAxiosSubmitterAsDefaultSubmitter } from "./setup";
import { setupRafValidatorAsDefaultValidator } from "raf-default-validator/dist/setup";
import Form from "react-auto-form-core/dist/Form/Form";
import TextField from "react-auto-form-core/dist/DefaultElement/TextField";
import FileField from "react-auto-form-core/dist/DefaultElement/DefaultFileField";
setRafAxiosSubmitterAsDefaultSubmitter();
setupRafValidatorAsDefaultValidator();
function App() {
    return (React.createElement("div", { className: "App" },
        React.createElement(Form, { fields: [
                { as: TextField, name: 'test' },
                { as: FileField, name: 'image' },
            ], submitConfig: {
                url: 'http://sometestingurl.com',
                method: 'post'
            } })));
}
export default App;

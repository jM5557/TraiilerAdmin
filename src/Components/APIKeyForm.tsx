import { SyntheticEvent, useState } from "react";
import { useCookies } from "react-cookie";
import { ReactComponent as Logo } from "./../assets/logos/logo-v2-128px.svg";
import { ReactComponent as ChevronRight } from "./../assets/icons/chevron-right.svg";

interface APIKeyFormProps { }

const APIKeyForm: React.FC<APIKeyFormProps> = (props): JSX.Element => {
    const [key, setKey] = useState<string>("");
    const [errorLog, setErrorLog] = useState<string>("");
    const [showError, setShowError] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [cookies, setCookies] = useCookies(['key']);

    const handleSubmit = async () => {
        setShowError(false);
        setSubmitting(true);
        try {
            console.log(process.env.REACT_APP_BASEURL);
            let results = await fetch(`${process.env.REACT_APP_BASEURL}/signin/${key.trim()}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!results.ok) throw new Error("Invalid API Key");

            setCookies('key', key.trim());
            setSubmitting(false);
            console.log(key.trim());
        }
        catch (error) {
            console.log((error as Error).message);
            setErrorLog((error as Error).message);
            setShowError(true);
            setSubmitting(false);
        }
    }
    return (
        <form
            className="api-key-form"
            onSubmit={
                (submitting)
                    ? () => { }
                    : handleSubmit
            }
        >
            <div className="inner-form flex y-center x-between">
                <Logo className="logo" />
                <div className="input-wrapper flex">
                    <label className="label">
                        <b>API Key</b>
                        <input type="text"
                            value={key}
                            onChange={
                                (e: SyntheticEvent) => setKey((e.target as HTMLInputElement).value)
                            }
                        />
                    </label>
                    <button
                        type="submit"
                        onClick={
                            (e: SyntheticEvent) => {
                                e.preventDefault();
                                e.stopPropagation();

                                if (!submitting)
                                    handleSubmit();
                            }
                        }
                        className={
                            (submitting)
                                ? 'submit-btn disabled'
                                : 'submit-btn'
                        }
                        disabled={submitting}
                    >
                        <ChevronRight />
                    </button>
                </div>
            </div>
            {(showError) &&
                <div className="error">{errorLog}</div>
            }
        </form>
    );
}

export default APIKeyForm;
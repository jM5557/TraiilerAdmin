import React, { useContext, useState } from "react";
import { CollectionFormContext } from "../util/context/CollectionForm";
import CollectionForm from "./CollectionForm";
import Search from "./Search";

interface BaseLayoutProps {
    children?: React.ReactNode
}
 
const BaseLayout: React.FC<BaseLayoutProps> = ({ children }): JSX.Element => {
    const { dispatch } = useContext(CollectionFormContext);

    const [submitType, setSubmitType] = useState<string>("CREATE");
    
    return (
        <div className="form-wrapper">
            <header className="flex y-center x-between top-header">
                <div className="submit-types">
                    <button
                        type = "button"
                        onClick={
                            () => {
                                setSubmitType("CREATE");
                                dispatch({
                                    type: 'RESET_STATE',
                                    payload: null
                                });
                            }
                        }
                        className = { submitType === "CREATE" ? "selected create" : "create" }
                    >
                        Create
                    </button>
                    <button
                        type = "button"
                        onClick={
                            () => setSubmitType("EDIT")
                        }
                        className = { submitType === "EDIT" ? "selected" : "" }
                    >
                        Edit
                    </button>
                </div>
            
                { (submitType === "EDIT") &&
                    <Search />
                }
            </header>
            <CollectionForm 
                submitType={ submitType }
            />
            { children }
        </div>
    );
}
 
export default BaseLayout;
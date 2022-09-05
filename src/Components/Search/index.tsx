import React, { useContext, useState } from "react";
import { useCookies } from "react-cookie";
import usePopup from "../../hooks/UsePopup";
import { CollectionFormContext } from "../../util/context/CollectionForm";
import { Collection } from "../../util/types";
import { loadCollection } from "../CollectionForm";
import SearchBar from "./SearchBar";

interface SearchProps {}
 
const Search: React.FC<SearchProps> = (): JSX.Element => {
    const { dispatch } = useContext(CollectionFormContext);
    const [cookies] = useCookies(['key']);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [
        outerRef,
        displayCollections,
        setDisplayCollections
    ] = usePopup<HTMLDivElement>();
    return (
        <div className="search-wrapper" ref = { outerRef }>
            <SearchBar
                setCollections={
                    (c: typeof collections) => {
                        setCollections(c);
                        setDisplayCollections(true);
                    }
                }
            />
            { (displayCollections) &&
                <div className="search-results">
                    { (collections.length > 0)
                        ? (
                            <>
                                {
                                    collections.map(
                                        (c: Collection) => (
                                            <button
                                                className = "search-result"
                                                type = "button"
                                                onClick={
                                                    () => {
                                                        loadCollection(
                                                            c.id, 
                                                            dispatch,
                                                            cookies['key']
                                                        );
                                                        setDisplayCollections(false);
                                                    }
                                                }
                                            >
                                                <b>
                                                    { c.title }
                                                </b>
                                                {/* <div className="search-result-details">
                                                    <span>{ c.id }</span>
                                                    <a href = {`https://traiiler.com/collection/${ c.slug }/${ c.id }`}>
                                                        Open in New Tab
                                                    </a>
                                                </div> */}
                                            </button>
                                        )
                                    )
                                }
                            </>
                        )
                        : (
                            <div>
                                No Collections Found
                            </div>
                        )
                    }
                </div>
            }
        </div>
    );
}
 
export default Search;
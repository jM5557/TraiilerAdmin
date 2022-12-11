import { useEffect, useState, useCallback, useMemo } from "react";
import { useCookies } from "react-cookie";
import GenresAPI from "../api/genres";
import { Genre } from "../util/types";
import { ReactComponent as XIcon } from "./../assets/icons/x-icon.svg";


interface GenresProps {
    genres: Genre[],
    setGenres: Function
}

const Genres: React.FC<GenresProps> = ({
    genres,
    setGenres
}) => {
    let [cookies] = useCookies(['key']);
    let [allGenres, setAllGenres] = useState<Genre[] | null>(null);

    let genresAPI = useCallback(
        () => GenresAPI(cookies.key),
        []
    );

    let fetchResults = useCallback(async () => {
        let results = await genresAPI().getAllGenres();

        setAllGenres(results.data);
    }, [])

    useEffect(() => {
        fetchResults();
    }, []);


    return (
        <div className="genres-select">
            <h2>Genres</h2>

            <div className="genres">
                { (allGenres)
                    ? <>
                        {
                            allGenres.map(
                                (g: Genre) => (
                                    <button 
                                        type = "button"
                                        className="genre"
                                        key={ g.id }
                                        onClick = {() => {
                                            let arr = [...genres];

                                            let exists = false;
                                            arr.forEach((val: Genre) => {
                                                if (val.id === g.id)
                                                    exists = true;
                                            });
                                            if (!exists)
                                                arr.push(g);
                                            setGenres(arr);
                                        }}
                                    >
                                        { g.text }
                                    </button>
                                )
                            )
                        }
                    </>
                    : <div className="loading">
                        <span>Loading...</span>
                    </div>
                }
            </div>

            <div className="selected-genres">
                { (genres.length > 0) &&
                    <>
                        {
                            genres.map((g: Genre) => (
                                <div 
                                    className="genre flex x-center y-center"
                                    key = { g.id }
                                >
                                    <span>{ g.text }</span>
                                    <button
                                        type = "button"
                                        onClick = {
                                            () => {
                                                let arr = genres.filter(
                                                    (selection: Genre) => selection.id !== g.id
                                                )

                                                setGenres(arr);
                                            }
                                        }
                                    >
                                        <XIcon />
                                        <span className="hidden">
                                            Delete
                                        </span>
                                    </button>
                                </div>
                            ))
                        }
                    </>
                }
            </div>
        </div>
    );
}
 
export default Genres;
import { useState, SyntheticEvent, useRef, RefObject, useEffect } from "react";
import { ReactComponent as SearchIcon } from "./../assets/icons/search-icon.svg";

interface AddPosterFormProps {
  callbackFn: Function;
  initialPosterUrl: string | null;
  collectionType: "movie" | "tv";
}

// Available sizes: w92, 2154, w185, w342, w500, w780, original
const posterUrl = (path: string) => `https://image.tmdb.org/t/p/w342${path}`;

const getPoster = async (query: string, searchType: string = "movie") => {
  let results = await fetch(
    `https://api.themoviedb.org/3/search/${searchType}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&query=${query}&page=1&include_adult=false`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  let data = await results.json();
  if (data.results) {
    let posters: string[] | null = data.results.map((r: any) => r.poster_path);

    if (posters) posters = posters.filter((r: any) => r !== null);

    return posters as string[];
  }

  return null;
};

const AddPosterForm: React.FC<AddPosterFormProps> = ({
  callbackFn,
  initialPosterUrl,
  collectionType,
  ...props
}): JSX.Element => {
  const [title, setTitle] = useState<string>("");
  const [url, setUrl] = useState<string>(initialPosterUrl ?? "");
  const [results, setResults] = useState<any[] | null>(null);
  const [timeout, setTimeout] = useState<number | null>(null);

  let resultsContainerRef = useRef<HTMLDivElement>(null);

  const inputRef: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

  const clearForm = () => {
    setTitle("");
    setUrl("");
    setResults(null);
    callbackFn(null);
  };

  useEffect(() => {
    setUrl(initialPosterUrl ?? "");
    setTitle("");
    setResults(null);
  }, [initialPosterUrl]);

  useEffect(() => {
    if (resultsContainerRef && resultsContainerRef.current)
      resultsContainerRef.current.scrollLeft = 0;

    return () => {
      if (timeout) {
        clearTimeout(timeout);
        setTimeout(null);
      }
    };
  }, [results]);

  return (
    <div className="add-video-form">
      <div className="form-body">
        {url && (
          <>
            <img alt="video thumbnail" src={posterUrl(url)} />
            <small className="id">{url}</small>
          </>
        )}
        {!url && (
          <div className="empty">
            <header>Add a Poster</header>
          </div>
        )}
        <form
          onSubmit={ async (e: SyntheticEvent) => {
            e.preventDefault();
            e.stopPropagation();

            let data = await getPoster(title, collectionType);

            setResults(data);

            setTimeout(
              window.setTimeout(() => {
                if (resultsContainerRef && resultsContainerRef.current)
                  resultsContainerRef.current.scrollLeft = 0;
              }, 400)
            );
          }}
          className="input"
          style={{ marginBottom: "8px" }}
        >
          <label className="flex x-between y-center">
            <div>
              <b>Search by Title</b>
              <input
                type="text"
                value={title}
                onChange={(e: SyntheticEvent) =>
                  setTitle((e.target as HTMLInputElement).value)
                }
                autoFocus
                ref={inputRef}
              />
            </div>
            {title.length > 0 && (
              <>
                <button
                  type="button"
                  className="clear-text-btn"
                  onClick={(e: SyntheticEvent) => {
                    e.preventDefault();
                    e.stopPropagation();

                    setTitle("");
                  }}
                >
                  <span className="hidden">Clear</span>
                </button>
                <button
                  type="submit"
                  className="search-btn"
                  onClick={async (e: SyntheticEvent) => {
                    e.stopPropagation();
                    e.preventDefault();

                    let data = await getPoster(title, collectionType);

                    setResults(data);

                    setTimeout(
                      window.setTimeout(() => {
                        if (resultsContainerRef && resultsContainerRef.current)
                          resultsContainerRef.current.scrollLeft = 0;
                        console.log("Foobar");
                      }, 400)
                    );
                  }}
                >
                  <SearchIcon />
                  <span>Search</span>
                </button>
              </>
            )}
          </label>
        </form>

        <div className="input title">
          <label className="flex x-between y-center">
            <div>
              <b>Poster URL</b>
              <input
                type="text"
                value={url}
                onChange={(e: SyntheticEvent) =>
                  setUrl((e.target as HTMLInputElement).value)
                }
              />
            </div>
            {url.length > 0 && (
              <button
                type="button"
                className="clear-text-btn"
                onClick={(e: SyntheticEvent) => {
                  e.preventDefault();
                  e.stopPropagation();

                  setUrl("");
                }}
              >
                <span className="hidden">Clear</span>
              </button>
            )}
          </label>
        </div>

        {results && (
          <div
            className="flex y-center x-start add-item-form-results posters"
            ref={resultsContainerRef}
          >
            {results?.map((r: string, index: number) => (
              <img
                key={index}
                alt="movie poster"
                src={posterUrl(r)}
                tabIndex={0}
                className="item"
                onClick={() => {
                  setUrl(r);
                  callbackFn(posterUrl(r));
                }}
              />
            ))}
          </div>
        )}

        {(url && url.trim().length > 0) || results &&
          <div className="buttons">
            <button 
                type="button" 
                onClick={clearForm} 
                className="cancel-btn"
            >
              Clear
            </button>
          </div>
        }
      </div>
    </div>
  );
};

export default AddPosterForm;

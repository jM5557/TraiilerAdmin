import { RefObject } from "react";
import { useEffect } from "react";
 
const useOnClickOutside = <T extends HTMLElement,>(
    handler: (e: any) => void,
    outerRef: RefObject<T>
): void => {
    useEffect(() => {
        const listener = (e: any) => {
            let el = outerRef?.current;

            // Do nothing if clicking ref's element or descendent elements
            if (!el || el.contains(e.target as Node))
                return

            handler(e);
        }
        
        document.addEventListener("click", listener);
        document.addEventListener("touchstart", listener);

        return (() => {
            document.removeEventListener("click", listener);
            document.removeEventListener("touchstart", listener);
        })
    }, [outerRef, handler]);
}

export default useOnClickOutside;
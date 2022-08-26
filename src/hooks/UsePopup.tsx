import react, { useState, useRef, useEffect, RefObject } from "react";
import useOnClickOutside from "./OnClickOutside";

const usePopup = <T extends HTMLElement,>() => {
    const outerRef: RefObject<T> = useRef<T>(null);
    const [displayPopup, setDisplayPopup] = useState<boolean>(false);
    useOnClickOutside(
        () => setDisplayPopup(false),
        outerRef
    );
    
    return [
        outerRef,
        displayPopup,
        setDisplayPopup
    ] as const;
}

export default usePopup;
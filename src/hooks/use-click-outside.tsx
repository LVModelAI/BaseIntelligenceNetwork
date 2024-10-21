import { type RefObject, useEffect, useRef } from "react";

type RefType<T extends HTMLElement> = RefObject<T>;

const useClickOutside = <T extends HTMLElement>(callback: () => void): RefType<T> => {
    const ref = useRef<T>(null);

    useEffect(() => {
        const handleClick = (e: Event) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                callback();
            }
        };

        document.addEventListener("click", handleClick);

        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, [callback]);

    return ref;
};

export { useClickOutside };
import { useEffect } from "react";

type Key =
    | "Enter" | "Escape" | "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight"
    | "Tab" | "Backspace" | "Delete" | "Shift" | "Control" | "Alt" | "Meta"
    | "Space" | "CapsLock" | "NumLock" | "ScrollLock" | "Pause" | "Insert"
    | "Home" | "End" | "PageUp" | "PageDown" | "F1" | "F2" | "F3" | "F4" | "F5"
    | "F6" | "F7" | "F8" | "F9" | "F10" | "F11" | "F12"
    | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
    | "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l"
    | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x"
    | "y" | "z" | "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J"
    | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V"
    | "W" | "X" | "Y" | "Z"
    | "!" | "@" | "#" | "$" | "%" | "^" | "&" | "*" | "(" | ")"
    | "-" | "_" | "=" | "+" | "[" | "{" | "]" | "}" | "\\" | "|" | ";" | ":"
    | "'" | "\"" | "," | "<" | "." | ">" | "/" | "?" | "`" | "~";

const useKeyPress = (
    callback: () => void,
    addNewLine: () => void,
    ...keys: Key[]
) => {
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            // Check for the Shift + Enter case to add a new line
            if (event.key === "Enter" && event.shiftKey) {
                event.preventDefault(); // Prevent form submission
                addNewLine(); // Add newline
                return;
            }

            // Check for normal Enter press
            const pressedKeys = keys.filter((key) => {
                if (key === "Control") return event.ctrlKey;
                if (key === "Shift") return event.shiftKey;
                if (key === "Alt") return event.altKey;
                if (key === "Meta") return event.metaKey;
                return event.key === key;
            });

            const allPressed = pressedKeys.length === keys.length;
            if (allPressed && event.key === "Enter" && !event.shiftKey) {
                event.preventDefault(); // Prevent form submission
                callback(); // Trigger callback for normal Enter key
            }
        };

        // Add keydown listener
        document.addEventListener("keydown", handleKeyPress);

        // Clean up the event listener on component unmount
        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [callback, addNewLine, keys]);
};

export default useKeyPress;

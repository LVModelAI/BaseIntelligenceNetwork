import { useEffect, useState } from 'react';

import useMessageStore from '~/store/messages';

const useTypingEffect = (text = '', speed: number) => {
    const [displayedText, setDisplayedText] = useState<string>('');
    const { containerRef } = useMessageStore();

    useEffect(() => {
        if (displayedText) {
            containerRef?.current?.scrollTo({
                behavior: 'instant',
                top: containerRef.current.scrollHeight,
            });
        }
    }, [displayedText]);

    useEffect(() => {
        setDisplayedText(''); // Reset the displayed text on code change
        let index = 0;

        const interval = setInterval(() => {
            index++;
            if (index <= text.length) {
                setDisplayedText(text.substring(0, index));
            } else {
                clearInterval(interval);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed]);

    return displayedText;
};

export default useTypingEffect;

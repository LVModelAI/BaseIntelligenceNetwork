import { useEffect, useMemo,useState } from 'react';

type Section = { type: 'text' | 'code'; content: string };

const useSequentialTypingEffect = (sections: Section[], typingSpeed: number, delayBetweenSections: number) => {
    const [displayedSections, setDisplayedSections] = useState<Section[]>([]);
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

    const currentSection = useMemo(() => sections[currentSectionIndex], [sections, currentSectionIndex]);

    useEffect(() => {
        if (currentSectionIndex < sections.length) {
            if (!currentSection) return;

            let index = 0;
            const interval = setInterval(() => {
                index++;
                if (index <= currentSection.content.length) {
                    setDisplayedSections(prev => [
                        ...prev.slice(0, currentSectionIndex),
                        {
                            ...currentSection,
                            content: currentSection.content.substring(0, index)
                        }
                    ]);
                } else {
                    clearInterval(interval);
                    setTimeout(() => {
                        setCurrentSectionIndex(currentSectionIndex + 1);
                    }, delayBetweenSections);
                }
            }, typingSpeed);

            return () => clearInterval(interval);
        }
    }, [currentSection, currentSectionIndex, sections, typingSpeed, delayBetweenSections]);

    return displayedSections;
};

export default useSequentialTypingEffect;

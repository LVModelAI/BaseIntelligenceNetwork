import { type FC, memo, useState } from 'react';
import { FaCheck,FaRegCopy } from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight as theme } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface CodeDisplayProps {
    code: string;
    fileName: string;
}

const CodeDisplay: FC<CodeDisplayProps> = memo(({ code, fileName }) => { // Default speed to 50ms
    const [copied, setCopied] = useState(false);
    // const lastLineRef = useRef<HTMLDivElement>(null);

    // useEffect(() => {
    //     if (lastLineRef.current) {
    //         lastLineRef.current.scrollIntoView({ behavior: "instant" });
    //     }
    // }, [code]);

    const handleCopy = () => {
        void navigator.clipboard.writeText(code);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <div className="border border-brd-clr overflow-hidden max-w-full w-full mt-5">
            <div
                className="flex items-center justify-between px-4 py-2 bg-[#fcfcfc] border-b border-brd-clr"
            >
                <span className="font-mono text-sm text-tertiary">
                    {fileName}
                    {/* {"Your Code"} */}
                </span>
                <button
                    onClick={handleCopy}
                    className="flex items-center text-sm hover:text-gray-400 disabled:cursor-not-allowed font-mono font-medium tracking-tight text-[#7F7F7F]"
                    disabled={copied}
                >
                    {copied ? (
                        <>
                            <FaCheck className="mr-1" />
                            Copied
                        </>
                    ) : (
                        <>
                            <FaRegCopy className="mr-1" />
                            Copy
                        </>
                    )}
                </button>
            </div>
            <div className='w-full'>
                <SyntaxHighlighter
                    language={fileName}
                    style={theme}
                    showLineNumbers={true}
                    customStyle={{
                        backgroundColor: '#fff',
                        boxShadow: "none",
                        fontFamily: "consolas",
                        fontSize: '14px',
                        margin: 0,
                        overflow: "auto", 
                        padding: '16px',
                        position: 'relative',
                        width: "100%",
                    }}
                    lineNumberStyle={{
                        backgroundColor: '#fff',
                        color: '#888',
                        paddingRight: '16px',
                    }}
                    wrapLines={true}
                    lineProps={(_lineNumber) => ({
                        // ref: lineNumber === (code.split('\n').length) ? lastLineRef : undefined,
                        style: {
                            backgroundColor: '#fff',
                        },
                    })}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    );
});

export default CodeDisplay;

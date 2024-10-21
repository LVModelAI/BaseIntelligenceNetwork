import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import CodeDisplay from './code-display'; // Adjust the import path as needed

// import useTypingEffect from '~/hooks/use-typing-effect';

// Define the types for the CodeBlock props
interface CodeBlockProps {
    node: any; // Adjust the type based on actual use if available
    inline: boolean;
    className?: string;
    children: React.ReactNode;
}

// Define the CodeBlock component with TypeScript
const CodeBlock: React.FC<CodeBlockProps> = ({ inline, className, children, ...props }) => {
    const language = className?.replace(/language-/, '') ?? 'javascript';
    const codeString = String(children).replace(/\n$/, '');

    // Determine if the code block has more than one line
    const isMultiLine = codeString.includes('\n');

     // Function to determine if the code represents a link
    const isLink = (code: string) => {
        return /^(https?:\/\/|www\.)[^\s]+/.test(code);
    };

    return !inline && isMultiLine ? (
        <CodeDisplay code={codeString} fileName={`${language}`} />
    ) : isLink(codeString) ? <a href={codeString} target='_blank' className={className}>
        {codeString}
    </a> : (
        <code className={`${className} bg-[#ddd] px-2 rounded text-[#333] py-0.5 text-xs md:text-sm`} {...props}>
            {children}
        </code>
    );
};

// Define the types for the MarkdownText props
interface MarkdownTextProps {
    content: string;
}

// Define the MarkdownText component with TypeScript
const MarkdownText: React.FC<MarkdownTextProps> = ({ content }) => {
    // const tex = showTyping ? useTypingEffect(content, 1) : content;
    return (
        <div className="markdown-content prose prose-sm md:prose-md font-coinbase font-medium text-sm">
            <ReactMarkdown
                components={{
                    code: CodeBlock as any, // Cast CodeBlock to React.ElementType
                }}
                remarkPlugins={[remarkGfm]} // Add remarkGfm for GitHub Flavored Markdown support
                className={""}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownText;

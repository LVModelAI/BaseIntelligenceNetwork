import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, className = '', ...props }, ref) => {
        const buttonClass = `custom-button p-2 font-coinbase font-medium text-xs md:text-sm ${className}`;
        
        return (
            <button className={buttonClass} ref={ref} {...props}>
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button'; 

export default Button;


export const TextButton = ({className='', children, ...props}: ButtonProps) => {
    const buttonClass = `relative flex nav-ripple px-8 py-3 text-secondary font-mono text-base md:text-lg  uppercase rounded-lg border border-[#baa2ff]/10 hover:border-white/10 ${className}`;
    
    return (
        <button className={buttonClass} {...props}>
            {children}
        </button>
    )
}
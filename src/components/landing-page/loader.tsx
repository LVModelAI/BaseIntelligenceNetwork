import React from 'react'
import { BiLoader } from 'react-icons/bi'

const Loader = () => {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <BiLoader className="text-base md:text-[20px] md:translate-x-0.5 animate-rotate" />
        </div>
    )
}

export default Loader
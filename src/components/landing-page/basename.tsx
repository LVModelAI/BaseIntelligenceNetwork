import { Address,Avatar, Identity, Name } from '@coinbase/onchainkit/identity';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import Image from 'next/image';
import { base } from 'viem/chains';

import Loader from './loader';

interface DisplayBasenameProps {
    address: `0x${string}` | undefined;
}

export function Basenames({ address }: DisplayBasenameProps) {
    const { open } = useWeb3Modal();

    return (
        <div onClick={() => open({ view: 'Account' })} style={{ alignItems: 'center', cursor: 'pointer', display: 'inline-flex' }}>
            <Identity
                address={address}
                chain={base}
                className='font-coinbase bg-[#F7F9FC] hover:bg-[#f1f8ff] md:py-1 pl-1.5 md:pr-5 rounded-full border border-[#d5dbe5] transition-all duration-200 cursor-pointer  text-[#636d6d] space-x-1 md:space-x-4'
                schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
            >
                <Avatar 
                    address={address} 
                    defaultComponent={
                        <Image 
                            src={`https://api.multiavatar.com/${address}.svg`} 
                            alt='icon' 
                            width={1000} 
                            height={1000} 
                            className='w-auto h-auto' 
                        />
                    } 
                    chain={base} 
                    loadingComponent={<Loader />}
                    className='w-8 md:w-12 aspect-square'
                />
                <Name className='text-tertiary hidden md:block' address={address} chain={base} />
                <Address className='font-bold md:font-normal w-10 md:w-auto truncate' />
            </Identity>
        </div>
    );
}
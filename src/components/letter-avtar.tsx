import Image from "next/image";

interface LetterAvatarProps {
    name: string;
};

const LetterAvatar: React.FC<LetterAvatarProps> = ({ name }: LetterAvatarProps): React.ReactNode => {
    return (
        <Image 
            src={`https://ui-avatars.com/api/?background=random&length=1&font-size=0.60&name=${name.split(" ").join("+")}`} 
            alt="profile" 
            className="rounded-full mr-2"
            width={24} 
            height={24} 
        /> 
    );
};

export default LetterAvatar;
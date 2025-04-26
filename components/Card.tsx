'use client';

import React from 'react';

type CardProps = {
    imageSrc: string;
    isFlipped: boolean;
    isJustMatched?: boolean;
    onClick: () => void;
};

const Card = ({ imageSrc, isFlipped, isJustMatched = false, onClick }: CardProps) => {
    return (
        <div
            className={`relative w-full aspect-[4/4] cursor-pointer perspective rounded-md ${
                isJustMatched ? 'ring-4 ring-green-600' : ''
            }`}
            onClick={onClick}
        >
            <div
                className={`absolute w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
                    isFlipped ? 'rotate-y-180' : ''
                }`}
            >
                {/* Back of card */}
                <div
                    className="absolute w-full h-full backface-hidden bg-gray-300 flex items-center justify-center rounded-md">
                    ?
                </div>

                {/* Front of card */}
                <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-md overflow-hidden">
                    <img src={imageSrc} alt="Card image" className="w-full h-full object-cover"/>
                </div>
            </div>
        </div>
    );
};

export default Card;

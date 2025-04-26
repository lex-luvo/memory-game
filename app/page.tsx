'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/Card';
import { shuffleArray } from '@/utils/shuffle';

const IMAGES = [
    'img1', 'img2', 'img3', 'img4', 'img5', 'img6',
    'img7', 'img8', 'img9', 'img10', 'img11', 'img12',
    'img13', 'img14', 'img15', 'img16'
];

const MemoryGamePage = () => {
    const [gridSize, setGridSize] = useState<[number, number]>([2, 2]);
    const [selectedGridSize, setSelectedGridSize] = useState<[number, number]>([2, 2]);
    const [cards, setCards] = useState<string[]>([]);
    const [flipped, setFlipped] = useState<number[]>([]);
    const [matched, setMatched] = useState<number[]>([]);
    const [timer, setTimer] = useState(0);
    const [flipCount, setFlipCount] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [justMatched, setJustMatched] = useState<number[]>([]);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning) {
            interval = setInterval(() => {
                setTimer((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    const startGame = () => {
        const [rows, cols] = selectedGridSize;
        const totalCards = rows * cols;
        const selectedImages = shuffleArray([...IMAGES]).slice(0, totalCards / 2);
        const duplicatedImages = shuffleArray([...selectedImages, ...selectedImages]);

        setCards(duplicatedImages);
        setFlipped([]);
        setMatched([]);
        setTimer(0);
        setFlipCount(0);
        setIsRunning(true);
        setGridSize([rows, cols]);
    };

    const handleFlip = (index: number) => {
        if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

        setFlipped((prev) => [...prev, index]);
        setFlipCount((prev) => prev + 1);
    };

    useEffect(() => {
        if (flipped.length === 2) {
            const [first, second] = flipped;
            if (cards[first] === cards[second]) {
                setMatched((prev) => [...prev, first, second]);
                setJustMatched([first, second]);

                setTimeout(() => {
                    setJustMatched([]);
                    setFlipped([]);
                }, 500);
            } else {
                setTimeout(() => {
                    setFlipped([]);
                }, 800);
            }
        }
    }, [flipped, cards]);

    useEffect(() => {
        const [rows, cols] = gridSize;
        if (matched.length === rows * cols) {
            setIsRunning(false);
            setTimeout(() => {
                setGameOver(true);
            }, 500);
        }
    }, [matched, gridSize, timer, flipCount]);

    const restartGame = () => {
        setGameOver(false);
        setTimer(0);
        setFlipCount(0);
        setCards([]);
        setFlipped([]);
        setMatched([]);
        setIsRunning(false);
    };

    const handleGridChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [x, y] = e.target.value.split(',').map(Number) as [number, number];
        setSelectedGridSize([x, y]);
    };

    return (
        <div className="min-h-screen p-6 flex flex-col items-center justify-start gap-6 bg-gradient-to-b from-red-300 to-black">
            <div className="flex items-center gap-4">
                <label htmlFor="grid-layout" className="font-semibold text-lg">Configure the grid:</label>
                <select id="grid-layout" className="border p-2 rounded cursor-pointer" onChange={handleGridChange}>
                    <optgroup label="2 Rows">
                        <option value="2,2">2x2</option>
                    </optgroup>
                    <optgroup label="3 rows">
                        <option value="3,4">3x4</option>
                    </optgroup>
                    <optgroup label="4 Rows">
                        <option value="4,4">4x4</option>
                    </optgroup>
                </select>
                <button onClick={startGame} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 cursor-pointer">
                    Start
                </button>
            </div>

            <div className="flex gap-8">
                <div className="font-medium">Seconds: {timer}</div>
                <div className="font-medium">Flips: {flipCount}</div>
            </div>

            <div
                className="grid gap-4"
                style={{
                    gridTemplateColumns: `repeat(${gridSize[1]}, minmax(0, 1fr))`,
                    width: 'min(90%, 450px)',
                }}
            >
                {cards.map((imageName, index) => (
                    <Card
                        key={index}
                        imageSrc={`/images/${imageName}.jpg`}
                        isFlipped={flipped.includes(index) || matched.includes(index)}
                        isJustMatched={justMatched.includes(index)}
                        onClick={() => handleFlip(index)}
                    />
                ))}
            </div>

            {gameOver && (
                <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center text-white z-50">
                    <h1 className="text-3xl font-bold mb-4 text-center">
                        🎉 Congratulations! <br />
                        You completed the game in {timer} seconds with {flipCount} flips.
                    </h1>
                    <button
                        onClick={restartGame}
                        className="mt-6 px-6 py-3 bg-gray-800 rounded-lg hover:bg-black transition cursor-pointer"
                    >
                        Play Again
                    </button>
                </div>
            )}
        </div>
    );
};

export default MemoryGamePage;

import React, { useState, useEffect, useCallback } from 'react';
import { Play, RotateCcw, Monitor, Users } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { FAQ } from './FAQ';

export const SnakeGame = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState({ x: 5, y: 5 });
    const [dir, setDir] = useState({ x: 1, y: 0 });
    const [gameOver, setGameOver] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);

    const faqs = [
        {
            question: {
                en: 'How do I control the snake?',
                zh: '如何控制蛇？'
            },
            answer: {
                en: 'Use arrow keys on your keyboard or swipe on touch devices to change direction. Eat food to grow and avoid hitting walls or yourself.',
                zh: '使用键盘上的方向键或在触摸设备上滑动来改变方向。吃食物来成长，避免撞墙或撞到自己。'
            }
        },
        {
            question: {
                en: 'What are the difficulty levels?',
                zh: '难度级别是什么？'
            },
            answer: {
                en: 'Easy mode has slower speed for beginners. Medium is balanced. Hard mode is fast-paced for experienced players seeking a challenge.',
                zh: '简单模式速度较慢，适合初学者。中等模式平衡。困难模式节奏快，适合寻求挑战的资深玩家。'
            }
        },
        {
            question: {
                en: 'Is there a high score system?',
                zh: '有高分系统吗？'
            },
            answer: {
                en: 'Your current score is displayed during gameplay. Try to beat your personal best! The game ends when you hit a wall or yourself.',
                zh: '游戏过程中会显示当前分数。尝试打破您的个人最佳记录！当您撞墙或撞到自己时游戏结束。'
            }
        }
    ];
    
    const gridSize = 20;

    const speeds = {
        easy: 150,
        medium: 100,
        hard: 60
    };

    const resetGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setFood({ x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) });
        setDir({ x: 1, y: 0 });
        setGameOver(false);
        setIsPlaying(true);
        setScore(0);
    };

    const moveSnake = useCallback(() => {
        if (!isPlaying || gameOver) return;

        setSnake(prev => {
            const head = prev[0];
            const newHead = { x: head.x + dir.x, y: head.y + dir.y };

            // Check walls
            if (difficulty === 'easy') {
                if (newHead.x >= gridSize) newHead.x = 0;
                if (newHead.x < 0) newHead.x = gridSize - 1;
                if (newHead.y >= gridSize) newHead.y = 0;
                if (newHead.y < 0) newHead.y = gridSize - 1;
            } else {
                if (newHead.x >= gridSize || newHead.x < 0 || newHead.y >= gridSize || newHead.y < 0) {
                    setGameOver(true);
                    setIsPlaying(false);
                    return prev;
                }
            }

            // Check self collision
            if (prev.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
                setGameOver(true);
                setIsPlaying(false);
                return prev;
            }

            const newSnake = [newHead, ...prev];
            
            // Check food
            if (newHead.x === food.x && newHead.y === food.y) {
                setScore(s => s + 10);
                setFood({ x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) });
            } else {
                newSnake.pop();
            }

            return newSnake;
        });
    }, [dir, food, difficulty, isPlaying, gameOver]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
            setDir(prev => {
                switch (e.key) {
                    case 'ArrowUp': return prev.y !== 1 ? { x: 0, y: -1 } : prev;
                    case 'ArrowDown': return prev.y !== -1 ? { x: 0, y: 1 } : prev;
                    case 'ArrowLeft': return prev.x !== 1 ? { x: -1, y: 0 } : prev;
                    case 'ArrowRight': return prev.x !== -1 ? { x: 1, y: 0 } : prev;
                    default: return prev;
                }
            });
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        const interval = setInterval(moveSnake, speeds[difficulty]);
        return () => clearInterval(interval);
    }, [moveSnake, difficulty]);

    return (
        <div className="flex flex-col items-center space-y-6">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6 w-full max-w-[400px]">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {isZh
                        ? '贪吃蛇游戏支持键盘方向键或触摸滑动控制。提供简单、中等、困难三种难度，简单模式支持穿墙。吃食物成长，避免撞墙或撞到自己。适用于休闲娱乐、反应训练、压力释放等场景。尝试打破您的个人最佳记录！'
                        : 'The snake game supports keyboard arrow keys or touch swipe controls. Offers easy, medium, and hard difficulty levels, with easy mode supporting wall wrapping. Eat food to grow, avoid hitting walls or yourself. Suitable for entertainment, reaction training, stress relief, and other scenarios. Try to beat your personal best record!'}
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 w-full">
                <div className="p-3 bg-secondary-site rounded-xl border border-border-site font-mono flex-1 text-center font-bold">
                    {lang === 'zh' ? '得分: ' : 'Score: '}{score}
                </div>
                <div className="flex gap-2 p-1 bg-secondary-site rounded-xl border border-border-site">
                    {(['easy', 'medium', 'hard'] as const).map(level => (
                        <button
                            key={level}
                            onClick={() => { setDifficulty(level); setGameOver(false); setIsPlaying(false); setScore(0); }}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${difficulty === level ? 'bg-card-bg text-primary shadow-sm' : 'text-text-site/50'}`}
                        >
                            {level}
                        </button>
                    ))}
                </div>
            </div>

            <div 
                className="relative bg-card-bg border-2 border-border-site rounded-xl overflow-hidden shadow-inner"
                style={{ width: 'min(100%, 400px)', aspectRatio: '1/1' }}
            >
                {/* Grid rendering via percentage mapping avoids tons of DOM nodes */}
                <div 
                    className="absolute bg-green-500 rounded-sm transition-all duration-75"
                    style={{ 
                        left: `${(food.x / gridSize) * 100}%`, top: `${(food.y / gridSize) * 100}%`, 
                        width: `${100 / gridSize}%`, height: `${100 / gridSize}%` 
                    }}
                />
                {snake.map((seg, i) => (
                    <div 
                        key={i}
                        className={`absolute rounded-sm transition-all duration-75 ${i === 0 ? 'bg-primary' : 'bg-primary/70'}`}
                        style={{ 
                            left: `${(seg.x / gridSize) * 100}%`, top: `${(seg.y / gridSize) * 100}%`, 
                            width: `${100 / gridSize}%`, height: `${100 / gridSize}%` 
                        }}
                    />
                ))}

                {(!isPlaying || gameOver) && (
                    <div className="absolute inset-0 bg-bg-site/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
                        {gameOver ? (
                            <>
                                <h3 className="text-3xl font-bold mb-2">{lang === 'zh' ? '游戏结束' : 'Game Over'}</h3>
                                <p className="mb-6">{lang === 'zh' ? '最终得分: ' : 'Final Score: '}{score}</p>
                                <button onClick={resetGame} className="px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2">
                                    <RotateCcw className="w-5 h-5" /> {lang === 'zh' ? '重新开始' : 'Play Again'}
                                </button>
                            </>
                        ) : (
                            <button onClick={resetGame} className="px-8 py-4 bg-primary text-white rounded-xl font-bold flex items-center gap-3 text-lg hover:scale-105 transition-transform shadow-lg">
                                <Play className="w-6 h-6 fill-current" /> {lang === 'zh' ? '开始游戏' : 'Start Game'}
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Mobile Controls */}
            <div className="grid grid-cols-3 gap-2 w-48 md:hidden">
                <div />
                <button onClick={() => setDir({ x: 0, y: -1 })} className="bg-secondary-site p-4 rounded-xl flex items-center justify-center active:bg-border-site">↑</button>
                <div />
                <button onClick={() => setDir({ x: -1, y: 0 })} className="bg-secondary-site p-4 rounded-xl flex items-center justify-center active:bg-border-site">←</button>
                <button onClick={() => setDir({ x: 0, y: 1 })} className="bg-secondary-site p-4 rounded-xl flex items-center justify-center active:bg-border-site">↓</button>
                <button onClick={() => setDir({ x: 1, y: 0 })} className="bg-secondary-site p-4 rounded-xl flex items-center justify-center active:bg-border-site">→</button>
            </div>

            <FAQ faqs={faqs} />
        </div>
    );
};

export const GobangGame = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';
    const [mode, setMode] = useState<'ai' | 'pvp'>('ai');
    // 0: empty, 1: black (player 1), 2: white (AI or player 2)
    const [board, setBoard] = useState<number[][]>(Array(19).fill(Array(19).fill(0)));
    const [difficulty, setDifficulty] = useState<'easy' | 'hard'>('easy');

    const faqs = [
        {
            question: {
                en: 'How do I win?',
                zh: '如何获胜？'
            },
            answer: {
                en: 'Get five of your stones in a row (horizontally, vertically, or diagonally) to win. Black (player 1) moves first.',
                zh: '将您的五颗棋子连成一线（水平、垂直或对角线）即可获胜。黑棋（玩家 1）先手。'
            }
        },
        {
            question: {
                en: 'How smart is the AI?',
                zh: 'AI 有多聪明？'
            },
            answer: {
                en: 'The AI uses heuristic evaluation to find the best moves. Easy mode is beginner-friendly, while hard mode provides a challenging opponent.',
                zh: 'AI 使用启发式评估来寻找最佳移动。简单模式适合初学者，困难模式提供具有挑战性的对手。'
            }
        },
        {
            question: {
                en: 'Can I play with a friend?',
                zh: '可以和朋友一起玩吗？'
            },
            answer: {
                en: 'Yes! Switch to PvP mode to play locally with another person on the same device. Perfect for passing the device back and forth.',
                zh: '可以！切换到 PvP 模式可以在同一设备上与另一个人本地游戏。非常适合来回传递设备。'
            }
        }
    ];
    const [gameOver, setGameOver] = useState<{isOver: boolean, winner: number}>({isOver: false, winner: 0});
    const [turn, setTurn] = useState<number>(1);

    const boardSize = 19;

    const checkWin = (row: number, col: number, player: number, currentBoard: number[][]) => {
        const dirs = [[1, 0], [0, 1], [1, 1], [1, -1]];
        for (let [dx, dy] of dirs) {
            let count = 1;
            for (let i = 1; i < 5; i++) {
                const r = row + i * dx, c = col + i * dy;
                if (r < 0 || r >= boardSize || c < 0 || c >= boardSize || currentBoard[r][c] !== player) break;
                count++;
            }
            for (let i = 1; i < 5; i++) {
                const r = row - i * dx, c = col - i * dy;
                if (r < 0 || r >= boardSize || c < 0 || c >= boardSize || currentBoard[r][c] !== player) break;
                count++;
            }
            if (count >= 5) return true;
        }
        return false;
    };

    const aiPlay = (currentBoard: number[][]) => {
        if (gameOver.isOver) return;

        let bestScore = -Infinity;
        let move = { r: -1, c: -1 };
        const candidates = [];

        // Simple heuristic evaluate
        for (let r = 0; r < boardSize; r++) {
            for (let c = 0; c < boardSize; c++) {
                if (currentBoard[r][c] !== 0) continue;
                
                // Extremely simple eval for demo: count adjacent stones
                let attackScore = evaluatePoint(r, c, 2, currentBoard);
                let defenseScore = evaluatePoint(r, c, 1, currentBoard);
                
                let score = attackScore + defenseScore;
                candidates.push({ r, c, score });
                
                if (score > bestScore) {
                    bestScore = score;
                    move = { r, c };
                }
            }
        }

        if (difficulty === 'easy') {
            // Pick randomly from top best moves to make it easier
            candidates.sort((a, b) => b.score - a.score);
            const pool = candidates.slice(0, Math.min(5, candidates.length));
            move = pool[Math.floor(Math.random() * pool.length)];
        }

        if (move.r !== -1) {
            const newBoard = currentBoard.map(row => [...row]);
            newBoard[move.r][move.c] = 2;
            setBoard(newBoard);
            if (checkWin(move.r, move.c, 2, newBoard)) {
                setGameOver({ isOver: true, winner: 2 });
            } else {
                setTurn(1);
            }
        }
    };

    const evaluatePoint = (row: number, col: number, player: number, currentBoard: number[][]) => {
        let score = 0;
        const dirs = [[1, 0], [0, 1], [1, 1], [1, -1]];
        for (let [dx, dy] of dirs) {
            let count = 1;
            let blocks = 0;
            // forward
            let r = row + dx, c = col + dy;
            while(r >= 0 && r < boardSize && c >= 0 && c < boardSize && currentBoard[r][c] === player) { count++; r+=dx; c+=dy; }
            if (r < 0 || r >= boardSize || c < 0 || c >= boardSize || currentBoard[r][c] !== 0) blocks++;
            // backward
            r = row - dx; c = col - dy;
            while(r >= 0 && r < boardSize && c >= 0 && c < boardSize && currentBoard[r][c] === player) { count++; r-=dx; c-=dy; }
            if (r < 0 || r >= boardSize || c < 0 || c >= boardSize || currentBoard[r][c] !== 0) blocks++;

            if (count >= 5) score += 100000;
            else if (count === 4 && blocks === 0) score += 10000;
            else if (count === 4 && blocks === 1) score += 1000;
            else if (count === 3 && blocks === 0) score += 1000;
            else if (count === 3 && blocks === 1) score += 100;
            else if (count === 2 && blocks === 0) score += 100;
        }
        return score;
    };

    const handlePlayerClick = (r: number, c: number) => {
        if (gameOver.isOver || board[r][c] !== 0) return;
        if (mode === 'ai' && turn !== 1) return; // Prevent clicking during AI turn
        
        const newBoard = board.map(row => [...row]);
        newBoard[r][c] = turn;
        setBoard(newBoard);
        
        if (checkWin(r, c, turn, newBoard)) {
            setGameOver({ isOver: true, winner: turn });
        } else {
            if (mode === 'ai') {
                setTurn(2);
                setTimeout(() => aiPlay(newBoard), 300);
            } else {
                setTurn(turn === 1 ? 2 : 1);
            }
        }
    };

    const reset = () => {
        setBoard(Array(boardSize).fill(Array(boardSize).fill(0)));
        setGameOver({ isOver: false, winner: 0 });
        setTurn(1);
    };

    return (
        <div className="flex flex-col items-center space-y-6">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6 w-full max-w-2xl">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {isZh
                        ? '五子棋游戏支持与 AI 对战或本地双人对战。目标是将五颗棋子连成一线（水平、垂直或对角线）。AI 使用启发式评估寻找最佳移动，提供简单和困难两种难度。黑棋先手。适用于休闲娱乐、策略训练、棋艺练习等场景。'
                        : 'Gobang (Five in a Row) game supports playing against AI or local PvP. The goal is to get five stones in a row (horizontally, vertically, or diagonally). AI uses heuristic evaluation to find the best moves, offering easy and hard difficulty levels. Black moves first. Suitable for entertainment, strategy training, chess practice, and other scenarios.'}
                </p>
            </div>

            <div className="flex flex-wrap justify-between items-center w-full max-w-2xl gap-2">
                <div className="flex gap-2 bg-secondary-site p-1 rounded-xl">
                    <button 
                        onClick={() => { setMode('ai'); reset(); }}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${mode === 'ai' ? 'bg-card-bg text-primary shadow-sm' : 'text-text-site/50'}`}
                    >
                        <Monitor className="w-4 h-4"/> VS AI
                    </button>
                    <button 
                        onClick={() => { setMode('pvp'); reset(); }}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${mode === 'pvp' ? 'bg-card-bg text-primary shadow-sm' : 'text-text-site/50'}`}
                    >
                        <Users className="w-4 h-4"/> PvP
                    </button>
                </div>

                <div className="text-sm font-bold bg-secondary-site px-4 py-2 rounded-xl flex-1 text-center min-w-[120px]">
                    {mode === 'ai' 
                        ? (turn === 1 ? (lang === 'zh' ? '你的回合 (黑)' : 'Your Turn (Black)') : (lang === 'zh' ? 'AI 思考中...' : 'AI Thinking...'))
                        : (turn === 1 ? (lang === 'zh' ? '黑方 (黑1)' : 'Black Turn') : (lang === 'zh' ? '白方 (白2)' : 'White Turn'))}
                </div>

                {mode === 'ai' && (
                    <div className="flex gap-2 p-1 bg-secondary-site rounded-xl border border-border-site">
                        {(['easy', 'hard'] as const).map(level => (
                            <button
                                key={level}
                                onClick={() => { setDifficulty(level); reset(); }}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${difficulty === level ? 'bg-card-bg text-primary shadow-sm' : 'text-text-site/50'}`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="relative bg-[#E0B579] p-2 md:p-4 rounded-xl shadow-inner border-[4px] border-[#A2723A] aspect-square w-full max-w-2xl" style={{boxSizing: 'border-box'}}>
                <div className="w-full h-full grid grid-cols-19 grid-rows-19 gap-0 relative isolate">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 pointer-events-none p-[2.63%]">
                        <div className="w-full h-full border border-black/30 flex flex-col justify-between">
                            {Array(18).fill(0).map((_, i) => <div key={i} className="w-full border-t border-black/30" />)}
                        </div>
                        <div className="w-full h-full border border-black/30 flex justify-between absolute inset-0 p-[2.63%]">
                            {Array(18).fill(0).map((_, i) => <div key={i} className="h-full border-l border-black/30" />)}
                        </div>
                    </div>
                    {/* Intersections/Cells */}
                    {board.map((row, r) => row.map((cell, c) => (
                        <div
                            key={`${r}-${c}`}
                            onClick={() => handlePlayerClick(r, c)}
                            className="w-[5.26%] h-[5.26%] absolute flex items-center justify-center translate-x-[-50%] translate-y-[-50%]"
                            style={{ left: `${c * (100/18)}%`, top: `${r * (100/18)}%` }}
                        >
                            <div className="w-[85%] h-[85%] rounded-full cursor-pointer hover:bg-black/10 transition-colors flex items-center justify-center">
                                {cell !== 0 && (
                                    <div className={`w-full h-full rounded-full shadow-[1px_1px_3px_rgba(0,0,0,0.4)] ${cell === 1 ? 'bg-black' : 'bg-white'}`} />
                                )}
                            </div>
                        </div>
                    )))}
                </div>

                {gameOver.isOver && (
                    <div className="absolute inset-0 bg-bg-site/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10 rounded-lg">
                        <h3 className="text-3xl font-bold mb-6">
                            {mode === 'ai' 
                                ? (gameOver.winner === 1 ? (lang === 'zh' ? '你赢了！🎉' : 'You Win! 🎉') : (lang === 'zh' ? 'AI 获胜 🤖' : 'AI Wins 🤖'))
                                : (gameOver.winner === 1 ? (lang === 'zh' ? '黑方获胜！🎉' : 'Black Wins! 🎉') : (lang === 'zh' ? '白方获胜！🎉' : 'White Wins! 🎉'))}
                        </h3>
                        <button onClick={reset} className="px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2">
                            <RotateCcw className="w-5 h-5" /> {lang === 'zh' ? '再来一局' : 'Play Again'}
                        </button>
                    </div>
                )}
            </div>
            
            <p className="text-xs text-text-site/50 max-w-sm text-center">
                {lang === 'zh' 
                    ? '纯本地浏览器端 AI，完美保护服务器配置零消耗。尝试在困难模式下击败它！' 
                    : 'Pure client-side AI, zero server cost. Try to beat it on Hard mode!'}
            </p>

            <FAQ faqs={faqs} />
        </div>
    );
};

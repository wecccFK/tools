import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Play, RotateCcw, Monitor, Users } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Chess } from 'chess.js';
import { FAQ } from './FAQ';

// --- INTERNATIONAL CHESS ---
const pieceUnicode: Record<string, string> = {
    'p': '♟', 'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚',
    'P': '♙', 'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔'
};

export const InternationalChess = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';
    const [game, setGame] = useState(new Chess());
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
    const [mode, setMode] = useState<'ai' | 'pvp'>('ai');
    
    // UI states
    const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
    const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
    const [fen, setFen] = useState(game.fen());

    const faqs = [
        {
            question: {
                en: 'How does the AI work?',
                zh: 'AI 如何工作？'
            },
            answer: {
                en: 'The AI uses the minimax algorithm with alpha-beta pruning to evaluate board positions. Difficulty levels control the search depth for smarter or faster play.',
                zh: 'AI 使用带有 alpha-beta 剪枝的极小化极大算法来评估棋盘位置。难度级别控制搜索深度，以实现更智能或更快的游戏。'
            }
        },
        {
            question: {
                en: 'Can I play against a friend?',
                zh: '我可以和朋友一起玩吗？'
            },
            answer: {
                en: 'Yes! Switch to PvP mode to play locally with another person on the same device. Perfect for passing the device back and forth.',
                zh: '可以！切换到 PvP 模式可以在同一设备上与另一个人本地游戏。非常适合来回传递设备。'
            }
        },
        {
            question: {
                en: 'What are the rules?',
                zh: '规则是什么？'
            },
            answer: {
                en: 'We follow standard international chess rules including castling, en passant, and pawn promotion. The game ends in checkmate, stalemate, or resignation.',
                zh: '我们遵循标准国际象棋规则，包括王车易位、吃过路兵和兵升变。游戏以将死、逼和或认输结束。'
            }
        }
    ];
    
    // AI Logic
    const evaluateBoard = useCallback((chess: any) => {
        let score = 0;
        const pieceValues: Record<string, number> = { p: 10, n: 30, b: 30, r: 50, q: 90, k: 900 };
        const board = chess.board();
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = board[i][j];
                if (piece) {
                    const val = pieceValues[piece.type];
                    score += piece.color === 'w' ? val : -val;
                }
            }
        }
        return score;
    }, []);

    const minimax = useCallback((chess: any, depth: number, alpha: number, beta: number, isMaximizing: boolean): number => {
        if (depth === 0) return evaluateBoard(chess);
        const moves = chess.moves();
        if (moves.length === 0) {
            if (chess.isCheck()) return isMaximizing ? -9999 : 9999;
            return 0;
        }

        if (isMaximizing) {
            let maxEval = -Infinity;
            for (const move of moves) {
                chess.move(move);
                const ev = minimax(chess, depth - 1, alpha, beta, false);
                chess.undo();
                maxEval = Math.max(maxEval, ev);
                alpha = Math.max(alpha, ev);
                if (beta <= alpha) break;
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (const move of moves) {
                chess.move(move);
                const ev = minimax(chess, depth - 1, alpha, beta, true);
                chess.undo();
                minEval = Math.min(minEval, ev);
                beta = Math.min(beta, ev);
                if (beta <= alpha) break;
            }
            return minEval;
        }
    }, [evaluateBoard]);

    const makeAIMove = useCallback(() => {
        if (game.isGameOver()) return;
        const moves = game.moves({ verbose: true });
        if (moves.length === 0) return;

        // Shuffle moves to add variety
        moves.sort(() => Math.random() - 0.5);

        let chosenMove = moves[0];

        if (difficulty === 'easy') {
            // pure random
            chosenMove = moves[Math.floor(Math.random() * moves.length)];
        } else {
            const depth = difficulty === 'medium' ? 1 : 2; // Keep it lightweight in browser
            let minEval = Infinity;
            
            for (const move of moves) {
                game.move(move.san);
                const ev = minimax(game, depth, -Infinity, Infinity, true); // AI is minimizing (Black)
                game.undo();
                if (ev < minEval) {
                    minEval = ev;
                    chosenMove = move;
                }
            }
        }

        game.move(chosenMove.san);
        setFen(game.fen());
    }, [game, difficulty, minimax]);

    useEffect(() => {
        if (mode === 'ai' && game.turn() === 'b' && !game.isGameOver()) {
            const timeout = setTimeout(() => {
                makeAIMove();
            }, 300);
            return () => clearTimeout(timeout);
        }
    }, [fen, mode, game, makeAIMove]);

    // Handle clicks
    const onSquareClick = (sq: string) => {
        if (game.isGameOver()) return;
        if (mode === 'ai' && game.turn() === 'b') return; // ignore clicks during AI turn

        if (selectedSquare) {
            // Try to move
            try {
                const moveResult = game.move({
                    from: selectedSquare,
                    to: sq,
                    promotion: 'q' // auto promote to queen for simplicity
                });
                
                if (moveResult) {
                    setFen(game.fen());
                    setSelectedSquare(null);
                    setPossibleMoves([]);
                    return;
                }
            } catch (e) {
                // Invalid move, fall through to re-select
            }
        }

        const piece = game.get(sq);
        if (piece && piece.color === game.turn()) {
            setSelectedSquare(sq);
            const moves = game.moves({ square: sq, verbose: true });
            setPossibleMoves(moves.map(m => m.to));
        } else {
            setSelectedSquare(null);
            setPossibleMoves([]);
        }
    };

    const resetGame = () => {
        const newGame = new Chess();
        setGame(newGame);
        setFen(newGame.fen());
        setSelectedSquare(null);
        setPossibleMoves([]);
    };

    // Render Board
    const board = game.board();
    const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    return (
        <div className="flex flex-col items-center space-y-6">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6 w-full max-w-[400px]">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {isZh
                        ? '国际象棋游戏支持与 AI 对战或本地双人对战。AI 使用极小化极大算法和 alpha-beta 剪枝，提供简单、中等、困难三种难度。遵循标准国际象棋规则，包括王车易位、吃过路兵和兵升变。适用于休闲娱乐、棋艺练习、策略学习等场景。'
                        : 'International chess game supports playing against AI or local PvP. AI uses minimax algorithm with alpha-beta pruning, offering easy, medium, and hard difficulty levels. Follows standard international chess rules including castling, en passant, and pawn promotion. Suitable for entertainment, chess practice, strategy learning, and other scenarios.'}
                </p>
            </div>

            <div className="flex flex-wrap justify-between items-center w-full max-w-[400px]">
                <div className="flex gap-2 bg-secondary-site p-1 rounded-xl">
                    <button 
                        onClick={() => { setMode('ai'); resetGame(); }}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${mode === 'ai' ? 'bg-card-bg text-primary shadow-sm' : 'text-text-site/50'}`}
                    >
                        <Monitor className="w-4 h-4"/> VS AI
                    </button>
                    <button 
                        onClick={() => { setMode('pvp'); resetGame(); }}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${mode === 'pvp' ? 'bg-card-bg text-primary shadow-sm' : 'text-text-site/50'}`}
                    >
                        <Users className="w-4 h-4"/> PvP
                    </button>
                </div>
                
                {mode === 'ai' && (
                    <div className="flex gap-1 p-1 bg-secondary-site rounded-xl border border-border-site">
                        {(['easy', 'medium', 'hard'] as const).map(level => (
                            <button
                                key={level}
                                onClick={() => { setDifficulty(level); resetGame(); }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${difficulty === level ? 'bg-card-bg text-primary shadow-sm' : 'text-text-site/50'}`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="w-full max-w-[400px] aspect-square rounded-xl overflow-hidden border-4 border-border-site shadow-inner relative flex flex-col">
                {board.map((row, rIdx) => (
                    <div key={rIdx} className="flex-1 flex w-full">
                        {row.map((cell, cIdx) => {
                            const isDark = (rIdx + cIdx) % 2 === 1;
                            const sq = `${columns[cIdx]}${8 - rIdx}` as string;
                            const isSelected = selectedSquare === sq;
                            const isPossibleMove = possibleMoves.includes(sq);
                            
                            return (
                                <div 
                                    key={cIdx} 
                                    onClick={() => onSquareClick(sq)}
                                    className={`flex-1 flex items-center justify-center relative cursor-pointer
                                        ${isDark ? 'bg-[#769656]' : 'bg-[#eeeed2]'} 
                                        ${isSelected ? 'after:absolute after:inset-0 after:bg-yellow-400/50' : ''}
                                    `}
                                >
                                    {isPossibleMove && (
                                        <div className="absolute w-1/3 h-1/3 rounded-full bg-black/20 z-10" />
                                    )}
                                    {cell && (
                                        <span 
                                            className="text-4xl leading-none z-20 drop-shadow-sm select-none"
                                            style={{ color: cell.color === 'w' ? '#fff' : '#000', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
                                            // Fallback characters mapping
                                        >
                                            {pieceUnicode[cell.color === 'w' ? cell.type.toUpperCase() : cell.type.toLowerCase()]}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}

                {game.isGameOver() && (
                    <div className="absolute inset-0 bg-bg-site/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-30">
                        <h3 className="text-3xl font-bold mb-2">
                            {game.isCheckmate() ? (lang === 'zh' ? '将死！' : 'Checkmate!') : (lang === 'zh' ? '平局' : 'Draw')}
                        </h3>
                        {game.isCheckmate() && (
                            <p className="mb-6 font-bold text-lg text-primary">
                                {game.turn() === 'w' ? (lang === 'zh' ? '黑方获胜' : 'Black Wins') : (lang === 'zh' ? '白方获胜' : 'White Wins')}
                            </p>
                        )}
                        <button onClick={resetGame} className="px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2">
                            <RotateCcw className="w-5 h-5" /> {lang === 'zh' ? '再来一局' : 'Play Again'}
                        </button>
                    </div>
                )}
            </div>
            
            <p className="text-xs text-text-site/50 text-center font-medium max-w-sm">
                {game.isCheck() && !game.isGameOver() && <span className="text-red-500 font-bold block mb-1">Check!</span>}
                {lang === 'zh' 
                    ? '开源国际象棋引擎，享受纯前端计算的对弈。' 
                    : 'Powered by chess.js, enjoy seamless client-side chess.'}
            </p>

            <FAQ faqs={faqs} />
        </div>
    );
};


// --- CHINESE CHESS (XIANGQI) ---
type XQColor = 'r' | 'b';
type XQType = 'K' | 'A' | 'E' | 'H' | 'R' | 'C' | 'S';
type XQPiece = { type: XQType, color: XQColor } | null;

const initialXiangqiBoard: XQPiece[][] = [
    [{type:'R',color:'b'},{type:'H',color:'b'},{type:'E',color:'b'},{type:'A',color:'b'},{type:'K',color:'b'},{type:'A',color:'b'},{type:'E',color:'b'},{type:'H',color:'b'},{type:'R',color:'b'}],
    [null, null, null, null, null, null, null, null, null],
    [null, {type:'C',color:'b'}, null, null, null, null, null, {type:'C',color:'b'}, null],
    [{type:'S',color:'b'}, null, {type:'S',color:'b'}, null, {type:'S',color:'b'}, null, {type:'S',color:'b'}, null, {type:'S',color:'b'}],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [{type:'S',color:'r'}, null, {type:'S',color:'r'}, null, {type:'S',color:'r'}, null, {type:'S',color:'r'}, null, {type:'S',color:'r'}],
    [null, {type:'C',color:'r'}, null, null, null, null, null, {type:'C',color:'r'}, null],
    [null, null, null, null, null, null, null, null, null],
    [{type:'R',color:'r'},{type:'H',color:'r'},{type:'E',color:'r'},{type:'A',color:'r'},{type:'K',color:'r'},{type:'A',color:'r'},{type:'E',color:'r'},{type:'H',color:'r'},{type:'R',color:'r'}],
];

const pieceText = {
    r: { K: '帥', A: '仕', E: '相', H: '傌', R: '俥', C: '炮', S: '兵' },
    b: { K: '將', A: '士', E: '象', H: '馬', R: '車', C: '砲', S: '卒' }
};

export const ChineseChess = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';
    const [mode, setMode] = useState<'ai' | 'pvp'>('ai');
    const [difficulty, setDifficulty] = useState<'easy' | 'hard'>('easy');
    const [board, setBoard] = useState<XQPiece[][]>(JSON.parse(JSON.stringify(initialXiangqiBoard)));
    const [turn, setTurn] = useState<XQColor>('r');
    const [selected, setSelected] = useState<{r: number, c: number} | null>(null);

    const faqs = [
        {
            question: {
                en: 'How is Chinese Chess different?',
                zh: '中国象棋有什么不同？'
            },
            answer: {
                en: 'Chinese Chess (Xiangqi) has different pieces and movement rules compared to international chess. The river in the middle and palace restrictions add unique strategic elements.',
                zh: '中国象棋与国际象棋有不同的棋子和移动规则。中间的河和九宫格限制增加了独特的战略元素。'
            }
        },
        {
            question: {
                en: 'What are the piece movements?',
                zh: '棋子如何移动？'
            },
            answer: {
                en: 'Each piece has unique movements: Chariot moves like a rook, Horse moves in L-shape, Cannon jumps to capture, Elephant moves diagonally within territory, and pieces in the palace have restricted movement.',
                zh: '每个棋子都有独特的移动方式：车像国际象棋的车一样移动，马走日字，炮跳跃吃子，象在领地内斜走，九宫格内的棋子移动受限。'
            }
        },
        {
            question: {
                en: 'Can I play PvP?',
                zh: '可以玩 PvP 吗？'
            },
            answer: {
                en: 'Yes, switch to PvP mode to play locally with another person. Perfect for two players on the same device taking turns.',
                zh: '可以，切换到 PvP 模式可以与另一个人本地游戏。非常适合同一设备上的两名玩家轮流下棋。'
            }
        }
    ];
    const [gameOver, setGameOver] = useState<XQColor | null>(null);

    const isValidMove = (brd: XQPiece[][], fromR: number, fromC: number, toR: number, toC: number, color: XQColor) => {
        const target = brd[toR][toC];
        if (target && target.color === color) return false;
        const dx = toR - fromR;
        const dy = toC - fromC;
        const adx = Math.abs(dx);
        const ady = Math.abs(dy);
        const piece = brd[fromR][fromC];
        if (!piece) return false;
        
        if (piece.type === 'K') {
           if (adx + ady !== 1) return false;
           if (toC < 3 || toC > 5) return false;
           return color === 'r' ? toR > 6 : toR < 3;
        } else if (piece.type === 'A') {
           if (adx !== 1 || ady !== 1) return false;
           if (toC < 3 || toC > 5) return false;
           return color === 'r' ? toR > 6 : toR < 3;
        } else if (piece.type === 'E') {
           if (adx !== 2 || ady !== 2) return false;
           if ((color === 'r' && toR < 5) || (color === 'b' && toR > 4)) return false;
           if (brd[fromR + dx/2][fromC + dy/2]) return false; // block
           return true;
        } else if (piece.type === 'H') {
           if (!((adx===2 && ady===1)||(adx===1 && ady===2))) return false;
           if (adx === 2 && brd[fromR + dx/2][fromC]) return false; // block leg
           if (ady === 2 && brd[fromR][fromC + dy/2]) return false; // block leg
           return true;
        } else if (piece.type === 'R') {
           if (adx !== 0 && ady !== 0) return false;
           let count = 0;
           if (adx > 0) {
              for(let i=Math.min(fromR, toR)+1; i<Math.max(fromR, toR); i++) if(brd[i][fromC]) count++;
           } else {
              for(let i=Math.min(fromC, toC)+1; i<Math.max(fromC, toC); i++) if(brd[fromR][i]) count++;
           }
           return count === 0;
        } else if (piece.type === 'C') {
           if (adx !== 0 && ady !== 0) return false;
           let count = 0;
           if (adx > 0) {
              for(let i=Math.min(fromR, toR)+1; i<Math.max(fromR, toR); i++) if(brd[i][fromC]) count++;
           } else {
              for(let i=Math.min(fromC, toC)+1; i<Math.max(fromC, toC); i++) if(brd[fromR][i]) count++;
           }
           if (target) return count === 1;
           return count === 0;
        } else if (piece.type === 'S') {
           if (adx > 1 || ady > 1 || adx+ady !== 1) return false;
           if (color === 'r') {
              if (dx > 0) return false;
              if (fromR > 4 && ady > 0) return false;
              return true;
           } else {
              if (dx < 0) return false;
              if (fromR < 5 && ady > 0) return false;
              return true;
           }
        }
        return false;
    };

    const isGeneralFaceOff = (brd: XQPiece[][]) => {
        let rK = null, bK = null;
        for(let r=0; r<10; r++) {
            for(let c=0; c<9; c++) {
                if(brd[r][c]?.type === 'K') {
                    if (brd[r][c]?.color === 'r') rK = {r,c};
                    if (brd[r][c]?.color === 'b') bK = {r,c};
                }
            }
        }
        if (!rK || !bK || rK.c !== bK.c) return false;
        for(let r=bK.r+1; r<rK.r; r++) {
            if (brd[r][rK.c]) return false;
        }
        return true;
    };

    // AI Logic for Chinese Chess
    const getPieceValue = (piece: XQPiece, r: number) => {
        if (!piece) return 0;
        const baseValues = { K: 10000, R: 1000, C: 450, H: 400, E: 200, A: 200, S: 100 };
        let val = baseValues[piece.type];
        if (piece.type === 'S') {
            if (piece.color === 'r' && r < 5) val += 100;
            if (piece.color === 'b' && r > 4) val += 100;
        }
        return val;
    };

    const evaluateXiangqiBoard = (brd: XQPiece[][], aiColor: XQColor) => {
        let score = 0;
        for (let r=0; r<10; r++) {
            for (let c=0; c<9; c++) {
                const p = brd[r][c];
                if (p) {
                    const val = getPieceValue(p, r);
                    score += p.color === aiColor ? val : -val;
                }
            }
        }
        return score;
    };

    const getAllValidMoves = (brd: XQPiece[][], color: XQColor) => {
        const moves = [];
        for(let r=0; r<10; r++) {
            for(let c=0; c<9; c++) {
                if (brd[r][c]?.color === color) {
                    for(let tr=0; tr<10; tr++) {
                        for(let tc=0; tc<9; tc++) {
                            if (isValidMove(brd, r, c, tr, tc, color)) {
                                const tempTarget = brd[tr][tc];
                                const tempPiece = brd[r][c];
                                brd[tr][tc] = tempPiece;
                                brd[r][c] = null;
                                if (!isGeneralFaceOff(brd)) {
                                    moves.push({fromR: r, fromC: c, toR: tr, toC: tc, captured: tempTarget});
                                }
                                brd[r][c] = tempPiece;
                                brd[tr][tc] = tempTarget;
                            }
                        }
                    }
                }
            }
        }
        return moves;
    };

    const makeAIMove = useCallback(() => {
        if (gameOver) return;
        
        const moves = getAllValidMoves(board, 'b');
        if (moves.length === 0) return;

        moves.sort(() => Math.random() - 0.5); // Add variety

        let bestMove = moves[0];
        
        if (difficulty === 'easy') {
            // Greedy approach: try to capture the highest value piece, or random
            let bestScore = -Infinity;
            for (const move of moves) {
                const score = move.captured ? getPieceValue(move.captured, move.toR) : 0;
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = move;
                }
            }
        } else {
            // Hard: Minimax depth 2
            let maxEval = -Infinity;
            for (const move of moves) {
                const newBoard = board.map(row => [...row]);
                newBoard[move.toR][move.toC] = newBoard[move.fromR][move.fromC];
                newBoard[move.fromR][move.fromC] = null;
                
                if (move.captured?.type === 'K') {
                    bestMove = move;
                    break;
                }

                // Simulate player's worst reply
                const playerMoves = getAllValidMoves(newBoard, 'r');
                let minEval = Infinity;
                
                for (const pMove of playerMoves) {
                    const tempTarget = newBoard[pMove.toR][pMove.toC];
                    const tempPiece = newBoard[pMove.fromR][pMove.fromC];
                    if (tempTarget?.type === 'K') {
                        minEval = -100000;
                        break;
                    }
                    newBoard[pMove.toR][pMove.toC] = tempPiece;
                    newBoard[pMove.fromR][pMove.fromC] = null;
                    
                    const ev = evaluateXiangqiBoard(newBoard, 'b');
                    minEval = Math.min(minEval, ev);
                    
                    newBoard[pMove.fromR][pMove.fromC] = tempPiece;
                    newBoard[pMove.toR][pMove.toC] = tempTarget;
                }

                if (minEval > maxEval) {
                    maxEval = minEval;
                    bestMove = move;
                }
            }
        }

        const newBoard = board.map(row => [...row]);
        const targetPiece = newBoard[bestMove.toR][bestMove.toC];
        newBoard[bestMove.toR][bestMove.toC] = newBoard[bestMove.fromR][bestMove.fromC];
        newBoard[bestMove.fromR][bestMove.fromC] = null;
        
        setBoard(newBoard);
        setTurn('r');
        if (targetPiece?.type === 'K') {
            setGameOver('b');
        }
    }, [board, gameOver, difficulty]);

    useEffect(() => {
        if (mode === 'ai' && turn === 'b' && !gameOver) {
            const timeout = setTimeout(() => {
                makeAIMove();
            }, 300);
            return () => clearTimeout(timeout);
        }
    }, [turn, mode, gameOver, makeAIMove]);

    const handleClick = (r: number, c: number) => {
        if (gameOver) return;
        if (mode === 'ai' && turn === 'b') return; // block clicks during AI

        if (selected) {
            const piece = board[selected.r][selected.c];
            if (piece?.color === turn) {
                if (isValidMove(board, selected.r, selected.c, r, c, turn)) {
                    // clone board
                    const newBoard = board.map(row => [...row]);
                    const targetPiece = newBoard[r][c];
                    newBoard[r][c] = piece;
                    newBoard[selected.r][selected.c] = null;
                    
                    if (isGeneralFaceOff(newBoard)) {
                        // Invalid move, leaves general exposed
                        setSelected(null);
                        return;
                    }

                    setBoard(newBoard);
                    setSelected(null);
                    setTurn(turn === 'r' ? 'b' : 'r');

                    if (targetPiece?.type === 'K') {
                        setGameOver(turn); // current turn player wins
                    }
                } else if (board[r][c]?.color === turn) { // switch selection
                    setSelected({r, c});
                } else {
                    setSelected(null);
                }
            } else {
                setSelected(null);
            }
        } else {
            if (board[r][c]?.color === turn) {
                setSelected({r, c});
            }
        }
    };

    const reset = () => {
        setBoard(JSON.parse(JSON.stringify(initialXiangqiBoard)));
        setTurn('r');
        setSelected(null);
        setGameOver(null);
    };

    return (
        <div className="flex flex-col items-center space-y-6">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6 w-full max-w-[360px]">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {isZh
                        ? '中国象棋游戏支持与 AI 对战或本地双人对战。AI 使用评估函数和搜索算法，提供简单和困难两种难度。遵循中国象棋规则，包括马走日、象走田、炮隔山打等。棋盘包含河界和九宫格限制。适用于休闲娱乐、棋艺练习、策略学习等场景。'
                        : 'Chinese Chess (Xiangqi) game supports playing against AI or local PvP. AI uses evaluation function and search algorithms, offering easy and hard difficulty levels. Follows Chinese chess rules including horse L-shape movement, elephant diagonal movement, cannon jumping to capture. The board includes river and palace restrictions. Suitable for entertainment, chess practice, strategy learning, and other scenarios.'}
                </p>
            </div>

            <div className="flex flex-wrap justify-between items-center w-full max-w-[360px] gap-2">
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
                
                {mode === 'ai' && (
                    <div className="flex gap-1 p-1 bg-secondary-site rounded-xl border border-border-site">
                        {(['easy', 'hard'] as const).map(level => (
                            <button
                                key={level}
                                onClick={() => { setDifficulty(level); reset(); }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${difficulty === level ? 'bg-card-bg text-primary shadow-sm' : 'text-text-site/50'}`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Board Visuals */}
            <div 
                className="relative bg-[#E8C892] rounded-xl overflow-hidden shadow-xl p-4 border-[3px] border-[#8a5a2b]"
                style={{ width: 'min(100%, 380px)', aspectRatio: '9/10' }}
            >
                <div className="absolute inset-4 border-[2px] border-black/80">
                    <div className="grid grid-cols-8 grid-rows-9 h-full">
                        {Array(9).fill(0).map((_, rIdx) => 
                            Array(8).fill(0).map((_, cIdx) => (
                                <div key={`r${rIdx}-c${cIdx}`} className={`border-[1px] border-black/80 ${rIdx === 4 ? 'border-none' : ''}`} />
                            ))
                        )}
                    </div>
                </div>
                
                {/* Palace diagonals */}
                <svg className="absolute inset-4 pointer-events-none stroke-black/80" strokeWidth="2" style={{width: 'calc(100% - 2rem)', height: 'calc(100% - 2rem)'}}>
                    <line x1="37.5%" y1="0" x2="62.5%" y2="22.2%" />
                    <line x1="62.5%" y1="0" x2="37.5%" y2="22.2%" />
                    <line x1="37.5%" y1="100%" x2="62.5%" y2="77.8%" />
                    <line x1="62.5%" y1="100%" x2="37.5%" y2="77.8%" />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center font-bold text-black/50 text-3xl pointer-events-none select-none tracking-[2em] font-serif">
                    楚河       汉界
                </div>

                {/* Clickable Intersections & Pieces */}
                <div className="absolute inset-4">
                    {board.map((row, r) => row.map((cell, c) => {
                        const isSelected = selected?.r === r && selected?.c === c;
                        return (
                            <div 
                                key={`${r}-${c}`}
                                onClick={() => handleClick(r, c)}
                                className="absolute flex items-center justify-center z-10 cursor-pointer"
                                style={{
                                    left: `${(c / 8) * 100}%`, top: `${(r / 9) * 100}%`,
                                    width: '11.1%', height: '11.1%',
                                    transform: 'translate(-50%, -50%)',
                                }}
                            >
                                {/* Invisible touch target */}
                                <div className="absolute inset-0 z-0"/>
                                
                                {cell && (
                                    <div 
                                        className={`w-[90%] h-[90%] rounded-full shadow-lg flex items-center justify-center text-lg font-bold
                                        border-[2px] bg-[#f2e2c5] select-none
                                        ${cell.color === 'r' ? 'text-[#c62828] border-[#c62828]' : 'text-black border-black'}
                                        ${isSelected ? 'ring-2 ring-primary bg-yellow-100 scale-110 shadow-xl' : 'active:scale-95 transition-transform'}
                                        `}
                                    >
                                        <div className={`w-[84%] h-[84%] rounded-full border border-current flex items-center justify-center`}>
                                            {pieceText[cell.color][cell.type]}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    }))}
                </div>

                {gameOver && (
                    <div className="absolute inset-0 bg-bg-site/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-30 rounded-xl">
                        <h3 className="text-3xl font-bold mb-6">
                            {gameOver === 'r' ? (lang === 'zh' ? '红方绝杀！🎉' : 'Red Wins! 🎉') : (lang === 'zh' ? '黑方绝杀！🎉' : 'Black Wins! 🎉')}
                        </h3>
                        <button onClick={reset} className="px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2 shadow-lg">
                            <RotateCcw className="w-5 h-5" /> {lang === 'zh' ? '再来一局' : 'Play Again'}
                        </button>
                    </div>
                )}
            </div>

            <p className="text-xs text-text-site/50 text-center font-medium max-w-sm px-4">
                {lang === 'zh' 
                    ? '正宗中国象棋规则全内嵌（憋马腿，飞象过河限制）。拉上好友或对抗本地智能AI！' 
                    : 'Authentic Xiangqi rules engine built-in. Grab a friend or play against the local AI!'}
            </p>

            <FAQ faqs={faqs} />
        </div>
    );
};

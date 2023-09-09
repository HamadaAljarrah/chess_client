import { Color, Index, Square } from "../types";
import { Piece } from "../piece";
import { inBoundary } from "@/helpers/game";

export class Pawn extends Piece {
    constructor(color: Color, index: Index) {
        const image =
            color === "black"
                ? "./pieces/BLACK_PAWN.png"
                : "./pieces/WHITE_PAWN.png";
        super(color, image, index);
    }

    public clone(): Pawn {
        return new Pawn(this.color, this.index);
    }
    public getValidMoves(board: Square[][]): Index[] {
        const { x, y } = this.index;
        const indexes: Index[] = [];
        const yAxisDirection = this.color === "white" ? -1 : 1;
        const yAxis = this.color === "white" ? 6 : 1;

        const possibleMove = { dx: 0, dy: yAxisDirection };

        const captureMoves = [
            { dx: -1, dy: yAxisDirection },
            { dx: 1, dy: yAxisDirection },
        ];

        // First move
        if (y === yAxis) {
            const firstPossibleMoves = [
                { dx: 0, dy: yAxisDirection },
                { dx: 0, dy: 2 * yAxisDirection },
            ];
            for (const move of firstPossibleMoves) {
                const [newX, newY] = [x + move.dx, y + move.dy];

                if (inBoundary(newX, newY) && !board[newY][newX].piece && !board[newY - yAxisDirection][newX ].piece) {
                    indexes.push({ x: newX, y: newY });
                }
            }
        }

        // Regular advance
        const regularDx = x + possibleMove.dx;
        const regularDy = y + possibleMove.dy;
        if (inBoundary(regularDx, regularDy)) {
            if (!board[regularDy][regularDx].piece) {
                indexes.push({
                    x: x + possibleMove.dx,
                    y: y + possibleMove.dy,
                });
            }
        }

        // Captures
        for (const move of captureMoves) {
            const [newX, newY] = [x + move.dx, y + move.dy];
            if (inBoundary(newX, newY)) {
                const piece = board[newY][newX].piece;
                if (piece && piece.color !== this.color) {
                    indexes.push({ x: newX, y: newY });
                }
            }
        }

        return indexes;
    }
}

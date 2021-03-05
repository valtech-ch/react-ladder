import React from 'react';

import type { SquareValue } from './board';

import Board from './board';

import './index.css';

function calculateWinner(squares: SquareValue[]): { player: SquareValue, line: number[] } | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i += 1) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        player: squares[a],
        line: lines[i],
      };
    }
  }
  return null;
}

/**
 * @pre There is at least one difference between arrayA and arrayB
 * @pre arrayA.length === arrayB.length
 */
function getFirstDifferencePosition(arrayA: SquareValue[], arrayB: SquareValue[]): number {
  for (let i = 0; i < arrayA.length; i += 1) {
    if (arrayA[i] !== arrayB[i]) {
      return i;
    }
  }
  throw new Error(`No difference found between ${arrayA} and ${arrayB}`);
}

class Game extends React.Component<{
}, {
  history: { squares: SquareValue[] }[],
  nextTurn: string,
  stepNumber: number,
  sortAscending: boolean,
}> {
  constructor(props: {}) {
    super(props);
    this.state = {
      history: [{ squares: [null, null, null, null, null, null, null, null, null] }],
      nextTurn: 'X',
      stepNumber: 0,
      sortAscending: true,
    };
  }

  handleClick(squareId: number) {
    const { history, nextTurn, stepNumber } = this.state;

    const historyItem = history.slice(0, stepNumber + 1);
    const current = historyItem[historyItem.length - 1];
    const squares = current.squares.slice();

    if (squares[squareId] !== null) { // if square already filled
      return;
    }

    if (calculateWinner(squares)) { // if winning move
      return;
    }

    squares[squareId] = nextTurn;
    this.setState({
      history: historyItem.concat([{
        squares,
      }]),
      nextTurn: nextTurn === 'X' ? 'O' : 'X',
      stepNumber: historyItem.length,
    });
  }

  /**
   * @param stepNumber Integer between 1 and the last step in history
   * @return {x: Number, y: Number} with the location of the move, zero-based values
   */
  getMoveLocation(stepNumber: number) {
    const { history } = this.state;

    const squaresAfterMove = [...history[stepNumber].squares];
    const squaresBeforeMove = [...history[stepNumber - 1].squares];

    const firstDifferencePosition = getFirstDifferencePosition(squaresBeforeMove, squaresAfterMove);

    return {
      x: firstDifferencePosition % 3,
      y: Math.floor(firstDifferencePosition / 3),
    };
  }

  jumpTo(step: number) {
    this.setState({
      stepNumber: step,
      nextTurn: step % 2 ? 'O' : 'X',
    });
  }

  render() {
    const {
      history, nextTurn, sortAscending, stepNumber,
    } = this.state;

    const historyItem = history.slice(0, stepNumber + 1);
    const current = historyItem[stepNumber];
    const winner = calculateWinner(current.squares);

    let moves = historyItem.map((step, move) => {
      let desc;

      if (move > 0) {
        const moveLocation = this.getMoveLocation(move);
        desc = `Go to move #${move} (${moveLocation.x}, ${moveLocation.y})`;
      } else {
        desc = 'Go to game start';
      }

      if (move === historyItem.length - 1) {
        desc = <strong>{desc}</strong>;
      }

      return (
        <li key={move}>
          <button type="button" onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    if (!sortAscending) {
      moves = moves.reverse();
    }

    let status;
    if (winner) {
      status = `Winner: ${winner.player} 🍾🥳🎈`;
    } else if (stepNumber === 9) {
      status = '😑 Draw';
    } else {
      status = `Next player: ${nextTurn}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            highlightedSquares={winner ? winner.line : []}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <p>
            Move history list:
            <button type="button" onClick={() => this.setState({ sortAscending: !sortAscending })}>Toggle sort</button>
          </p>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

export default Game;

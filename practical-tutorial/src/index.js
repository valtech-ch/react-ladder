import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  const classes = [
    "square",
    props.highlighted ? "square--highlighted" : "",
  ].join(" ");

  return (
    <button className={classes} onClick={props.onClick}>
      {props.value}
    </button>
  );
}



class Board extends React.Component {
  renderSquare(i, highlighted) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        highlighted={highlighted}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderRow(j) {
    const rowSquares = [0, 1, 2].map(i => {
      const squareId = (j * 3) + i;

      const highlighedSquare = this.props.highlightedSquares.includes(squareId);

      return this.renderSquare(squareId, highlighedSquare);
    });

    return (
      <div key={j} className="board-row">
        { rowSquares }
      </div>
    );
  }

  render() {
    const rows = [0, 1, 2].map(j => this.renderRow(j));

    return (
      <div>
        { rows }
      </div>
    );
  }
}



class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: [null, null, null, null, null, null, null, null, null] }],
      nextTurn: "X",
      stepNumber: 0,
      sortAscending: true,
    };
  }

  /**
   * @pre arrayA.length === arrayB.length
   */
  getFirstDifferencePosition(arrayA, arrayB) {
    for (let i = 0; i < arrayA.length; i++) {
      if (arrayA[i] !== arrayB[i]) {
        return i;
      }
    }
    return null;
  }

  /**
   * @param stepNumber Integer between 1 and the last step in history
   * @return {x: Number, y: Number} with the location of the move, zero-based values
   */
  getMoveLocation(stepNumber) {
    const squaresAfterMove = [...this.state.history[stepNumber].squares];
    const squaresBeforeMove = [...this.state.history[stepNumber - 1].squares];

    const firstDifferencePosition = this.getFirstDifferencePosition(squaresBeforeMove, squaresAfterMove);

    return {
      x: firstDifferencePosition % 3,
      y: Math.floor(firstDifferencePosition / 3)
    };
  }

  handleClick(squareId) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (squares[squareId] !== null) { // if square already filled
      return;
    }

    if (calculateWinner(squares)) { // if winning move
      return;
    }

    squares[squareId] = this.state.nextTurn;
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      nextTurn: this.state.nextTurn === "X" ? "O" : "X",
      stepNumber: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      nextTurn: Boolean(step % 2) ? "O" : "X"
    });
  }

  render() {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let moves = history.map((step, move) => {
      let desc;

      if (move > 0) {
        const moveLocation = this.getMoveLocation(move);
        desc = 'Go to move #' + move + ' (' + moveLocation.x + ', ' + moveLocation.y + ')';
      } else {
        desc = 'Go to game start';
      }

      if (move === history.length - 1) {
        desc = <strong>{desc}</strong>;
      }

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    if (!this.state.sortAscending) {
      moves = moves.reverse();
    }

    let status;
    if (winner) {
      status = "Winner: " + winner.player + " 🍾🥳🎈";
    } else {
      status = "Next player: " + this.state.nextTurn;
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
            <button onClick={() => this.setState({ sortAscending: !this.state.sortAscending })}>Toggle sort</button>
          </p>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
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
  for (let i = 0; i < lines.length; i++) {
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

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

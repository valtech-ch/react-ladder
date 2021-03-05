import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

type SquareValue = string | null;

function Square(props: {
    highlighted: boolean,
    onClick: () => void,
    value: SquareValue,
}) {
  const { highlighted, onClick, value } = props;

  const classes = [
    'square',
    highlighted ? 'square--highlighted' : '',
  ].join(' ');

  return (
    <button type="button" className={classes} onClick={onClick}>
      {value}
    </button>
  );
}

class Board extends React.Component<{
    highlightedSquares: number[],
    onClick: (i: number) => void,
    squares: SquareValue[],
}> {
  renderSquare(i: number, highlighted: boolean) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        highlighted={highlighted}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderRow(j: number) {
    const rowSquares = [0, 1, 2].map((i) => {
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
    const rows = [0, 1, 2].map((j) => this.renderRow(j));

    return (
      <div>
        { rows }
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));

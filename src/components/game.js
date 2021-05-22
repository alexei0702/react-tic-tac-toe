import React from "react";
import Board from "./board";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        step: null
      }],
      xIsNext: true,
      stepNumber: 0,
      highlightedSquare: [],
      winnerInfo: null
    };
  }

  handleClick = (i) => {
    const history = this.state.history.slice(0, this.state.stepNumber + 1),
      current = history[history.length - 1],
      squares = current.squares.slice();

    let winnerInfo = calculateWinner(squares);

    if (winnerInfo || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    winnerInfo = calculateWinner(squares);
    if (winnerInfo)
      this.setHighlightedSquare(winnerInfo.combination, true);

    this.setState({
      history: history.concat({
        squares: squares,
        step: i
      }),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      winnerInfo: winnerInfo ? {...winnerInfo} : null
    });
  };

  jumpTo = (step) => {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  };

  setHighlightedSquare = (squares, value) => {
    this.setState({
      highlightedSquare: value ?
        squares :
        (this.state.winnerInfo && this.state.stepNumber === this.state.history.length - 1 ?
          this.state.winnerInfo.combination :
          []
        )
    })
  };

  render() {
    const history = this.state.history,
      current = history[this.state.stepNumber],
      winner = this.state.winnerInfo?.winner;

    let status;

    if (winner) {
      status = `Выйграл ${winner}`;
    } else if (current.squares.includes(null)) {
      status = 'Следующий ход ' + (this.state.xIsNext ? 'X' : 'O');
    } else {
      status = 'Ничья';
    }

    const moves = history.map((step, move) => {
      const desc = move ?
        `Перейти к шагу # ${move}. Ход: ${(Math.floor(step.step / 3) + 1)} - ${((step.step % 3) + 1)}` :
        'К началу';

      return (
        <li key={move} onMouseEnter={() => this.setHighlightedSquare([step.step], true)} onMouseLeave={() => this.setHighlightedSquare([], false)}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            highlightedSquare={this.state.highlightedSquare}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
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
        winner: squares[a],
        combination: lines[i]
      };
    }
  }
  return null;
}

export default Game;
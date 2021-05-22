import React from "react";
import Square from "./square";

class Board extends React.Component {

  renderSquare(i) {
    return (<Square
      isHighlighted={this.props.highlightedSquare.includes(i)}
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />);
  }

  render() {
    const boardRows = [0,3,6].map((i) => {
      return (
        <div className="board-row" key={i}>
          {[i, i+1, i+2].map((j) => {
            return (
              <span key={j}>
                {this.renderSquare(j)}
              </span>
            );
          })}
        </div>
      );
    });
    return (
      <div>{boardRows}</div>
    );
  }
}

export default Board;
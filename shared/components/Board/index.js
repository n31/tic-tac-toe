import React from 'react';
import Square from './Square';
import { Table } from 'react-bootstrap';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    /*this.state = {
      squares: this.props.squares,
    };*/
  }

  /*handleClick(i, player) {
    const squares = this.state.squares.slice();
    if (this.props.isCreation) squares.fill(null);
    squares[i] = player;
    this.setState({squares: squares});
  }*/

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.handleClick(i, this.props.player)}
      />
    );
  }

  render() {
    return (
      <div>
        <Table bordered style={{maxWidth: '150px', minHeight:'150px'}} variant="dark">
          <tbody>
            <tr>
              {this.renderSquare(0)}
              {this.renderSquare(1)}
              {this.renderSquare(2)}
            </tr>
            <tr>
              {this.renderSquare(3)}
              {this.renderSquare(4)}
              {this.renderSquare(5)}
            </tr>
            <tr>
              {this.renderSquare(6)}
              {this.renderSquare(7)}
              {this.renderSquare(8)}
            </tr>
          </tbody>
        </Table>

      </div>
    );
  }
}
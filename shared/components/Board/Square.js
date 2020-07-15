import React from 'react';
export default class Square extends React.Component {
  render() {
    /*return (
      <button
        className="square"
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );*/

    return (
      <td onClick={() => this.props.onClick()}>
        <div style={{width: '20px', height:'20px', fontSize: '20px', textAlign: 'center'}}>{this.props.value}</div>
      </td>
    );
  }
}
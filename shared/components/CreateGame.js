import React, { Component, useState } from 'react';
import Board from './Board';
import { Form, Button, Container, Col, Row } from 'react-bootstrap';
import io from 'socket.io-client';
import { Typeahead } from 'react-bootstrap-typeahead';

export default class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
      		nameValue: '',
      		tagsValue: '',
      		squares: Array(9).fill(null),
      		tags: ['loading'],
      		multiSelections: Array(),
      		setMultiSelections: Array()
    	};
    	this.socket;
    	this.handleClick = this.handleClick.bind(this);
    	this.startGame = this.startGame.bind(this);
    	this.hello = this.hello.bind(this);
	}

	componentDidMount() {
  		this.socket = io();
  		this.socket.on('redirect', data => window.location.href = data);
  		this.socket.on('return id', data => {
  			this.socket.emit('set player', {player: 'X', gameId: data, step: false, squares: this.state.squares});
  		});
  		this.socket.emit('get tags');
  		this.socket.on('send tags', data => this.setState({
  			tags: data
  		}));
  	}

  	// handle the click on the board square and rewrite it 
  	handleClick(i, player) {
    	const squares = this.state.squares.slice().fill(null);
    	squares[i] = player;
    	this.setState({squares: squares});
  	}

  	startGame() {
  		//alert("I m working!");
  		let gameTags = Array();
  		this.state.setMultiSelections.forEach(e => {
            if (typeof e === 'object') {
              gameTags.push(e.label);
            }
            else {
              gameTags.push(e);
            }
        })
        console.log('gameTags', gameTags.join('\\,'));
  		this.socket.emit('new game', {name: this.state.nameValue, tags: gameTags.join('\\,'), squares: this.state.squares});
  		//window.location.href = '/game';
  	}

  	hello(e) {
  		alert("Hello");
  		this.setState({
  			setMultiSelections: e.target.value
  		})
  	}

	render() {
		return (
			<div>
				<Container>
					<Row className="justify-content-md-center">
						<div style={{width: "100%", maxWidth: "600px"}}>
						<br />
						<h1>Create a new game</h1>
						<br />
						<div>Game name:</div>
						<Form.Control 
							type="text" 
							placeholder="Enter game name"
							value={this.state.nameValue} 
							onChange={evt => this.setState({nameValue: evt.target.value})}
						/>
						<br />

						<div>Tags:</div>
						<Typeahead
							allowNew
							id="custom-selections-example"
							multiple
							newSelectionPrefix="Add a new tag: "
							onChange={selectedData => {
									this.setState({setMultiSelections: selectedData}, () => {
										console.log("setMultiSelections", this.state.setMultiSelections);
									});
								}
							}
							options={this.state.tags}
							placeholder="Type tags..."
							defaultSelected={this.state.multiSelections}
							minLength={1}
						/>
						<br />
					        


						<div>Make the first step if you want:</div>
						<Board
							player={'X'}
							isCreation={true}
							squares = {this.state.squares}
							handleClick = {this.handleClick}
						/>
						<br />
						<Button variant="outline-success" onClick={this.startGame}>Start</Button>
						</div>
					</Row>
				</Container>
			</div>
		);
	}
}
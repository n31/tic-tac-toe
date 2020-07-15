import React, { Component } from 'react';
import io from 'socket.io-client';
import Board from './Board';
import { Modal, Button } from 'react-bootstrap';

export default class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			player: null,
			gameId: null,
			step: null,
			squares: Array().fill(null),
			modalShow: false,
			winner: 'none'
		};
		this.socket;
		this.handleClick = this.handleClick.bind(this);
		//this.PopUpWinner = this.PopUpWinner.bind(this);
		this.handleClose = this.handleClose.bind(this);
	}

	componentDidMount() {
		this.socket = io();
		this.socket.emit('start game');
		this.socket.on('redirect', data => window.location.href = data);

		this.socket.on('update state', data => this.setState({
			player: data.player,
			gameId: data.gameId,
			step: data.step,
			squares: data.squares
		}));
		this.socket.on('sync board client', data => {
			if (data.gameId == this.state.gameId) {
				let step = this.state.step;
				if (data.nextPlayer == this.state.player && data.winner === null) step = !step;
				this.setState({
					squares: data.squares,
					step: step
				});
				if (data.winner !== null) this.setState({
					winner: data.winner,
					modalShow: true
				});
			}
		});



		this.socket.on('game updated', data => {
			if (data.id == this.state.gameId) {
				const step = !this.state.step;
				this.setState({
					squares: data.squares,
					step: step,
					lock: true
				});
			}
		});
	}

	handleClick(i, player) {
		if (!this.state.step || this.state.squares[i] != null || this.state.lock) return;
		const squares = this.state.squares.slice();
    	squares[i] = player;
    	this.setState({
    		squares: squares,
    		step: false
    	});
    	this.socket.emit('sync board server', {squares: squares, player: this.state.player});
    	//this.socket.emit('update squares', {id: this.state.gameId, squares: this.state.squares});
	}

	handleClose() {
		this.socket.emit('refresh player');
	}

	PopUpWinner() {
		return(
			<Modal
				show={this.state.modalShow}
				size='sm'
				backdrop="static"
				aria-labelledby="contained-modal-title-vcenter"
      			centered
      		>
      			<Modal.Body>
      				{this.state.winner} is the winner!
      			</Modal.Body>
      			<Modal.Footer>
      				<Button variant="primary" onClick={this.handleClose}>
			        	Close Game
			        </Button>
      			</Modal.Footer>
      		</Modal>
		);
	}

	render() {
		return (
			<div>
				<h1>Hello Game!</h1>
				<Board
					player={this.state.player}
					squares = {this.state.squares}
					handleClick = {this.handleClick}
				/>
				{this.PopUpWinner()}
			</div>
		);
	}
}
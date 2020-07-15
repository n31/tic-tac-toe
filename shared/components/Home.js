import React, { Component } from 'react';
import io from 'socket.io-client';
import { Card, CardDeck, CardColumns, Container, Badge } from 'react-bootstrap';
import Board from './Board';

export default class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			games: Array()
		};
		this.socket;
		this.urlParams;
		this.tag;
		this.startGame = this.startGame.bind(this);
	}

	componentDidMount() {
		this.socket = io();
		this.urlParams = new URLSearchParams(window.location.search);
		this.tag = this.urlParams.get('tag');
		this.socket.emit("get games");
		this.socket.on("send games", data => this.setState({games: data}));
		this.socket.on('redirect', data => window.location.href = data);
		console.log('urlParams', this.urlParams.get('tag'));
	}

	startGame(id, gameSquares) {
		//this.socket.emit("start game", id);
		//window.location.href = '/game';
		//alert("I m working! id:");
		
		//alert(gameSquares);
		//alert(id);
		this.socket.emit('connect game', {
			player: 'O',
			gameId: id,
			step: true,
			squares: gameSquares
		});
	}

	render() {
		return (
			<div>
				<Container>
					<h1>Active games</h1>
					<CardColumns style={{width: "100%", justifyContent: 'center'}}>
					{
						!this.state.games.length ? null :
						this.state.games.map((val, index) => {
							const gameSquares = [
								this.state.games[index].c1,
								this.state.games[index].c2,
								this.state.games[index].c3,
								this.state.games[index].c4,
								this.state.games[index].c5,
								this.state.games[index].c6,
								this.state.games[index].c7,
								this.state.games[index].c8,
								this.state.games[index].c9
							];
							if (this.tag === null || val.tags.split('\\,').includes(this.tag))
								return (
									<Card onClick={() => this.startGame(val.id, gameSquares)} style={{width: "200px", cursor: "pointer"}} bg={'dark'} text={'white'}>
										<Card.Header>{val.name}</Card.Header>
										<Card.Body>
											<Board squares={[val.c1,val.c2,val.c3,val.c4,val.c5,val.c6,val.c7,val.c8,val.c9]} />
											<Card.Text>{
												val.tags.split('\\,').map((value, index) => {
													return (
														<Badge pill variant="secondary">{value}</Badge>
													)
												})
											}</Card.Text>
										</Card.Body>
									</Card>
								);
						})
					}
					</CardColumns>
				</Container>
			</div>
		);
	}
}
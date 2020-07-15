import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import io from 'socket.io-client';

export default class TopNav extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchValue: ''
		}
		this.socket;
		this.search = this.search.bind(this);
	}

	componentDidMount() {
		this.socket = io();
		this.socket.on('redirect', data => window.location.href = data);
	}

	search() {
		const search = encodeURIComponent(this.state.searchValue);
		console.log('this.state.searchValue', this.state.searchValue);
		console.log('search', search);
		this.socket.emit('search tags', search);
	}

	render() {
		return(
			<div>
				<Navbar bg="dark" variant="dark" expand='sm' sticky="top">
					<Navbar.Brand href="/">TicTacToe-Tiles</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id='basic-navbar-nav'>
						<Nav className="mr-auto">
							<Nav.Link href='/'>Home</Nav.Link>
							<Nav.Link href='/new'>Create</Nav.Link>
						</Nav>
					   		<FormControl style={{display: "inline", whiteSpace: "nowrap", width: "200px"}}
					   			onChange={e => this.setState({searchValue: e.target.value})}
					   			type="text" placeholder="Search by tags" className="mr-sm-2" 
					   		/>
					    	<Button style={{display: "inline", whiteSpace: "nowrap"}} variant="success" onClick={this.search}>Search</Button>
					</Navbar.Collapse>
				</Navbar>
			</div>
		);
	}
}
import React, { Component } from 'react';
import TopNav from './components/TopNav';
import Main from './components/Main';

export default class App extends Component {
	
	render() {
		return (
			<div>
				<TopNav />
				<Main />
			</div>
		);
	}
}
import React from 'react';
import { Router, Route, Link, NavLink } from 'react-router-dom';
import Browse from './browse.js';
import Saved from './saved.js';

class LoggedIn extends React.Component {
	render() {
		return (
			<div className='nav'>
				<NavLink className='navLink' activeClassName="nav-active" to='/logged-in/browse'>Browse The Films</NavLink>
				<NavLink className='navLink' activeClassName="nav-active" to='/logged-in/saved'>Your Saved Films</NavLink>
			</div>
		)
	}
}

export default LoggedIn
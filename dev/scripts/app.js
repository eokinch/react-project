import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, NavLink } from 'react-router-dom';
import firebase, { auth, provider } from './firebase.js';
import _ from 'underscore';
import Browse from './browse.js';
import Saved from './saved.js';
import Login from './login.js';
import LoggedIn from './loggedIn.js';
import history from './history';

class App extends React.Component {
	constructor(){
		super();
		this.state = {
			user: null
		}
		this.componentDidMount = this.componentDidMount.bind(this);
	}
	componentDidMount(){
		auth.onAuthStateChanged((user) => {
			this.setState({
				user
			})
		})

	}
	render() {
		return(
			<Router history={history}	>
				<div>
					<section className="content">
						<Login />
						<Route path='logged-in' component={LoggedIn}/>
						<Route exact path='/logged-in/browse' component={Browse}/>
						<Route exact path='/logged-in/saved' component={Saved}/>
					</section>
				</div>
			</Router>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('app'));
import React from 'react';
import firebase, { auth, provider } from './firebase.js';
import LoggedIn from './loggedIn.js';
import history from './history';

class Login extends React.Component {
	constructor() {
		super();
		this.state = {
			user: null
		}
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
	}
	login() {
		auth.signInWithPopup(provider)
		.then((res) => {	
			history.push('/logged-in/welcome');
			const user = res.user
			this.setState({
				user
			});
		});
	}
	logout(){
		auth.signOut()
		.then(() => {
			history.push('/');
			this.setState({
				user: null
			})
		})
	}
	render() {
		return(
			<div className='check-user-status '>
				{this.state.user ?
					<div className="logged-in">
						<div className="logged-in_content">
							<h1>TIFF Organizer<span>2017</span></h1>
							<img src={`${this.state.user.photoURL}`} alt={`user photo of ${this.state.user.displayName}`}/>
							<p className="user-name">{this.state.user.displayName}</p>
							<button onClick={this.logout}>Log Out</button>
							<LoggedIn />
						</div>
					</div>
					:
					<div className="log-in">
						<div className="log-in_content wrapper">
							<h1>TIFF Organizer<span>2017</span></h1>
							<p>Need help organizing your time at the Toronto International Film Festival? 
							Use this app to browse through all the films and select the showtimes that work for you.
							They'll get saved to a list that you can edit later to narrow down your final selections</p>
							<p>To continue please log in</p>
							<button onClick={this.login}>Log In</button>
						</div>
					</div>
				}
			</div>
		)
	}
}

export default Login 
import React from 'react';
import _ from 'underscore';
import firebase, { auth, provider } from './firebase.js';
import moment from 'moment';

class Saved extends React.Component {
	constructor() {
	 	super();
	 	this.state = {
	 		savedFilms: [],
	 		checkedTimes: {},
	 		user: null
	 	}
	 	this.componentDidMount = this.componentDidMount.bind(this);
	 	this.getSavedList = this.getSavedList.bind(this);
	 	this.sortSavedShowings = this.sortSavedShowings.bind(this);
	 	this.getSavedShowings = this.getSavedShowings.bind(this);
	 	this.removeShowing = this.removeShowing.bind(this);
	 	this.checkTimes = this.checkTimes.bind(this);
	}
	 componentDidMount() {
	 	auth.onAuthStateChanged((user) => {	
			this.setState({
				user: user
			}, this.getSavedList)

		});
	 }
	 getSavedList(){
 	 	const userId = this.state.user.uid
 	 	const dbRef = firebase.database().ref(`/${userId}`);
 	 	dbRef.on('value', (snapshot) => {
 	 		const savedMovies = [];
 	 		const firebaseList = snapshot.val();
 	 		for (let key in firebaseList) {
 	 			const item = firebaseList[key];
 	 			item.key = key;
 	 			savedMovies.push(item)
 	 		}
 	 		this.setState({
 	 			savedFilms: savedMovies
 	 		}, this.sortSavedShowings)
 	 	})
	}
	sortSavedShowings() {
		const saved = Array.from(this.state.savedFilms);
		const sortFilms = saved.sort((x, y) => {
			const date1 = x.dates.start.dateTime;
			const date2 = y.dates.start.dateTime;
			const moment1 = moment(date1)
			const moment2 = moment(date2)
			if (moment(moment1).isAfter(moment2)){
				return 1
			} 
			if(moment(moment2).isAfter(moment1)) {
				return -1
			} 
			if (moment(moment1).isSame(moment2)) {
				return 0
			}
		})
		this.setState({
			savedFilms: sortFilms
		}, this.checkTimes)
	}
	checkTimes() {
		const dateTime = {};
		const films = this.state.savedFilms;
		films.map((film) => {
			const date = film.dates.start.dateTime;
			if(date in dateTime) {
				dateTime[date] += 1
			} else {
				dateTime[date] = 1
			}
		});
		this.setState({
			checkedTimes: dateTime
		});
	}
	getSavedShowings() {
		const films = this.state.savedFilms;
		return films.map((film) => {
				const startDate = film.dates.start.dateTime;
				const conflict = this.state.checkedTimes[startDate];
				{if(conflict > 1) {
					return <form key={film.key} value={film.key} onSubmit={this.removeShowing} className='user-saved-showing conflict'>
								<p className="timing-conflict">Timing Conflict</p>
								<h3>{film.name}</h3>
								<p className='date'>Date: {film.dates.start.localDate}</p>
								<p className="time">Time: {film.dates.start.localTime}</p>
								<p className='location'>{film._embedded.venues[0].name}</p>
								<button>X</button>
							</form>	
				} else {
					return <form key={film.key} value={film.key} onSubmit={this.removeShowing} className='user-saved-showing'>
								<h3>{film.name}</h3>
								<p className='date'>Date: {film.dates.start.localDate}</p>
								<p className="time">Time: {film.dates.start.localTime}</p>
								<p className='location'>{film._embedded.venues[0].name}</p>
								<button>X</button>
							</form>
				}}
		})
	}
	removeShowing(event) {
		event.preventDefault();
		const userId = this.state.user.uid;
		const key = event.target.getAttribute('value');
		const itemRef = firebase.database().ref(`/${userId}/${key}`);
		itemRef.remove();
	}
	render(){
		return(
			<section className='saved' classID='saved'>
				<h2>Your Saved Showings</h2>
				<p>Sorted By Date & Time</p>
				<div className="saved-showings">
					{this.getSavedShowings()}
				</div>
			</section>
		)
	}
}

export default Saved

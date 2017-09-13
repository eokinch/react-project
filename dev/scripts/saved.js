import React from 'react';
import _ from 'underscore';
import firebase, { auth, provider } from './firebase.js';

class Saved extends React.Component {
	constructor() {
	 	super();
	 	this.state = {
	 		savedFilms: [],
	 		user: null
	 	}
	 	this.componentDidMount = this.componentDidMount.bind(this);
	 	this.getSavedList = this.getSavedList.bind(this);
	 	this.sortSavedShowings = this.sortSavedShowings.bind(this);
	 	this.getSavedShowings = this.getSavedShowings.bind(this);
	 	this.removeShowing = this.removeShowing.bind(this);
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
		const dateSorted = saved.sort((x, y) => {
			const date1 = Date.parse(x.dates.start.localDate);
			const date2 = Date.parse(y.dates.start.localDate);
			if (date1 < date2) {
				return -1
			}
			if(date1 > date2){
				return 1
			}
			return 0
		})
		// saving this code to reassess sort by both time and date;
		// const timeSorted = dateSorted.sort((x, y) => {
		// 	const date1 = x.dates.start.localDate
		// 	const date2 = y.dates.start.localDate
		// 	const time1 = parseInt(x.dates.start.localTime);
		// 	const time2 = parseInt(y.dates.start.localTime);
		// 	if(date1 === date2){
		// 		if(time1 > time2) {
		// 			return -1
		// 		}
		// 		if(time1 < time2) {
		// 			return 1
		// 		}
		// 		return 0
		// 	}
		// })
		this.setState({
			savedFilms: dateSorted
		})
	}
	getSavedShowings() {
		const films = this.state.savedFilms
		return films.map((film) => {
			return( 
				<form key={film.key} value={film.key} onSubmit={this.removeShowing} className='user-saved-showing'>
					<h3>{film.name}</h3>
					<p className='date'>Date: {film.dates.start.localDate}</p>
					<p className="time">Time: {film.dates.start.localTime}</p>
					<p className='location'>{film._embedded.venues[0].name}</p>
					<button >Remove</button>
				</form>
			
			)
		})
	}
	checkTimes(){

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
				<p>Sorted By Date</p>
				<div className="saved-showings">
					{this.getSavedShowings()}
				</div>
			</section>
		)
	}
}

export default Saved

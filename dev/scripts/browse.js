import React from 'react';
import _ from 'underscore';
import {ajax} from 'jquery';
import firebase, { auth, provider } from './firebase.js';

class Browse extends React.Component {
	constructor() {
		super();
		this.state = {
			allFilms: [],
			selectedFilm: [],
			user: null
		}
		this.componentDidMount = this.componentDidMount.bind(this);
		this.getNames = this.getNames.bind(this);
		this.handleSelection = this.handleSelection.bind(this);
		this.displayShowings = this.displayShowings.bind(this);
		this.saveShowing = this.saveShowing.bind(this);
    }
	componentDidMount() {
		auth.onAuthStateChanged((user) => {	
			console.log('on auth state changed');	
			this.setState({
				user: user
			});
		});
		const allMovies = [];
		const dbRef = firebase.database().ref(`/allFilms`);
		dbRef.on('value', (snapshot) => {
			console.log('on value');
			console.log(snapshot.val());
			const allFilms = snapshot.val();
			for(let key in allFilms){
				const films = allFilms[key]
				for(let film in films){
					const film = films[film];
					allMovies.push(film);
				}
			}
			this.setState({
				allFilms: allMovies
			});
		});	
	}
	getNames(movies) {
		const sortedTitles = _.sortBy(movies, 'name');
		const uniqueTitles = _.uniq(sortedTitles, (filterNames) => {
			return filterNames.name;
		})
		return uniqueTitles.map((film, index) => {
			return <option value={film.name} className='browse-option' key={`browse-option-${index}`}>{film.name}</option>;
		})
	}
	handleSelection(event) {
		const name = event.target.value;
		const allFilms = this.state.allFilms;
		const filterTitles = _.filter(allFilms, (film) => {
			return film.name === name
		});
		this.setState({
			selectedFilm: filterTitles
		})
	}
	displayShowings(){
		const showings = this.state.selectedFilm;
		return showings.map((showing, index) => {
			return (
				<form key={`showing-${index}`} onSubmit={this.saveShowing} data-movieId={showing.id} className='showing'>
					<h3>{showing.name}</h3>
					<p className='date'>Date: {showing.dates.start.localDate}</p>
					<p className='time'>Time: {showing.dates.start.localTime}</p>
					<p className='location'>{showing._embedded.venues[0].name}</p>
					<button>Add to List</button>
				</form>
			)
		});
	}
	saveShowing(event) {
		event.preventDefault();
		const allFilms = this.state.allFilms
		const filmId = event.target.getAttribute('data-movieId');
		const findShowing = _.find(allFilms, (films) => {
			return films.id === filmId
		})
		const savedFilms = this.state.savedFilms
		const searchFilms = _.find(savedFilms, (film) => {
			return film.id === filmId
		})
		const userId = this.state.user.uid
		const dbRef = firebase.database().ref(`/${userId}`);
		if( searchFilms === undefined) {
			dbRef.push(findShowing)
		}
	}
	render() {
		return(
			<section className='browse' classID='browse'>
				<h2>Browse and Choose Your Showings</h2>
				<select className="browse-films" id="browse-films" onChange={this.handleSelection}>
					<option value="default">Browse All The Films</option>
					{this.getNames(this.state.allFilms)}
				</select>
				<div className='select-showing' id='select-showing'>
						{this.displayShowings()}
				</div>
			</section>
		)
	}
}

export default Browse
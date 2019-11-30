import React from 'react';
import { useFetch } from '../../utils/fetchData';
import Problem from './components/Problem';
import Leaderboard from './components/Leaderboard'
import axios from "axios";

import './HomePage.scss'

const HomePage = () => {
	const [dataLeaderboard, loadingLeaderboard] = useFetch('http://192.168.0.113:5000/leaderboard');
	let [dataQuestion, loadingQuestion] = useFetch('http://192.168.0.113:5000/question');
	// const { num, ans } = dataQuestion
	// const { data } = dataLeaderboard
	console.log(dataQuestion)
	const num = dataQuestion.num || [4, 5, 9, 1];
	const ans = dataQuestion.ans || 7;
	const data = dataLeaderboard.data || [{uid: 'eqsk134', score: 100}, {uid: 'pong', score: -2100}]

	setInterval(async () => {
		const response = await axios.get('http://192.168.0.113:5000/question');
    dataQuestion = response.data.data
		console.log('ques', dataQuestion);
	}, 10000);

	return (
		<div>
			<Problem num={dataQuestion.num || [4, 5, 9, 1]} ans={dataQuestion.ans || 7}/>
			<Leaderboard data={data}/>
		</div>  
	);
}

export default HomePage;
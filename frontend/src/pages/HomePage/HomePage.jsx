import React from 'react';
import { useFetch } from '../../utils/fetchData';
import Problem from './components/Problem';
import Leaderboard from './components/Leaderboard'

import './HomePage.scss'

const HomePage = () => {
	const [dataLeaderboard, loadingLeaderboard] = useFetch('http://192.160.0.113:5000/leaderboard');
	const [dataQuestion, loadingQuestion] = useFetch('http://192.160.0.113:5000/question');
	// const { num, ans } = dataQuestion
	// const { data } = dataLeaderboard

	const num = dataQuestion.num || [4, 5, 9, 1];
	const ans = dataQuestion.ans || 7;
	const data = dataLeaderboard.data || [{uid: 'eqsk134', score: 100}, {uid: 'pong', score: -2100}]

	return (
		<div>
			<Problem num={num} ans={ans}/>
			<Leaderboard data={data}/>
		</div>  
	);
}

export default HomePage;
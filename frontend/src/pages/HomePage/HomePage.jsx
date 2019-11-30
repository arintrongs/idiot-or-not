import React from 'react';
import { useFetch } from '../../utils/fetchData';
import Problem from './components/Problem';
import Leaderboard from './components/Leaderboard'

import './HomePage.scss'

const HomePage = () => {
	// const [leader, setLeader] = useState({data: [{uid: 'eqsk134', score: 999999}]});
	// let [dataLeaderboard, loadingLeaderboard] = useFetch('http://192.168.0.113:5000/leaderboard');
	const [dataQuestion, loadingQuestion] = useFetch('http://192.168.0.113:5000/question');
	// const { num, ans } = dataQuestion
	// const { data } = dataLeaderboard
	console.log(dataQuestion)
	const num = dataQuestion.num || [4, 5, 9, 1];
	const ans = dataQuestion.ans || 7;

	return (
		<div>
			<Problem num={dataQuestion.num || [4, 5, 9, 1]} ans={dataQuestion.ans || 7}/>
			<Leaderboard />
		</div>  
	);
}

export default HomePage;
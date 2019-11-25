import React from 'react';
import { useFetch } from '../../utils/fetchData';
import Problem from './components/Problem';
import Leaderboard from './components/Leaderboard'

import './HomePage.scss'

const HomePage = () => {
	const [data, loading] = useFetch();
	const { navbarItems, duration, detail, condition } = data

	return (
		<div>
			<Problem />
			<Leaderboard />
		</div>  
	);
}

export default HomePage;
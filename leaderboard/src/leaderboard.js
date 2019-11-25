const amqp = require('amqplib/callback_api');
const fs = require('fs');

const url =
	process.env.URL ||
	'amqp://mnyqoqiy:HtoGI0IGi-EoLMc6YH9m4zN1d4o7remQ@cougar.rmq.cloudamqp.com/mnyqoqiy';

amqp.connect(url, function(error0, connection) {
	if (error0) {
		throw error0;
	}
	connection.createChannel(function(error1, channel) {
		if (error1) {
			throw error1;
		}
		var queue = 'main';
		channel.assertQueue(queue, {
			durable: false
		});
		channel.prefetch(1);

		channel.consume(queue, function(msg) {
			try {
				const result = JSON.parse(msg.content.toString());
				let index = null;
				const leaderboard = require('./leaderboard.json');
				leaderboard.data.forEach((val, ind) => {
					if (result.uid === val.uid) {
						index = ind;
					}
				});
				if (index != null) {
					const user = leaderboard.data[index];
					if (result.result) {
						user.score = user.score + 100;
					} else {
						user.score = user.score - 150;
					}
					leaderboard.data[index] = user;
				} else {
					if (result.result) {
						leaderboard.data.push({
							uid: result.uid,
							score: 100
						});
					} else {
						leaderboard.data.push({
							uid: result.uid,
							score: -150
						});
					}
				}

				leaderboard.data = leaderboard.data.sort((a, b) =>
					a.score > b.score ? -1 : 1
				);

				const json = JSON.stringify(leaderboard);
				fs.writeFile('leaderboard.json', json, err => {
					if (err) throw err;
				});
			} catch (err) {}

			setTimeout(function() {
				channel.ack(msg);
			}, 1000);
		});
	});
});

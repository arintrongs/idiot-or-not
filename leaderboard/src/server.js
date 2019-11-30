const Express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const fs = require("fs");

const app = new Express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  try {
    console.log('req:', new Date())
    const response = fs.readFileSync("leaderboard.json", error => {
      if (error) throw error;
    });
    console.log('res:', response)
    res.status(200).send(JSON.parse(response));
  } catch (error) {
    res.status(400).send(error);
  }
});

const PORT = process.env.PORT || 80;

app.listen(PORT, error => {
  if (!error) {
    console.log(`Express is running on port: ${PORT}!`);
    console.log("Ready to use!");
  }
});

const amqp = require("amqplib/callback_api");

const url = "amqp://guest:guest@rabbitmq:5672";

try {
  amqp.connect(url, function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      var queue = "main";
      channel.assertQueue(queue, {
        durable: false
      });
      channel.prefetch(1);

      channel.consume(queue, function (msg) {
        try {
          console.log('msg from rabbitMQ:', msg.content.toString());
          const result = JSON.parse(msg.content.toString());
          let index = null;
          const leaderboard = require("./leaderboard.json");
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
          fs.writeFile("leaderboard.json", json, err => {
            if (err) throw err;
          });
        } catch (err) { }

        setTimeout(function () {
          channel.ack(msg);
        }, 1000);
      });
    });
  });
} catch (err) { }

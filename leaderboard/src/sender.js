const amqp = require("amqplib/callback_api");

const url = process.env.url || "amqp://guest:guest@rabbitmq:5672";

amqp.connect(url, function(error, connection) {
  if (error) {
    throw error;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }

    let queue = "main";
    const testt = {
      uid: "ekwaiEQ",
      result: false
    };
    let msg = JSON.stringify(testt);

    channel.assertQueue(queue, {
      durable: false
    });
    channel.sendToQueue(queue, Buffer.from(msg), {
      persistent: true
    });
    console.log("Sent '%s'", msg);
  });
  setTimeout(function() {
    connection.close();
    process.exit(0);
  }, 500);
});

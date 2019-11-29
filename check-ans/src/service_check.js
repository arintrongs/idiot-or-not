const amqp = require("amqplib/callback_api");

const url = "amqp://guest:guest@rabbitmq:5672";

const publishMsg = msg => {
  amqp.connect(url, function(error, connection) {
    if (error) {
      throw error;
    }
    connection.createChannel(function(error1, channel) {
      if (error1) {
        throw error1;
      }

      let queue = "main";
      //   let msg = 'eye';

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
    }, 500);
  });
};

module.exports = publishMsg;

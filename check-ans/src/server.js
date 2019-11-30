const Express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = new Express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const getAns = (num, op) => {
  for (var i = 0; i < num.length - 1; i++) {
    if (op[i] === "^") {
      num.splice(i, 2, num[i] ** num[i + 1]);
      op.splice(i, 1);
    }
  }

  for (var i = 0; i < num.length - 1; i++) {
    if (op[i] === "*") {
      num.splice(i, 2, num[i] * num[i + 1]);
      op.splice(i, 1);
      i -= 1;
    } else if (op[i] === "/") {
      num.splice(i, 2, Math.floor(num[i] / (num[i + 1] + 0.0001)));
      op.splice(i, 1);
      i -= 1;
    }
  }

  for (var i = 0; i < num.length - 1; i++) {
    if (op[i] === "+") {
      num.splice(i, 2, num[i] + num[i + 1]);
      op.splice(i, 1);
      i -= 1;
    } else if (op[i] === "-") {
      num.splice(i, 2, num[i] - num[i + 1]);
      op.splice(i, 1);
      i -= 1;
    }
  }
  return num[0];
};

app.post("/", async (req, res) => {
  console.log("request to check-ans");
  console.log(req.body);
  try {
    const ans = getAns(req.body.num, req.body.op);
    let result = false;
    if (ans === req.body.ans) {
      result = true;
    }
    const payload = {
      uid: req.body.uid,
      result
    };
    console.log("res from check-ans");
    console.log(payload);
    axios.post("http://leaderboard/update", payload);
    return res.status(200).send(payload);
  } catch (error) {
    console.log("res from check-ans");
    console.log("error");
    return res.status(400).send(error);
  }
});

const PORT = 80;

app.listen(PORT, error => {
  if (!error) {
    console.log(`Express is running on port: ${PORT}!`);
    console.log("Ready to use!");
  }
});

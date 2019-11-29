const Express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const publishMsg = require('./service_check.js')

const app = new Express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const getAns = (num,op) => {

    for(var i=0;i<num.length-1;i++){
        if (op[i] === '^'){
            num.splice(i,2,num[i]**num[i+1])
            op.splice(i,1)
        }
    }

    for(var i=0;i<num.length-1;i++){
        if (op[i] === '*'){
            num.splice(i,2,num[i]*num[i+1])
            op.splice(i,1)
            i -= 1
        }
        else if (op[i] === '/'){
            num.splice(i,2,Math.floor(num[i]/(num[i+1]+0.0001)))
            op.splice(i,1)
            i -= 1
        }
    }

    for(var i=0;i<num.length-1;i++){
        if (op[i] === '+'){
            num.splice(i,2,num[i]+num[i+1])
            op.splice(i,1)
            i -= 1

        }
        else if (op[i] === '-'){
            num.splice(i,2,num[i]-num[i+1])
            op.splice(i,1)
            i -= 1

        }
    }
    return num[0]
}

app.post('/', async (req,res)=>
  {
        try{
            const ans = getAns(req.body.num,req.body.op)
            let result = false
            if (ans === req.body.ans){
                result = true
            }
            const payload = {
                uid : req.body.uid,
                result
            }
            await publishMsg(JSON.stringify(payload))
            res.status(200).send(payload)
        }
        catch(error){
            res.status(400).send(error);
        }
    })

const PORT = 80;

app.listen(PORT, error => {
 if (!error) {
  console.log(`Express is running on port: ${PORT}!`);
  console.log('Ready to use!');
 }
});
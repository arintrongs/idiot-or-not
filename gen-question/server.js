const Express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const publishMsg = require('./service_check.js')

const app = new Express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const genRand = () => {
    var ans = 10000

    while(ans>150 && ans > -100){
        const oprand = ['+','-','*','/','^']
        var randomlen = Math.floor(Math.random() * (5 - 3 + 1)) + 3;
        var num = []
        var op = []
        var max = 10
        var min = 0

        for(var i=0;i<randomlen;i++){
            var item = oprand[Math.floor(Math.random()*oprand.length)];
            var randomnum = Math.floor(Math.random() * (max - min + 1)) + min;
            num.push(randomnum)
            op.push(item)
            max = 10
            min = 0
            if (item === '^'){
                var tmp = 100
                var c = 0 
                do{
                    tmp = Math.floor(tmp/(num[i]))-1
                    c+=1
                }while(tmp>1 && num[i]!=0)
                max = c
            }
            else if (item === '/'){
                min = 1
            }
        }
        op.pop()
        tmp = [...num]
        ans = getAns(tmp,op)

    }
    return {
        uid : 'eye',
        num : num,
        ans : ans
    }

}
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

app.get('/', async(req,res)=>{
    try{
        const rand = genRand()
        res.status(200).send(JSON.stringify(rand))
    }
    catch(error){
        res.status(400).send(error);
    }
})

const PORT = 8000;

app.listen(PORT, error => {
 if (!error) {
  console.log(`Express is running on port: ${PORT}!`);
  console.log('Ready to use!');
 }
});
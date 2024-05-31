let express = require("express")
const bodyParser = require('body-parser');
var plivo = require('plivo');

let app = express()

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function (req, response, next) {
    response.contentType('application/xml');
    next();
});

app.post("/sendSMS", (req, res) => {
    var client = new plivo.Client("", "");
    client.messages.create(
        "+1",
        "+92",
        "Hello, from Nodejs!",
    ).then(response => {
        console.log(response);
        res.send({"Response: ":response})
    }).catch(err => { 
        console.log(err)
        res.send({"Error: ":response})
    });
})

app.get("/replySms",(req,res)=>{
    let from_number = req.body.From || req.query.From;
    let to_number = req.body.To || req.query.To;
    let text = req.body.Text || req.query.Text;
    console.log('Message received - From: ' + from_number + ', To: ' + to_number + ', Text: ' + text);

    //send the details to generate an XML
    let r = plivo.Response();
    let params = {
        'src': to_number,
        'dst': from_number,
    };
    let message_body = "Thank you, we have received your req.";
    r.addMessage(message_body, params);
    console.log(r.toXML());
    res.end(r.toXML());
})

app.listen(3000)

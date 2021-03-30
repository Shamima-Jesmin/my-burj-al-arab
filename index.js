const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const port = 5000

app.get('/', (req)=>{
    res.send('hello from db its working')
})
// const password = jesmin123;

const app = express();
app.use(bodyParser.json());
app.use(cors());

// const admin = require('firebase-admin');
var serviceAccount = require("./burj-al-arab-f8895-firebase-adminsdk-16hke-91c4e433d4.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://burjAlArab:jesmin123@cluster0.gt4ig.mongodb.net/burjAlArab?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const bookings = client.db("burjAlArab").collection("bookings");
    console.log('db connected successfully')

    app.post('/addBooking', (req, res) => {
        const newBooking = req.body;
        bookings.insertOne(newBooking)
            .then(result => {
                res.send(result.insertedCount > 0);
                //  console.log(result)
            })
        console.log(newBooking);
    })
    app.get('/bookings', (req, res) => {
        const bearer = req.headers.authorization;
        if (bearer && bearer.startsWith('Bearer ')) {
            const idToken = bearer.split(' ')[1];
            // console.log({ idToken });
            admin.auth().verifyIdToken(idToken)
                .then((decodedToken) => {
                    // const uid = decodedToken.uid;
                    // console.log(uid);
                    const tokenEmail = decodedToken.email;
                    const queryEmail = req.query.email;
                    // console.log(req.headers.authorization);
                    //    console.log(req.query.email)
                    //  console.log(tokenEmail, queryEmail)
                    if (tokenEmail == queryEmail) {
                        bookings.find({ email: queryEmail })
                            .toArray((err, documents) => {
                                res.send(documents)
                            })
                    }
                })
                .catch((error) => {
                    // Handle error
                });
        }
          else{
              res.status(401).send('un-authorized access')
          }
        



    })


});


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || port);
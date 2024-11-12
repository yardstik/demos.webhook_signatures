const crypto = require('crypto');

const express = require('express')
const app = express()
const port = 3000

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/', (req, res) => {
    const SIGNATURE = req.get('x-yardstik-webhook-signature');
    if (!SIGNATURE) {
        console.log('Missing x-yardstik-webhook-signature header');
        res.sendStatus(401);
        return;
    }

    const BODY = req.body;
    const HASH = crypto.createHmac('sha256', process.env.WEBHOOK_SIGNATURE).update(JSON.stringify(BODY)).digest('hex');

    if (SIGNATURE !== HASH) {
        console.log('Invalid signature');
        res.sendStatus(401);
        return;
    }

    // Your code here
    console.log(BODY)
    console.log(`This is the x-yardstik-webhook-signature: ` + SIGNATURE);
    console.log(`This is your application's calculated hash: ` + HASH);

    // Respond with a 200, if you do not respond with a success code Yardstik will retry the request.
    res.sendStatus(200);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

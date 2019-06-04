const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const app = express();
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
        host: 'ec2-184-72-238-22.compute-1.amazonaws.com',
        user: "vzrpabbzdskxvv",
        password: 'e89810503eaa23983f0830e778b38c611414c745c3735cdb7fb93c98b77500c9',
        database: 'd8frhdad0asndc',
        port:'5432'
    }
});


db.select('*').from('users').then(data => {
    console.log(data);
});

app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
    res.send('wiw');
});

app.post('/signin', (req, res) => {
    db.select('email', 'passwordhash').from('users')
        .where('email', '=', req.body.email)
        .then(data => {
            const valid = bcrypt.compareSync(req.body.password, data[0].passwordhash)
            if (valid) {
                return db.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(
                            {
                                name: user[0].name,
                                email: user[0].email,
                                phone: user[0].phone,
                                address: user[0].address,
                            }
                        )
                    })
                    .catch(err => res.status(400).json('unable to get user'));
            } else res.status(400).json('WRON1G');
        })
        .catch(err => res.status(400).json('WRONG2'))

});

app.post('/register', (req, res) => {
    const {email, name, password, phone, address} = req.body;
    console.log(req.body);
    const hash = bcrypt.hashSync(password);

    db('users').returning('*').insert({
        name: name,
        passwordhash: hash,
        email: email,
        phone: phone,
        address: address,
        gis: 'wow'
    }).then(user => res.json(user[0]))
        .catch(err => res.status(400).json(err));
});

app.post('/createOrder', (req, res) => {
    const {order,email} = req.body;
    console.log(order);


    db('orders').insert({
        email: email,
        orderjson: JSON.stringify(order)
    }).then(user => res.json({action: 'success'}))
        .catch(err => {
                res.status(400).json(err);
                console.log(err);
            }
        );
});

app.post('/getOrders', (req, res) => {
    let {email  }=  req.body;
    db.select('orderjson').from('orders')
        .where('email', '=',email)
        .then(orders => {
            res.json(
                {
                    orders
                }
            )
        })
        .catch(err => res.status(400).json('unable to get orders'));


});


app.listen(process.env.PORT || 3005, () => {
    console.log('server running on port ', process.env.PORT || 3005);
});

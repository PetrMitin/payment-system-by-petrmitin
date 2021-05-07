require('dotenv').config()
const express = require('express')
const cors = require('cors')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const path = require('path')
const app = express()

const port = process.env.PORT || 4000
const page_adress = "http://localhost:4000"

app.use(cors())
app.use(express.json())
app.get('/', (req, res, next) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

app.get('/success', (req, res, next) => {
    res.sendFile(path.resolve(__dirname, 'public', 'success.html'))
})

app.get('/cancel', (req, res, next) => {
    res.sendFile(path.resolve(__dirname, 'public', 'cancel.html'))
})

app.post('/create-checkout-session', async (req, res) => {
    const item = req.body.item
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
        {
            price_data: {
            currency: 'usd',
            product_data: {
                name: item.name,
            },
            unit_amount: item.price,
            },
            quantity: 1
        },
        ],
        mode: 'payment',
        success_url: `${page_adress}/success`,
        cancel_url: `${page_adress}/cancel`,
    })
    res.status(200).send({session_id: session.id})
})

app.listen(port, () => {
    console.log(`Running on port ${port}`)
})
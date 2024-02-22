import express from 'express'

const router = express.Router()
import Stripe from 'stripe';

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`)

router.post('/create-payment-intent', async (req, res) => {

    var { plan_price, plan_name } = req.body;

    try {
        const product = await stripe.products.create({
            name: plan_name
        });
        if (product) {
            var price = await stripe.prices.create({
                product: `${product.id}`,
                unit_amount: plan_price * 100,
                currency: 'usd'
            })
            if(price.id){
                        const session = await stripe.checkout.sessions.create({
                            mode: "payment",
                            payment_method_types: ["card"],
                                line_items: [
                                    {
                                        price: `${price.id}`,
                                        quantity: 1
                                    }
                                ],
                            success_url: 'http://localhost:5173/payment_success',
                            cancel_url: 'http://localhost:5173/payment_failed',
                        })            
                        res.json({ success: true, url: session.url })
                    }

        }
     } catch (error) {

        }
        // try {
        //     const product = await stripe.products.create({
        //         name: plan_name
        //     });
        //     if(product){
        //         var price = await stripe.prices.create({
        //             product: ${product.id},
        //             unit_amount: plan_price * 100,
        //             currency: 'usd'
        //         })

        //     if(price.id){
        //         const session = await stripe.checkout.sessions.create({
        //             mode: "payment",
        //             payment_method_types: ["card"],
        //                 line_items: [
        //                     {
        //                         price: ${price.id},
        //                         quantity: 1
        //                     }
        //                 ],
        //             success_url: 'http://localhost:5173/success',
        //             cancel_url: 'http://localhost:5173/cancel',
        //         })            
        //         res.json({ success: true, url: session.url })
        //     }
        // }
        // } catch (error) {
        //     console.log(error);
        // }
    })

export default router; 

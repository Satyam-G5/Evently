"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(`${process.env.STRIPE_SECRET_KEY}`);
router.post('/create-payment-intent', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var { plan_price, plan_name } = req.body;
    try {
        const product = yield stripe.products.create({
            name: plan_name
        });
        if (product) {
            var price = yield stripe.prices.create({
                product: `${product.id}`,
                unit_amount: plan_price * 100,
                currency: 'usd'
            });
            if (price.id) {
                const session = yield stripe.checkout.sessions.create({
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
                });
                res.json({ success: true, url: session.url });
            }
        }
    }
    catch (error) {
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
}));
exports.default = router;

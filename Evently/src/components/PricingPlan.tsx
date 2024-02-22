import { motion } from 'framer-motion';
// import { CardElement, useStripe, useElements, PaymentElement, Elements} from '@stripe/react-stripe-js';
import { useContext} from 'react';
import AppContext from '../Context_api/user.context';
import { useNavigate } from 'react-router-dom';
// import Payment from '../Payments/payment';
// import stripePromise from '../Payments/stripe';

const PricingPlan = () => {

  const appex = useContext(AppContext);
  const navigate = useNavigate()

  const handleopenPopup = async (plan_price : any, plan_name : any) => {
   

    const response = await fetch('/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan_price,
        plan_name
      }),
    });
    if (response) {
      const result = await response.json();
      window.location.href = result.url
  } else {
      console.log("No response from server at checkout");
  }
  }


  
  return (
    <div className="mt-32 ">
      <h1 className="text-4xl text-center p-2 font-semibold ">Upgrade to Premium Plan</h1>
      <h2 className="text-xl text-center p-2 mt-2 font-semibold ">To enjoy more of Evently exclusive features upgrade to premium plans and enjoy limitless features </h2>
      <div className="flex md:flex-row flex-col justify-center items-center mt-16">
        {/* Basic Plan */}

        <motion.div initial={{ opacity: 0, y: 100, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1 }}

          className="md:w-1/5 w-52 h-96 md:mt-0 md:mx-4 rounded-lg overflow-hidden shadow-lg p-6 bg-slate-100">
          <h2 className="text-3xl font-semibold mb-4 text-center">Basic Plan</h2>
          <div className="text-3xl mt-8 font-bold text-center mb-4">$0</div>
          <div className="flex flex-col items-center">
            <ul className=" flex text-center flex-col mb-4">
              <li>Feature 1</li>
              <li>Feature 2</li>
              <li>Feature 3</li>
            </ul>
            <button onClick={() => { appex?.loginState ? handleopenPopup(0 , 'Basic Plan') : navigate('/signIn') }} className="bg-orange-800 mt-20 text-white w-40 py-2 px-4 rounded-full hover:bg-blue-600">
              Subscribe
            </button>
          </div>
        </motion.div>

        {/* Premium Plan */}

          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1 }}

            className="md:w-1/5 w-52 h-96 md:mt-0 mt-8 md:mx-4 rounded-lg overflow-hidden shadow-lg p-6 bg-slate-100">
            <h2 className="text-3xl font-semibold mb-4 text-center">Premium Plan</h2>
            <div className="text-3xl mt-8 font-bold text-center mb-4">$9.99</div>
            <div className="flex flex-col items-center">
              <ul className=" flex text-center flex-col mb-4">
                <li>Feature 1</li>
                <li>Feature 2</li>
                <li>Feature 3</li>
              </ul>
              
              <button onClick={() => { appex?.loginState ? handleopenPopup(10 , 'Pro Plan') : navigate('/signIn') }} className="bg-orange-800 mt-20 text-white w-40 py-2 px-4 rounded-full hover:bg-blue-600">
                Subscribe
              </button>
            </div>
          </motion.div>

        {/* Pro Plan */}
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1 }}

          className="md:w-1/5 w-52 h-96 md:mt-0 mt-8 md:mx-4 rounded-lg overflow-hidden shadow-lg p-6 bg-slate-100">
          <h2 className="text-3xl font-semibold mb-4 text-center">Dev Plan</h2>
          <div className="text-3xl mt-8 font-bold text-center mb-4">$19.99</div>
          <div className="flex flex-col items-center">
            <ul className=" flex text-center flex-col mb-4">
              <li>Feature 1</li>
              <li>Feature 2</li>
              <li>Feature 3</li>
            </ul>
            {/* <CardElement/> */}

            <button onClick={() => { appex?.loginState ? handleopenPopup(20 , 'Dev Plan') : navigate('/signIn') }} className="bg-orange-800 mt-20 text-white w-40 py-2 px-4 rounded-full hover:bg-blue-600">
              Subscribe
            </button>
          
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingPlan;
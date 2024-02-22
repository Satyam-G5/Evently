import React from 'react';
import { Link } from 'react-router-dom';

const PaymentFailure: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-red-100">
      <div className="bg-white p-8 rounded shadow-lg flex-col text-center">
        <h2 className="text-3xl font-semibold mb-4 text-red-600">Payment Failed</h2>
        <p className="text-gray-700 mb-6">Oops! Something went wrong with your payment.</p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        <Link to='/'>
          Retry Payment
            </Link>
        </button>
      </div>
    </div>
  );
};

export default PaymentFailure;

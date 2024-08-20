import React from 'react';
import axios from 'axios';

const BEARER_TOKEN = "YOUR_HARD_CODED_TOKEN";  // Replace with the actual token

const PaymentPage = () => {

  const getRazorpayKey = async () => {
    try {
      const response = await axios.post('https://api.testbuddy.live/v1/payment/key', {}, {
        headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
      });
      return response.data.key;
    } catch (error) {
      console.error('Error fetching Razorpay key:', error);
    }
  };

  const createOrder = async () => {
    try {
      const response = await axios.post('https://api.testbuddy.live/v1/order/create', {
        packageId: '6613d6fbbf1afca9aa1b519e',
        pricingId: '662caa2d50bf43b5cef75232',
        finalAmount: 441,
        couponCode: 'NEET25'
      }, {
        headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
      });
      return response.data._id;
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const verifyOrder = async (transactionId, paymentId, signature) => {
    try {
      const response = await axios.post('https://api.testbuddy.live/v1/order/verify', {
        transactionId,
        razorpayPaymentId: paymentId,
        razorpaySignature: signature,
      }, {
        headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error verifying order:', error);
    }
  };

  const initiatePayment = async () => {
    const razorpayKey = await getRazorpayKey();
    const transactionId = await createOrder();

    const options = {
      key: razorpayKey,
      amount: 44100,  // Amount in paisa
      currency: 'INR',
      name: 'Your Company',
      description: 'Test Transaction',
      order_id: transactionId,
      handler: async (response) => {
        await verifyOrder(transactionId, response.razorpay_payment_id, response.razorpay_signature);
        alert('Payment Verified Successfully!');
      },
      prefill: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        contact: '919999999999',
      }
    };

    if (window.Razorpay) {
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } else {
      console.error("Razorpay SDK not loaded");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Make a Payment</h1>
        <p className="text-gray-600 text-center mb-8">
          Complete your transaction securely with Razorpay.
        </p>
        <button 
          onClick={initiatePayment} 
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;

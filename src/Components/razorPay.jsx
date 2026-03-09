import React, { useState } from "react";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Payment = () => {
  const [amount, setAmount] = useState("");

  const handlePayment = async () => {
    try {
      const orderResponse = await fetch(
        // "http://localhost:2000/payment/order", 
        `${backendUrl}/payment/order`,
        {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const orderData = await orderResponse.json();

      const options = {
        key: "rzp_test_K5ypQQHlyazruc",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Your App Name",
        description: "Test Transaction",
        order_id: orderData.id,
        handler: async (response) => {
          const { razorpay_payment_id, razorpay_signature } = response;

          try {
            const verifyResponse = await fetch(
              // "http://localhost:2000/payment/verify",
              `${backendUrl}/payment/verify`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: orderData.id,
                  razorpay_payment_id,
                  razorpay_signature,
                  amount,
                }),
              }
            );

            await verifyResponse.json();
            if (verifyResponse.status === 200) {
              alert("Payment successful!");
            } else {
              alert("Payment verification failed");
            }
          } catch (verifyError) {
            console.error("Verification error:", verifyError);
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: "John Doe",
          email: "john.doe@example.com",
          contact: "9999999999",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Order creation error:", error);
    }
  };

  return (
    <div>
      <h1>Make a Payment</h1>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
      />
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
};

export default Payment;

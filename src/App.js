/* eslint-disable */
import './App.css';
import StripePaymentForm from './Components/Stripe';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
    //       const paypalButtonsComponent = paypal.Buttons({
    //           style: {
    //             color: "gold",
    //             shape: "rect",
    //             layout: "vertical"
    //           },

    //           // set up the transaction
    //           createOrder: (data, actions) => {
    //               const createOrderPayload = {
    //                   purchase_units: [
    //                       {
    //                           amount: {
    //                               value: "88.44"
    //                           }
    //                       }
    //                   ]
    //               };

    //               return actions.order.create(createOrderPayload);
    //           },

    //           // finalize the transaction
    //           onApprove: (data, actions) => {
    //               const captureOrderHandler = (details) => {
    //                   const payerName = details.payer.name.given_name;
    //                   console.log('Transaction completed');
    //               };

    //               return actions.order.capture().then(captureOrderHandler);
    //           },

    //           // handle unrecoverable errors
    //           onError: (err) => {
    //               console.error('An error prevented the buyer from checking out with PayPal');
    //           }
    //       });

          
    //   const onClick = (e)=>{
    //     setType(e.target.value)
    //     if(e.target.value == 'paypal') {
    //         paypalButtonsComponent
    //       .render("#paypal-button-container")
    //       .catch((err) => {
    //           console.error('PayPal Buttons failed to render');
    //       });
    //     }
        
    //   }
  return (
    <div className="App">
        <StripePaymentForm />
        {/* <select onChange={onClick}>
            <option value="stripe">Pay By Stripe</option>
            <option value = 'paypal'>Pay By Paypal</option>
        </select>
        <div id="paypal-button-container"></div> */}
        <ToastContainer />
    </div>
  );
}

export default App;

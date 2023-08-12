/* eslint-disable */
import React from 'react'
import './style-stripe.css'
import {
    Elements,
    ElementsConsumer,
    CardElement,
    CardNumberElement,
    CardCvcElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentForm';
import axios from 'axios';
import {BASE_URL} from '../client-config'
import {toast} from 'react-toastify'
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);
class stripePaymentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stripeLoader: false,
            business:'Chartered Business',
            customer_name:"",
            business_description:"",
            amount:"",
            type:"stripe",
            paypal_amount:0,
            paypal_error:null
        }
    }

    hanldeCustomer = (value)=>{
        this.setState({customer_name:value})
    }

    hanldeAmount = (value)=>{
        this.setState({amount:value})
    }

    handleInput = (value)=>{
        this.setState({business_description:value})
    }

    handleTypeChange = (e)=>{
        this.setState({type:e.target.value})
        if(e.target.value == 'paypal') {
            const paypalButtonsComponent = paypal.Buttons({
                style: {
                  color: "gold",
                  shape: "rect",
                  layout: "vertical"
                },
    
                // set up the transaction
                createOrder: (data, actions) => {
                    const createOrderPayload = {
                        purchase_units: [
                            {
                                amount: {
                                    value: this.state.paypal_amount
                                }
                            }
                        ]
                    };
    
                    return actions.order.create(createOrderPayload);
                },
    
                // finalize the transaction
                onApprove: (data, actions) => {
                    const captureOrderHandler = (details) => {
                        const payerName = details.payer.name.given_name;
                        console.log('Transaction completed',details);
                        this.setState({paypal_error:false})
                        toast.success("Payment Successfull")
                    };
    
                    actions.order.capture().then(captureOrderHandler);
                    setTimeout(()=>{
                        window.location.href='/'
                      },3000)
                      return
                },
    
                // handle unrecoverable errors
                onError: (err) => {
                    console.error('An error prevented the buyer from checking out with PayPal',err);
                    this.setState({paypal_error:true})
                    toast.error("Payment Failed")
                }
            });
            paypalButtonsComponent
          .render("#paypal-button-container")
          .catch((err) => {
              console.error('PayPal Buttons failed to render');
              this.setState({paypal_error:true})
          });
          if(this.state.paypal_error === false) {
              setTimeout(()=>{
                window.location.href='/'
              },3000)
          }
        }
    }
    
    
    handleSubmit = async (event, obj) => {
        console.log("in handle submit")
        event.preventDefault();
        const card = obj.elements.getElement(CardCvcElement);
        this.setState({ stripeLoader: true })
        let result
        let response
        let cardInfo
        if(card) {
            result = await obj.stripe.createToken(card);
            console.log("result",result)
            if(result.error) {
                props.setDisable(false)
                toast.error(result.error.message)
                this.setState({ stripeLoader: false })
                return
            } else { // if user is editing or making new card payment
                response = await axios.post(`${BASE_URL}stripe/charge_payment`, {
                    amount: this.state.amount * 100,
                    stripe_token: result.token.id,
                    customer_name: this.state.customer_name,
                    business_description: this.state.business_description
                })
                console.log("response",response)
                if(response.data.success) {
                    const result1 = await obj.stripe.confirmCardPayment(
                        response.data.successResponse, {
                            payment_method: {
                                card: card
                            }
                        }
                    )
    
                    if(result1 && result1.paymentIntent && result1.paymentIntent.status == "succeeded") {
                        this.setState({ stripeLoader: false })
                        toast.success("Payment Successfull")
                        setTimeout(()=>{
                            window.location.href='/'
                        },3000)
                    } else {
                        toast.error("Payment Failed")
                        this.setState({ stripeLoader: false })
                    }
                } else {
                    toast.error("Payment Failed")
                    this.setState({ stripeLoader: false })
                }

                
            }           
        } else {
            props.setDisable(false)
            toast.error("Payment Failed")
            this.setState({ stripeLoader: false })
        }
       
    };

    render() {
        
        return (
            <div className="form-style-10">
                {/* <h1>{this.state.business}</h1> */}
                <h1>Chartered Business</h1>
                {this.state.type != 'stripe' && <input type='number' placeholder='Enter Amount' onChange={(e)=>this.setState({paypal_amount:e.target.value})}/>}
                {/* <select disabled={this.state.paypal_amount==0 ? true : false} onChange={this.handleTypeChange}>
                    <option value="">Select Payment Type</option>
                    <option value="stripe">Pay By Stripe</option>
                    <option value = 'paypal'>Pay By Paypal</option>
                </select> */}
                {this.state.type == 'stripe' && <form id="payment-form">
                        <Elements stripe={stripePromise}>
                            <PaymentForm handleBusiness={this.handleInput} hanldeCustomer={this.hanldeCustomer} hanldeAmount={this.hanldeAmount} amount={this.state.amount} customer={this.state.customer_name} business={this.state.business_description} stripeLoader={this.state.stripeLoader} handleSubmit={this.handleSubmit}/>
                        </Elements>
                </form>}
                {
                    <div id="paypal-button-container"></div>
                }
            </div>
        );
    }
}

export default stripePaymentForm
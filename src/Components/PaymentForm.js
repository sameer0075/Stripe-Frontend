/* eslint-disable */
import React, { useMemo } from "react";
import './style-stripe.css'
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  CardElement
} from "@stripe/react-stripe-js";
import _ from "lodash";
import axios from 'axios';
import {BASE_URL} from '../client-config'

const useOptions = () => {
  const fontSize = '16px';
  const options = useMemo(
    () => ({
      style: {
        base: {
          fontSize,
          color: "#424770",
          letterSpacing: "0.025em",
          fontFamily: "Source Code Pro, monospace",
          "::placeholder": {
            color: "#aab7c4"
          }
        },
        invalid: {
          color: "#9e2146"
        }
      }
    }),
    [fontSize]
  );

  return options;
};

const PaymentForm = (props) => {
  const stripe = useStripe();
  const elements = useElements();
  const options = useOptions();
  let [cardNumberValid , setCardNumberValid] = React.useState('')
  let [cardExpiry, setCardExpiry] = React.useState('')
  let [cardCvc, setCardCvc] = React.useState('')
  let [isError, setIsError] = React.useState(true)
  let [customer, setCustomer] = React.useState("")
  let [business, setBusiness] = React.useState("")
  let [disable, setDisable] = React.useState(false)


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    const card = elements.getElement(CardNumberElement);
    const result = await stripe.createToken(card);
    console.log(result,"---------<")
    if(result.error) {
        console.log(result.error.message);
    }
    else {
        console.log(result.token);
    }
  };

  const passtoParent = async (event) => {
    setDisable(true)
    let obj = {
        stripe: stripe,
        elements: elements,
    }

    props.handleSubmit(event, obj,setDisable);
  }
   const isDisabled = () => {
    let cardNumber = cardNumberValid
    let cardexpiry = cardExpiry
    let cardcvc = cardCvc
    return cardNumber == '' || cardexpiry == '' || cardcvc == '' || isError || props.customer=='' || props.business=='' || props.amount == '' || disable==true
  }


  return (
      <> 
          <div className="row">
              <div className="col-lg-12">
                  <label className="w-100" style={{textAlign:"left",fontSize:"15px"}}>
                      Card number
                      <CardNumberElement
                          options={options}
                          onReady={() => {
                              console.log("CardNumberElement [ready]");
                          }}
                          onChange={(event) => {
                              console.log("CardNumberElement [change]", event);
                              setCardNumberValid(event)
                              if (event.complete && !event.error) {
                                setIsError(false)
                            } else {
                                setIsError(true)
                            }    
                          }}
                          onBlur={() => {
                              console.log("CardNumberElement [blur]");
                          }}
                          onFocus={() => {
                              console.log("CardNumberElement [focus]");
                          }}
                      />
                      {cardNumberValid != '' && (!cardNumberValid.complete || cardNumberValid.error) && <span style={{ color: 'red' }}>Invalid Card Number</span>}
                  </label>
              </div>
          </div>
          <div className="row">
              <div className="col-lg-12">
                  <label className="w-100" style={{textAlign:"left",fontSize:"15px"}}>
                      Expiration date
                      <CardExpiryElement
                          options={options}
                          onReady={() => {
                              console.log("CardNumberElement [ready]");
                          }}
                          onChange={(event) => {
                              console.log("CardNumberElement [change]", event);
                              setCardExpiry(event)
                              if (event.complete && !event.error) {
                                props.setIsError(false)
                            } else {
                                props.setIsError(true)
                            }    
                          }}
                          onBlur={() => {
                              console.log("CardNumberElement [blur]");
                          }}
                          onFocus={() => {
                              console.log("CardNumberElement [focus]");
                          }}
                      />
                      {cardExpiry != '' && (!cardExpiry.complete || cardExpiry.error) && <span style={{ color: 'red' }}>Invalid Card Expiry</span>}
                  </label>
              </div>
          </div>
          <div className="row">
              <div className="col-lg-12">
                  <label className="w-100" style={{textAlign:"left",fontSize:"15px"}}>
                      CVC
                      <CardCvcElement
                          options={options}
                          onReady={() => {
                              console.log("CardNumberElement [ready]");
                          }}
                          onChange={(event) => {
                              console.log("CardNumberElement [change]", event);
                              setCardCvc(event)
                              if (event.complete && !event.error) {
                                props.setIsError(false)
                            } else {
                                props.setIsError(true)
                            }    
                          }}
                          onBlur={() => {
                              console.log("CardNumberElement [blur]");
                          }}
                          onFocus={() => {
                              console.log("CardNumberElement [focus]");
                          }}
                      />
                      {cardCvc != '' && (!cardCvc.complete || cardCvc.error) && <span style={{ color: 'red' }}>Invalid Card CVC</span>}
                  </label>
              </div>
          </div>
          <div className="row">
              <div className="col-12">
              <label className="w-100" style={{textAlign:"left",fontSize:"15px"}}>Amount</label>
              <input onChange={(e)=>props.hanldeAmount(e.target.value)} placeholder='Enter Amount' type="number" className="amountfield"/>
              </div>
          </div>

          <div className="row mb-4">
              <div className="col-12">
              <label className="w-100" style={{textAlign:"left",fontSize:"15px"}}> Customer Name</label>
              <input onChange={(e)=>props.hanldeCustomer(e.target.value)} placeholder='Enter Customer Name' type="text" className="customer"/>
              </div>
          </div>

          <div className="row">
              <div className="col-12">
              <label className="w-100" style={{textAlign:"left",fontSize:"15px"}}>Business Name</label>
              {/* <input value={props.business} onChange={(e)=>props.handleInput(e.target.value)} placeholder='Enter Business Name' type="text" className="business"/> */}
              <input onChange={(e)=>props.handleBusiness(e.target.value)} placeholder='Enter Business Name' type="text" className="business"/>
              </div>
          </div>
          
          
          {/* {props.stripeLoader || props.netWork ?
              <button
                  disabled={true}
                  style={{ width: '240px' }}
                  className="btn btn-primary w-100 float-right mt-3 custom-default-red-button"
              >
                  <i className="fa fa-spinner fa-spin"></i>
                  Loading
              </button>
              :
              
          } */}
          {disable==false ? <button disabled={isDisabled() || !stripe } style={{backgroundColor:'#2A88AD'}} className="btn btn-primary w-100 float-right mt-3 custom-default-red-button" onClick={passtoParent}>
                  Pay
        </button> : <button disabled={true} style={{backgroundColor:'#2A88AD'}} className="btn btn-primary w-100 float-right mt-3 custom-default-red-button" onClick={passtoParent}>
                  Loading <i className="fa fa-circle-o-notch fa-spin"></i>
        </button>}
      </>
      );
};

export default PaymentForm;

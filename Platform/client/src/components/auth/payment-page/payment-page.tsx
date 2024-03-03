import React, { useState, useEffect } from 'react';
import './payment-page.css';
import { useNavigate } from 'react-router-dom';
import { FaCcPaypal } from "react-icons/fa6";
import { FaCcMastercard } from "react-icons/fa";
import { SiAmericanexpress } from "react-icons/si";
import { FaCcDiscover } from "react-icons/fa";
import { FaCcJcb } from "react-icons/fa";
import Cookies from 'universal-cookie';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const cookies = new Cookies();

// Renders errors or successfull transactions on the screen.
function Message({ content }) {
  return <p>{content}</p>;
}

function PaymentPage() {
  const [isLoading, setLoading] = useState(false);
  const [hasSteam, setSteam] = useState(false);
  const [message, setMessage] = useState("");

  const initialOptions = {
    "client-id": `${process.env.REACT_APP_PAYPAL_CLIENT_ID}`,
    "enable-funding": "paylater,card",
    "disable-funding": "",
    "data-sdk-integration-source": "integrationbuilder_sc",
    vault: "true",
    intent: "subscription",
    components: "buttons"
  };



  useEffect(() => {
    // Fetch and check Steam ID when component mounts or userEmail changes
    fetch('http://localhost:3001/checksteamid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userEmail: cookies.get('USER_DATA')?.email,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setSteam(data.hasSteamID); // Set hasSteam based on the response
      })
      .catch((error) => {
        console.error('Error checking Steam ID:', error);
      });
  }, [cookies.get('USER_DATA')?.email]);

  const setPaymentStatusAndVM = () => {
    setLoading(true);
    fetch('http://localhost:3001/setpaiduser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userEmail: cookies.get('USER_DATA')?.email,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setLoading(false);
          if (hasSteam) {
            window.location.href = '/';
          } else {
            window.location.href = '/steam-login'
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('There was a problem with the fetch operation:', error);
      });
  };


  return (
   <div id='backbox'>
  <div id='box'>
  <div id="info-steam-connect">
  <h2>Subscribe now</h2>
  <p> And enjoy 20h of high quality gaming per month</p>
  <div id='login-create-account'>
        <p className="small-notification">Continue without subscription</p>
        <a className="small-notification" href='./'>Skip</a>
        {isLoading && <p className='small-notification-setup'>Setting up gaming machine</p>}
       
      </div>
  </div>

    <div id='steambutton'>
    
    <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{
            shape: "pill",
            layout: "vertical",
          }}
          createSubscription={async () => {
            try {
              const response = await fetch("http://localhost:3001/api/paypal/create-subscription", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userAction: "SUBSCRIBE_NOW", 
                  userEmail: cookies.get('USER_DATA')?.email
              }),
              });
              const data = await response.json();
              if (data?.id) {
                setMessage(`Successful subscription...`);
                return data.id;
              } else {
                console.error(
                  { callback: "createSubscription", serverResponse: data },
                  JSON.stringify(data, null, 2),
                );
                // (Optional) The following hides the button container and shows a message about why checkout can't be initiated
                const errorDetail = data?.details?.[0];
                setMessage(
                  `Could not initiate PayPal Subscription...<br><br>${
                    errorDetail?.issue || ""
                  } ${errorDetail?.description || data?.message || ""} ` +
                    (data?.debug_id ? `(${data.debug_id})` : ""),
                  { hideButtons: true },
                );
              }
            } catch (error) {
              console.error(error);
              setMessage(`Could not initiate PayPal Subscription...${error}`);
            }
          }}
          onApprove={async (data, actions) => {
            /*
              No need to activate manually since SUBSCRIBE_NOW is being used.
              Learn how to handle other user actions from our docs:
              https://developer.paypal.com/docs/api/subscriptions/v1/#subscriptions_create
            */
            if (data.orderID) {
             //set subscription to yes in database
              setPaymentStatusAndVM();
              

              setMessage(
                `You have successfully subscribed to the plan. Your subscription id is: ${data.subscriptionID}`,
              );
            } else {
              setMessage(
                `Failed to activate the subscription: ${data.subscriptionID}`,
              );
            }
          }}
        />
      </PayPalScriptProvider>
      <Message content={message} />
    </div>
  ;
      <div id='steam-container-subscribe'>             
          {isLoading && 
          <div className = 'loader-subscribe'> </div>
        }
    </div>
      


      </div>
    </div>
  )
}

export default PaymentPage
const fetch = require('cross-fetch');
const User = require ('./User')
require('dotenv').config();

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_PLAN_ID } = process.env;
const base = "https://api-m.sandbox.paypal.com";

interface AccessTokenResponse {
  access_token: string;
}

export const generateAccessToken = async (): Promise<string> => {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error("MISSING_API_CREDENTIALS");
  }
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  const data: AccessTokenResponse = await response.json();
  return data.access_token;
};



export const createSubscription = async (userAction = "SUBSCRIBE_NOW", userEmail:any) => {
  const accessToken = await generateAccessToken();
  const response = await fetch(`${base}/v1/billing/subscriptions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      plan_id: PAYPAL_PLAN_ID,
      application_context: {
        user_action: userAction,
      },
    }),
  });
  //put paypal id into db
  if(response.ok) {
    const user = await User.findOne({ email: userEmail });
    console.log(userEmail);
    user.plan_id = PAYPAL_PLAN_ID || false;
    await user.save();
  }

  if (!response.ok) {
    throw new Error("Failed to create subscription");
  }
  return await response.json();
};

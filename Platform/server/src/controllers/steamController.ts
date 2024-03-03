const express = require('express');
const fetch = require('cross-fetch');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

export const getSteamId = async (req:any, res:any) => {
  try {
    const steamIdString = req.query['openid.claimed_id'] as string;
    const steamId = steamIdString.substring(steamIdString.length - 17);
    const email = (req.user as any).userEmail; // Casting to 'any' as req.user doesn't have type 'User'
    const user = await User.findOne({ email: email });

    if (user) {
      user.steamID = steamId;
      await user.save();
      res.redirect('http://localhost:3000/auth/steam/return');
    } else {
      res.status(404).send({ error: '404', message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'An unknown error occurred' });
  }
};

export const getSteamGames = async (req:any, res:any) => {
  try {
    const { userEmail } = req.body;
    const user = await User.findOne({ email: userEmail });
    const steamID = user?.steamID;

    const response = await fetch(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.REACT_APP_STEAM_API_KEY}&steamid=${steamID}&format=json&include_appinfo=true`);
    if (!response.ok) {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      res.status(response.status).json({ message: `Error: ${response.status} - ${response.statusText}` });
      return;
    }

    const data = await response.json();
    if (!data.response.games) {
      res.status(404).json({ message: 'No games found' });
      return;
    }
    const games = data.response.games;

    if (user) {
      user.games = games;
      await user.save();
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'An unknown error occurred' });
  }
};

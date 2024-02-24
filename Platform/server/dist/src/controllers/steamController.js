import fetch from 'node-fetch';
import dotenv from 'dotenv';
import User from '../models/User.js';
dotenv.config();
export const getSteamId = async (req, res) => {
    try {
        const steamIdString = req.query['openid.claimed_id'];
        const steamId = steamIdString.substring(steamIdString.length - 17);
        const email = req.user.userEmail;
        const user = await User.findOne({ email: email });
        if (user) {
            await user.save();
        }
        if (!user) {
            res.status(404).send({ error: '404', message: 'User not found' });
            return;
        }
        user.steamID = steamId;
        await user.save();
        res.redirect('http://localhost:3000/auth/steam/return');
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        }
        else {
            res.status(500).json({ message: 'an unkown error occurred' });
        }
    }
};
export const getSteamGames = async (req, res) => {
    // to get games from user, his account privacy settings for Game Details should be set to 'public'.
    // https://steamcommunity.com/profiles/76561199629789524/edit/settings
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
            console.log('No games found');
            return;
        }
        const games = data.response.games;
        if (user) {
            user.games = games;
            await user.save();
        }
        res.json(data);
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(err);
            res.status(500).json({ message: err.message });
        }
        else {
            res.status(500).json({ message: 'an unkown error occurred' });
        }
    }
};

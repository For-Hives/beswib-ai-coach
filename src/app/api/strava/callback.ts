import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import User from '@/models/User'; // adapte le chemin selon ton projet
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;
  const token = Array.isArray(req.query.state) ? req.query.state[0] : req.query.state;
  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;
  const redirectUri = process.env.STRAVA_REDIRECT_URI;

  if (!code) return res.status(400).send('Code manquant');
  if (!token) return res.status(401).send('Non autorisé (pas de token)');

  let userId;
  try {
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET || 'vraiment_pas_secure');
    if (typeof decoded === 'object' && decoded !== null) {
      userId = (decoded as any).id || (decoded as any)._id;
    }
  } catch (err) {
    console.error('Erreur de décodage JWT:', err);
    return res.status(401).send('Token invalide');
  }

  let tokenRes;
  try {
    tokenRes = await axios.post('https://www.strava.com/oauth/token', {
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    });
  } catch (err: any) {
    console.error('Erreur lors de la récupération du token Strava:', err?.response?.data || err);
    return res.status(500).json({ error: 'Erreur lors de la récupération du token Strava', details: err?.response?.data || err });
  }

  const { access_token, refresh_token, expires_at, athlete } = tokenRes.data;
  if (!athlete || !athlete.id) {
    console.error('Réponse Strava incomplète:', tokenRes.data);
    return res.status(500).json({ error: 'Réponse Strava incomplète', details: tokenRes.data });
  }

  // Stocker plus d'infos utiles sur l'athlète pour debug/fonctionnalités futures
  const stravaData = {
    token: access_token,
    refresh_token,
    expires_at,
    athlete_id: athlete.id,
    username: athlete.username || '',
    firstname: athlete.firstname || '',
    lastname: athlete.lastname || '',
    profile: athlete.profile || '',
    city: athlete.city || '',
    country: athlete.country || '',
  };

  try {
    await User.findByIdAndUpdate(userId, { strava: stravaData });
  } catch (err) {
    console.error('Erreur lors de la sauvegarde utilisateur:', err);
    return res.status(500).json({ error: 'Erreur lors de la sauvegarde utilisateur', details: err });
  }

  // Redirige vers le profil ou une page de succès
  res.redirect('/profile');
}

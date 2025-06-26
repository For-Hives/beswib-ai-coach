import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const redirectUri = encodeURIComponent(process.env.STRAVA_REDIRECT_URI!);
  const scope = 'activity:read_all,profile:read_all';
  const url = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=auto&scope=${scope}`;
  res.redirect(url);
}

import { NextApiRequest, NextApiResponse } from 'next';

export default function logout(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Clear the cookies by setting them to expire immediately
    res.setHeader('Set-Cookie', [
      'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly',
      'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly'
    ]);
    res.status(200).json({ message: 'Logged out successfully' });
  } else {
    // Respond with method not allowed for other request methods
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

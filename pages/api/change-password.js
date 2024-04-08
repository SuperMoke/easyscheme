import { getSession } from 'next-auth/react';
import { app } from '../../src/app/firebase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const session = await getSession({ req });
    console.log(session)
    if (!session) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { oldPassword, newPassword, confirmPassword } = req.body;
    const { email } = session.user;

    if (newPassword !== confirmPassword) {
      res.status(400).json({ error: "New password and confirm password don't match" });
      return;
    }

    try {
      const userCredential = await app.auth().signInWithEmailAndPassword(email, oldPassword);
      await userCredential.user.updatePassword(newPassword);
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing password:', error.message); // Log specific error message
        res.status(500).json({ error: 'Failed to change password' });
      }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

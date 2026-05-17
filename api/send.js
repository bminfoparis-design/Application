export const runtime = 'nodejs';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { nom, email, offre, message } = req.body;

  if (!nom || !email || !offre || !message) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Votre Site <contact@votredomaine.com>', // À remplacer plus tard
      to: ['BM.INFO.PARIS@GMAIL.COM'],
      subject: `Nouvelle demande IA - ${offre}`,
      replyTo: email,
      html: `
        <p><strong>Nom :</strong> ${nom}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Offre :</strong> ${offre}</p>
        <p><strong>Message :</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
      `,
    });

    if (error) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur interne' });
  }
}

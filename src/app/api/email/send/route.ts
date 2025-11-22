import { NextRequest, NextResponse } from 'next/server';
import Brevo from '@getbrevo/brevo';

export async function POST(req: NextRequest) {
  try {
    const { to, subject, html } = await req.json();

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Configura il client Brevo
    const apiInstance = new Brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      Brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY as string
    );

    // Prepara la email
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.sender = {
      email: process.env.BREVO_SENDER_EMAIL ?? 'no-reply@tua-app.com',
      name: process.env.BREVO_SENDER_NAME ?? 'La Mia App',
    };
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;

    // Invia l'email
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: (error as Error).message },
      { status: 500 }
    );
  }
}

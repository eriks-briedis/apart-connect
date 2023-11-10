import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend'

export interface SendEmailParams {
  receiverName: string;
  receiverEmail: string;
  subject: string;
  html: string;
}

const mailerSend = new MailerSend({
  apiKey: process.env.MAILSENDER_API_KEY || '',
})

export const sendEmail = async ({ receiverName, receiverEmail, subject, html }: SendEmailParams) => {
  const sentFrom = new Sender('apart-connect@eriks-briedis.lv', 'ApartConnect')
  const recipients = [
    new Recipient(receiverEmail, receiverName),
  ]

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject(subject)
    .setHtml(html)

  if (process.env.ENV === 'development') {
    console.log('Email would be sent with params:', emailParams)
    return
  }

  await mailerSend.email.send(emailParams)
}

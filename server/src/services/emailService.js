import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendEmail(to, subject, html) {
  return transporter.sendMail({
    from: `"App" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html,
  });
}

// lib/mailer.ts
import nodemailer from 'nodemailer';
import React from 'react';
import OrderEmail from '@/components/email/OrderEmail';
import OrderPickup from '@/components/email/OrderPickup';
import OrderComplete from '@/components/email/OrderComplete';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface OrderEmailProps {
  orderNumber: string;
  buyer: { firstName: string; lastName: string, email: string };
  items: OrderItem[];
  total: number;
  store: any;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify().then(() => {
  console.log('[mailer] SMTP connection OK');
}).catch(err => {
  console.error('[mailer] SMTP connection failed:', err);
});

export async function sendOrderEmail(to: string, props: OrderEmailProps) {
  // dynamically import render util so Next.js build doesn't choke
  const { render } = await import('@react-email/render');

  // render your React-Email component to HTML
  const html = await render(<OrderEmail {...props} />);

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: `Your Order Confirmation (#${props.orderNumber})`,
      html,
    });

    console.log(info)


    return info;
  } catch (err) {
    console.error('[mailer] Error sending mail:', err);
    throw err;
  }
}

export async function sendPickupEmail(to: string, props: OrderEmailProps) {
  // dynamically import render util so Next.js build doesn't choke
  const { render } = await import('@react-email/render');

  // render your React-Email component to HTML
  const html = await render(<OrderPickup {...props} />);

  try {
    console.log(`Your Order (#${props.orderNumber}) is ready for pickup`)
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: `Your Order (#${props.orderNumber}) is ready for pickup`,
      html,
    });

    console.log(info)


    return info;
  } catch (err) {
    console.error('[mailer] Error sending mail:', err);
    throw err;
  }
}

export async function sendCompleteEmail(to: string, props: OrderEmailProps) {
  // dynamically import render util so Next.js build doesn't choke
  const { render } = await import('@react-email/render');

  // render your React-Email component to HTML
  const html = await render(<OrderComplete {...props} />);

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: `Your Order (#${props.orderNumber}) is complete`,
      html,
    });

    console.log(info)


    return info;
  } catch (err) {
    console.error('[mailer] Error sending mail:', err);
    throw err;
  }
}
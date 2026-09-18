import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const prerender = false;

const env = (k: string, d = '') => process.env[k] ?? import.meta.env[k] ?? d;
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export const POST: APIRoute = async ({ request, redirect }) => {
  const fd = await request.formData();
  const wantsJson = (request.headers.get('accept') ?? '').includes('application/json');
  const g = (k: string) => String(fd.get(k) ?? '').trim().slice(0, 2000);

  if (g('website')) return json({ ok: true }); // honeypot

  const ime = g('ime'), obrt = g('obrt'), email = g('email');
  if (!ime || !obrt || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return wantsJson ? json({ error: 'Ispunite ime, naziv obrta i ispravan e-mail.' }, 400) : redirect('/kontakt?greska=1');
  }

  const text = [
    `Ime: ${ime}`, `Obrt/tvrtka: ${obrt}`, `E-mail: ${email}`, `Web: ${g('web') || '-'}`,
    `Djelatnost: ${g('djelatnost')}`, `Paket: ${g('paket') || '-'}`, '', g('poruka') || '(bez poruke)',
  ].join('\n');

  try {
    const transporter = nodemailer.createTransport({
      host: env('SMTP_HOST'),
      port: Number(env('SMTP_PORT', '587')),
      secure: env('SMTP_SECURE') === 'true',
      auth: env('SMTP_USER') ? { user: env('SMTP_USER'), pass: env('SMTP_PASS') } : undefined,
    });
    await transporter.sendMail({
      from: env('MAIL_FROM', 'web@mojacijena.hr'),
      to: env('MAIL_TO', 'igor@timis.digital'),
      replyTo: email,
      subject: `Upit s mojacijena.hr: ${obrt}`,
      text,
    });
  } catch (err) {
    console.error('kontakt: slanje nije uspjelo', err);
    return wantsJson ? json({ error: 'Slanje nije uspjelo. Pokušajte ponovno ili nam pišite na e-mail.' }, 500) : redirect('/kontakt?greska=1');
  }

  return wantsJson ? json({ ok: true }) : redirect('/kontakt?poslano=1');
};

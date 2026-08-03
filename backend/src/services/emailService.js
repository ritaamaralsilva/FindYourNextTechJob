const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

async function enviarEmailVerificacao(destinatario, token) {
  const link = `${process.env.FRONTEND_URL}/verificar-email?token=${token}`;

  await resend.emails.send({
    from: "FindYourNextTechJob <onboarding@resend.dev>",
    to: destinatario,
    subject: "Confirma o teu email — FindYourNextTechJob",
    html: `
      <p>Olá!</p>
      <p>Clica no link para confirmares a tua conta:</p>
      <p><a href="${link}">${link}</a></p>
      <p>Se não te registaste, ignora este email.</p>
    `,
  });
}

async function enviarEmailResetPassword(destinatario, token) {
  const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await resend.emails.send({
    from: "FindYourNextTechJob <onboarding@resend.dev>",
    to: destinatario,
    subject: "Redefinir a tua password — FindYourNextTechJob",
    html: `
      <p>Pediste para redefinir a tua password.</p>
      <p>Clica no link (válido durante 1 hora):</p>
      <p><a href="${link}">${link}</a></p>
      <p>Se não foste tu, ignora este email.</p>
    `,
  });
}

module.exports = { enviarEmailVerificacao, enviarEmailResetPassword };
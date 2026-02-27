const nodemailer = require("nodemailer");

function createTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn("SMTP no configurado completamente. No se enviarán correos reales.");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
}

async function sendOrderEmail({ to, customerEmail, items, total }) {
  const transport = createTransport();
  if (!transport) {
    return;
  }

  const lines = items.map(
    (item) =>
      `- ${item.name} (ID ${item.id}) x${item.quantity} = Q ${item.price * item.quantity}`
  );

  const text = [
    `Nueva compra en Circuit`,
    ``,
    `Cliente: ${customerEmail}`,
    ``,
    `Productos:`,
    ...lines,
    ``,
    `Total: Q ${total}`
  ].join("\n");

  await transport.sendMail({
    from: `"Circuit" <${process.env.SMTP_USER}>`,
    to,
    subject: "Nueva compra en Circuit",
    text
  });
}

module.exports = {
  sendOrderEmail
};


export async function sendContactMail(input: { name: string; email: string; subject: string; message: string }) {
  if (!process.env.RESEND_API_KEY) {
    console.log("[contact]", input);
    return { ok: true };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "noqta <noreply@noqta.ai>",
      to: ["hi@noqta.ai"],
      subject: `[noqta] ${input.subject}`,
      html: `<p><b>${input.name}</b> (${input.email})</p><p>${input.message}</p>`,
    }),
  });
  return { ok: res.ok };
}

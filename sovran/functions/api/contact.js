// POST /api/contact — validates the contact/reservation form.
// Placeholder: wire delivery (email, CRM, Slack) where marked before launch.
export async function onRequestPost({ request }) {
  const wantsJson = (request.headers.get("Accept") || "").includes("application/json");
  const reply = (ok, status, error) =>
    wantsJson
      ? Response.json(ok ? { ok } : { ok, error }, { status })
      : Response.redirect(new URL(ok ? "/contact?sent=1" : "/contact", request.url), 303);

  let form;
  try { form = await request.formData(); } catch { return reply(false, 400, "Invalid form"); }

  if (form.get("company")) return reply(true, 200); // honeypot: pretend success

  const data = Object.fromEntries(
    ["name", "email", "phone", "watch", "message"].map(k => [k, String(form.get(k) || "").trim().slice(0, 4000)])
  );
  if (!data.name || !data.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return reply(false, 422, "Missing or invalid fields");
  }

  // TODO: deliver `data` (e.g. via an email API using a secret from env).
  console.log("contact", JSON.stringify(data));
  return reply(true, 200);
}

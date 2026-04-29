import type { APIContext, APIRoute } from "astro";
import { env as workersEnv } from "cloudflare:workers";

export const prerender = false;

const NO_STORE_HEADERS = { "Cache-Control": "no-store" };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUBJECT_LABELS = new Map([
  ["foto-deportiva", "Fotografia deportiva"],
  ["video-comercial", "Video comercial"],
  ["videoclip", "Videoclip musical"],
  ["evento", "Cobertura de evento"],
  ["colaboracion", "Colaboracion / Marca"],
  ["otro", "Otro"],
]);

interface ContactFormPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  company: string;
}

interface ContactEnv {
  RESEND_API_KEY?: string;
  CONTACT_FORM_TO_EMAIL?: string;
  CONTACT_FORM_FROM_EMAIL?: string;
}

type SendContactEmailResult =
  | { ok: true }
  | { ok: false; code: "missing_config" | "send_failed"; message: string };

function toTrimmedString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeSingleLine(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) {
    return true;
  }

  return origin === new URL(request.url).origin;
}

function getContactEnv(): ContactEnv {
  return {
    RESEND_API_KEY: workersEnv.RESEND_API_KEY ?? import.meta.env.RESEND_API_KEY,
    CONTACT_FORM_TO_EMAIL: workersEnv.CONTACT_FORM_TO_EMAIL ?? import.meta.env.CONTACT_FORM_TO_EMAIL,
    CONTACT_FORM_FROM_EMAIL:
      workersEnv.CONTACT_FORM_FROM_EMAIL ?? import.meta.env.CONTACT_FORM_FROM_EMAIL,
  };
}

function readContactPayload(formData: FormData): ContactFormPayload {
  return {
    name: normalizeSingleLine(toTrimmedString(formData.get("name"))),
    email: normalizeSingleLine(toTrimmedString(formData.get("email"))).toLowerCase(),
    subject: normalizeSingleLine(toTrimmedString(formData.get("subject"))),
    message: toTrimmedString(formData.get("message")),
    company: normalizeSingleLine(toTrimmedString(formData.get("company"))),
  };
}

function validateContactPayload(payload: ContactFormPayload): string | null {
  if (payload.company.length > 0) {
    return null;
  }

  if (payload.name.length < 2 || payload.name.length > 120) {
    return "Nombre no valido.";
  }

  if (payload.email.length < 5 || payload.email.length > 320 || !EMAIL_PATTERN.test(payload.email)) {
    return "Email no valido.";
  }

  if (!SUBJECT_LABELS.has(payload.subject)) {
    return "Selecciona un motivo valido.";
  }

  if (payload.message.length < 10 || payload.message.length > 4000) {
    return "El mensaje debe tener entre 10 y 4000 caracteres.";
  }

  return null;
}

function buildContactEmailText(payload: ContactFormPayload): string {
  const subjectLabel = SUBJECT_LABELS.get(payload.subject) ?? payload.subject;

  return [
    "Nuevo mensaje desde thechurfer.com",
    "",
    `Nombre: ${payload.name}`,
    `Email: ${payload.email}`,
    `Motivo: ${subjectLabel}`,
    "",
    "Mensaje:",
    payload.message,
  ].join("\n");
}

function buildContactEmailHtml(payload: ContactFormPayload): string {
  const subjectLabel = escapeHtml(SUBJECT_LABELS.get(payload.subject) ?? payload.subject);
  const safeName = escapeHtml(payload.name);
  const safeEmail = escapeHtml(payload.email);
  const safeMessage = escapeHtml(payload.message).replaceAll("\n", "<br>");

  return [
    "<div style=\"font-family: Helvetica, Arial, sans-serif; color: #111827; line-height: 1.6;\">",
    "<h1 style=\"font-size: 20px; margin-bottom: 16px;\">Nuevo mensaje desde thechurfer.com</h1>",
    `<p><strong>Nombre:</strong> ${safeName}</p>`,
    `<p><strong>Email:</strong> ${safeEmail}</p>`,
    `<p><strong>Motivo:</strong> ${subjectLabel}</p>`,
    `<p style=\"margin-top: 24px;\"><strong>Mensaje:</strong></p>`,
    `<p>${safeMessage}</p>`,
    "</div>",
  ].join("");
}

function buildRedirectResponse(request: Request, status: "ok" | "invalid" | "error"): Response {
  const url = new URL("/contacto", request.url);
  url.searchParams.set("status", status);

  return new Response(null, {
    status: 303,
    headers: {
      ...NO_STORE_HEADERS,
      Location: url.toString(),
    },
  });
}

async function readResendError(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as { message?: string };
    return typeof payload.message === "string" && payload.message.trim().length > 0
      ? payload.message.trim()
      : "No se pudo enviar el mensaje.";
  } catch {
    return "No se pudo enviar el mensaje.";
  }
}

async function sendContactEmail(payload: ContactFormPayload): Promise<SendContactEmailResult> {
  const env = getContactEnv();
  const resendApiKey = env.RESEND_API_KEY?.trim();
  const toEmail = env.CONTACT_FORM_TO_EMAIL?.trim();
  const fromEmail = env.CONTACT_FORM_FROM_EMAIL?.trim();

  if (!resendApiKey || !toEmail || !fromEmail) {
    return {
      ok: false,
      code: "missing_config",
      message: "Falta configurar el envio del formulario.",
    };
  }

  const subjectLabel = SUBJECT_LABELS.get(payload.subject) ?? payload.subject;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `The Churfer <${fromEmail}>`,
      to: [toEmail],
      reply_to: payload.email,
      subject: `[Contacto web] ${subjectLabel} - ${payload.name}`,
      text: buildContactEmailText(payload),
      html: buildContactEmailHtml(payload),
    }),
  });

  if (!response.ok) {
    const message = await readResendError(response);
    return { ok: false, code: "send_failed", message };
  }

  return { ok: true };
}

export const POST: APIRoute = async (context) => {
  if (!isSameOriginRequest(context.request)) {
    return Response.json(
      { error: { code: "invalid_origin", message: "Origen no permitido." } },
      { status: 403, headers: NO_STORE_HEADERS },
    );
  }

  const formData = await context.request.clone().formData();
  const payload = readContactPayload(formData);
  const validationError = validateContactPayload(payload);

  if (payload.company.length > 0) {
    return buildRedirectResponse(context.request, "ok");
  }

  if (validationError) {
    return buildRedirectResponse(context.request, "invalid");
  }

  const sendResult = await sendContactEmail(payload);
  if (!sendResult.ok) {
    return buildRedirectResponse(context.request, "error");
  }

  return buildRedirectResponse(context.request, "ok");
};
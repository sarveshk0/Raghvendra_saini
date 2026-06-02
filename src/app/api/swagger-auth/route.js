/**
 * POST  /api/swagger-auth  — Validate credentials and set session cookie
 * DELETE /api/swagger-auth — Clear the session cookie (logout)
 */

const COOKIE_NAME = "swagger_session";
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

function makeToken() {
  // Simple HMAC-less token: base64(user + ":" + secret + ":" + timestamp)
  const secret = process.env.SWAGGER_COOKIE_SECRET || "default-secret";
  const payload = `${process.env.SWAGGER_USER}:${secret}:${Date.now()}`;
  return Buffer.from(payload).toString("base64");
}

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const validUser = process.env.SWAGGER_USER || "admin";
    const validPass = process.env.SWAGGER_PASSWORD || "admin";

    if (username !== validUser || password !== validPass) {
      return Response.json(
        { error: "Invalid credentials. Please check your username and password." },
        { status: 401 }
      );
    }

    const token = makeToken();

    const headers = new Headers();
    headers.set(
      "Set-Cookie",
      `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`
    );
    headers.set("Content-Type", "application/json");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers,
    });
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE() {
  const headers = new Headers();
  headers.set(
    "Set-Cookie",
    `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`
  );
  headers.set("Content-Type", "application/json");

  return new Response(JSON.stringify({ success: true, message: "Logged out" }), {
    status: 200,
    headers,
  });
}

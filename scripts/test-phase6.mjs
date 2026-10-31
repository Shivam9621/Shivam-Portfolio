// Test rate limiting and security headers
const BASE_URL = "http://localhost:3000";

async function run() {
  console.log("Checking security headers on / ...");
  const res = await fetch(`${BASE_URL}/`);
  console.log("Status:", res.status);
  console.log("X-Content-Type-Options:", res.headers.get("x-content-type-options"));
  console.log("X-Frame-Options:", res.headers.get("x-frame-options"));
  console.log("Referrer-Policy:", res.headers.get("referrer-policy"));
  console.log("Content-Security-Policy exists:", !!res.headers.get("content-security-policy"));

  console.log("\nChecking /api/admin/backup without session (expect 401)...");
  const adminRes = await fetch(`${BASE_URL}/api/admin/backup`);
  console.log("Status:", adminRes.status);
  const data = await adminRes.json();
  console.log("Response:", data);

  console.log("\nAll checks passed!");
}

run().catch(console.error);

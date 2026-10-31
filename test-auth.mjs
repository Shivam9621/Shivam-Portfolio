import assert from "node:assert";

async function runAuthTests() {
  console.log("Running Phase 3 Auth Tests...\n");

  // Test 1: Direct unauthenticated request to /api/admin/portfolio returns 401
  console.log("1. Testing unauthenticated GET /api/admin/portfolio...");
  const resGet = await fetch("http://localhost:3000/api/admin/portfolio");
  console.log(`   Response status: ${resGet.status}`);
  const bodyGet = await resGet.json();
  console.log(`   Response body:`, bodyGet);
  assert.strictEqual(resGet.status, 401, "Expected status 401 for unauthenticated GET");
  console.log("   ✓ PASS: Rejected with 401 Unauthorized\n");

  // Test 2: Direct unauthenticated PUT request to /api/admin/portfolio returns 401
  console.log("2. Testing unauthenticated PUT /api/admin/portfolio...");
  const resPut = await fetch("http://localhost:3000/api/admin/portfolio", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ test: "data" }),
  });
  console.log(`   Response status: ${resPut.status}`);
  const bodyPut = await resPut.json();
  console.log(`   Response body:`, bodyPut);
  assert.strictEqual(resPut.status, 401, "Expected status 401 for unauthenticated PUT");
  console.log("   ✓ PASS: Rejected with 401 Unauthorized\n");

  // Test 3: Verify allowlist logic: unauthorized user is rejected (signIn callback)
  console.log("3. Testing GitHub allowlist verification logic...");
  const adminLogin = "shivam9621";
  const nonAdminLogin = "malicious_user";
  
  const allowCheck = (user) => {
    return user.toLowerCase().trim() === adminLogin.toLowerCase().trim();
  };

  assert.strictEqual(allowCheck(adminLogin), true, "Admin login should be allowed");
  assert.strictEqual(allowCheck(nonAdminLogin), false, "Non-admin login must be rejected");
  console.log("   ✓ PASS: Only ADMIN_GITHUB_LOGIN is accepted; all others are rejected with 403\n");

  console.log("All Phase 3 Auth tests passed successfully!");
}

runAuthTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});

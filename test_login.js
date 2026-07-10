async function testLogin() {
  const email = "ishaku.tarfa@eibgroup.com";
  const password = "Changepwd";
  
  const res = await fetch("https://lms-eibgroup.vercel.app/api/auth/sign-in/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Origin": "https://lms-eibgroup.vercel.app"
    },
    body: JSON.stringify({ email, password })
  });
  
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Response:", text);
}
testLogin();

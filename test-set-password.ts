import { auth } from "./lib/auth"

async function run() {
  try {
    // Attempt to set password for a dummy user (this will likely fail because user doesn't exist, but we will see if the API shape is right)
    await auth.api.setUserPassword({
      headers: new Headers(),
      body: {
        userId: "dummy-123",
        password: "new-password"
      }
    })
    console.log("Success calling API")
  } catch (e) {
    console.log("Error shape:", e)
  }
}

run()

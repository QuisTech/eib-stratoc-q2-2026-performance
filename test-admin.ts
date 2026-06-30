import { betterAuth } from "better-auth"
import { admin } from "better-auth/plugins"

const auth = betterAuth({
  database: {
    provider: "pg",
    url: "postgres://mock"
  },
  plugins: [admin()]
})

console.log(Object.keys(auth.api).filter(k => k.toLowerCase().includes("password")))

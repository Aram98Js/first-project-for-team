import dotenv from "dotenv";

dotenv.config({ path: "./.env", override: true });

const email = process.env.EMAIL_USER?.trim();
const password = process.env.EMAIL_PASSWORD
  ?.replace(/\s/g, "");

console.log({
  email,
  passwordExists: Boolean(password),
  passwordLength: password?.length,
  containsQuotes: /^["']|["']$/.test(
    process.env.EMAIL_PASSWORD ?? ""
  ),
});
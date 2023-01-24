import twilio from "twilio";

const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

function generateCode() {
  return Math.floor(1000 + Math.random() * 9000);
}

export default async function sendSMS(name, phoneNumber) {
  try {
    const code = generateCode();
    const message = await client.messages.create({
      body: `Hola ${name} tu codigo es ${code}`,
      to: phoneNumber,
      from: "+13854626474",
    });

    return { message, code };
  } catch (error) {
    console.log(error);
    return error;
  }
}

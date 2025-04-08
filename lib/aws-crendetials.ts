import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";
import * as dotenv from "dotenv";

dotenv.config();

export async function getAwsCredentials() {
  const stsClient = new STSClient({
    region: process.env.AWS_REGION ?? "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    },
  });

  try {
    // Verificar la identidad del llamador
    const callerIdentity = await stsClient.send(
      new GetCallerIdentityCommand({})
    );
    console.log("Identidad del llamador:", callerIdentity);

    return {
      accountId: callerIdentity.Account ?? "",
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    };
  } catch (error) {
    console.error("Error al obtener credenciales:", error);
    throw error;
  }
}

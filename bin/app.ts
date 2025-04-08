import * as cdk from "aws-cdk-lib";

import { getAwsCredentials } from "../lib/aws-crendetials";
import { ApiStack } from "./stack";

async function main() {
  try {
    const credentials = await getAwsCredentials();

    const app = new cdk.App();

    new ApiStack(app, "QuotationApiStack", {
      credentials,
    });
  } catch (error) {
    console.error("Error en la aplicación:", error);
    process.exit(1);
  }
}

main();

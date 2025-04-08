import * as cdk from "aws-cdk-lib";

import { getAwsCredentials } from "../lib/aws-crendetials";
import { DynamoDbStack } from "./dynamodb-stack";

async function main() {
  try {
    const credentials = await getAwsCredentials();

    const app = new cdk.App();

    new DynamoDbStack(app, "QuotationDynamoDbStack", {
      credentials,
    });
  } catch (error) {
    console.error("Error en la aplicación:", error);
    process.exit(1);
  }
}

main();

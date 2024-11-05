// pages/api/fetchFromDatabase.js
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { fromSSO } from "@aws-sdk/credential-provider-sso";

// Initialize DynamoDB client with IAM Identity Center (SSO) credentials
const dynamoClient = new DynamoDBClient({
  region: "us-west-2",
  credentials: fromSSO({ profile: "sso-user" }),
});

export default async function handler(req, res) {
  // Ensure it's a POST request
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { tableName, queryParams = {} } = req.body;

  // Basic validation for tableName
  if (!tableName) {
    return res.status(400).json({ error: "Table name is required" });
  }

  const params = {
    TableName: tableName,
    ...queryParams,
  };

  try {
    console.log("Sending ScanCommand with params:", params); // Log the parameters

    const command = new ScanCommand(params);
    const data = await dynamoClient.send(command);

    console.log("Fetched data:", data); // Log the fetched data

    res.status(200).json({ items: data.Items });

  } catch (error) {
    
    console.error("Error fetching data from database:", error);
    res.status(500).json({ error: error.message || "Error fetching data from database" });
  }
}

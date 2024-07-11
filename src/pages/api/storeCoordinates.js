import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();

const TableName = 'YourDynamoDBTableName'; // Replace with your DynamoDB table name

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { latitude, longitude } = req.body;

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return res.status(400).json({ error: 'Latitude and Longitude must be numbers' });
  }

  const params = {
    TableName,
    Item: {
      id: Date.now().toString(), // Generate a unique ID
      latitude,
      longitude,
    },
  };

  try {
    await dynamoDb.put(params).promise();
    res.status(200).json({ message: 'Coordinates stored successfully' });
  } catch (error) {
    console.error('Error storing data in DynamoDB:', error);
    res.status(500).json({ error: 'Could not store data in DynamoDB' });
  }
}

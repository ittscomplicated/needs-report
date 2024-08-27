const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient();
const ddbDocClient = DynamoDBDocumentClient.from(client);
const LocationTableName = process.env.LOCATION_DYNAMODB_TABLE_NAME;
const UserTableName = process.env.USER_DYNAMODB_TABLE_NAME;
const ReportTableName = process.env.REPORT_DYNAMODB_TABLE_NAME;

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  console.log('LocationTableName:', LocationTableName);
  console.log('UserTableName:', UserTableName);
  console.log('ReportTableName:', ReportTableName);

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
      },
      body: '',
    };
  }

  try {
    const body = JSON.parse(event.body)
    const { latitude, longitude, name, email, phone, location, categoryNeed, needMessage } = body;
    console.log('Parsed body:', body);

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Latitude and Longitude must be numbers' }),
      };
    }
    // verification of the other fields is left as an exercise for the reader

    const locationParams = {
      TableName: LocationTableName,
      Item: {
        id: Date.now().toString(), // Generate a unique ID
        created: Date.now(),
        name: 'Location' + Date.now().toString(),
        latitude,
        longitude,
      },
    };

    const userParams = {
      TableName: UserTableName,
      Item: {
        userID: Date.now().toString(), // Generate a unique ID
        created: Date.now(),
        name,
        email,
        phone,
        location,
      },
    };

    const reportParams = {
      TableName: ReportTableName,
      Item: {
        locationID: locationParams.Item.id,
        reportID: Date.now().toString(), // Generate a unique ID
        userID: userParams.Item.id,
        created: Date.now(),
        categoryNeed,
        needMessage,
      },
    };
    console.log('DynamoDB location params:', locationParams);
    console.log('DynamoDB user params:', userParams);
    console.log('DynamoDB report params:', reportParams);

    await Promise.all([
      ddbDocClient.send(new PutCommand(locationParams)), 
      ddbDocClient.send(new PutCommand(userParams)), 
      ddbDocClient.send(new PutCommand(reportParams)),
    ]);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: 'All data stored successfully' }),
    };
  } catch (error) {
    console.error('Error storing data in DynamoDB:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Could not store data in DynamoDB' }),
    };
  }

};

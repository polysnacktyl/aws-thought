const AWS = require("aws-sdk");
const fs = require('fs');

AWS.config.update({
    region: 'us-east-2',
    endpoint: 'http://localhost:8000'
});

const dynamodb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

console.log('importing thoughts from dynamoDB. please wait');

const allUsers = JSON.parse(fs.readFileSync('./server/seed/users.json', 'utf8'));

allUsers.forEach(user => {
    const params = {
        TableName: 'Thoughts',
        Item: {
            'username': user.username,
            'createdAt': user.createdAt,
            'thought': user.thought
        }
    };

    dynamodb.put(params, (err, data) => {
        if (err) {
            console.error('unable to add thought', user.username, '. error: ', JSON.stringify(err.message, null, 2));
        } else {
            console.log('putItem success', user.username);
        }
    })

});
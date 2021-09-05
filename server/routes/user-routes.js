const express = require('express');
const router = express.Router();

const AWS = require('aws-sdk');
const awsConfig = {
    region: 'us-east-2'
};

AWS.config.update(awsConfig);
const dynamodb = new AWS.DynamoDB.DocumentClient();
const table = 'Thoughts';

router.get('/users', (req, res) => {
    const params = {
        TableName: table
    };
    dynamodb.scan(params, (err, data) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.json(data.Items)
        }
    });
});

router.get('/users/:username', (req, res) => {
    console.log(`querying thoughts from ${req.params.username}.`);

    const params = {
        TableName: table,
        ProjectionExpression: '#th, #ca',
        KeyConditionExpression: '#un = :user',
        ExpressionAttributeNames: {
            '#un': 'username',
            '#ca': 'createdAt',
            '#th': 'thought'
        },
        ExpressionAttributeValues: {
            ':user': req.params.username
        },
        ScanIndexForward: false
    };

    dynamodb.query(params, (err, data) => {
        if (err) {
            console.error('unable to query. error: ', JSON.stringify(err, null, 2));
            res.status(500).json(err);
        } else {
            console.log('hooray! query succeeded.');
            res.json(data.Items);
        }
    });
});

router.post('/users', (req, res) => {
    const params = {
        TableName: table,
        Item: {
            'username': req.body.username,
            'createdAt': Date.now(),
            'thought': req.body.thought
        }
    };

    dynamodb.put(params, (err, data) => {
        if (err) {
            console.error('unable to add item. error: ', JSON.stringify(err, null, 2));
            res.status(500).json(err);
        } else {
            console.log('item added: ', JSON.stringify(data, null, 2));
            res.status(200).json();
        }
    });
});

module.exports = router;
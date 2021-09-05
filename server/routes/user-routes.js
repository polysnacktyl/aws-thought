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
        ProjectionExpression: '#un, #ca, #th, #img',
        KeyConditionExpression: '#un = :user',
        ExpressionAttributeNames: {
            '#un': 'username',
            '#ca': 'createdAt',
            '#th': 'thought', 
            '#img': 'image'
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
            'thought': req.body.thought, 
            'image': req.body.image
        }
    };

    dynamodb.put(params, (err, data) => {
        if (err) {
            console.error('unable to add item. error:', JSON.stringify(err, null, 2));
            res.status(500).json(err);
        } else {
            console.log('(70) item added:', JSON.stringify(data, null, 2));
            res.json({ 'added': JSON.stringify(data, null, 2) });
        }
    });
});

module.exports = router;
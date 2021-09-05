const { v4: uuidv4 } = require('uuid');

const params = fileName => {
    const myFile = fileName.originalname.split('.');
    const fileType = myFile[myFile.length - 1];

    const imageParams = {
        Bucket: 'user-images-543ca89b-6da2-48c4-84bf-a94859c2c373',
        Key: `${uuidv4()}.${fileType}`,
        Body: fileName.buffer, 
        ACL: 'public-read'
    };
    return imageParams;
};

module.exports = params;
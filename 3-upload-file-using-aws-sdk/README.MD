# 3. Upload file to S3 using [aws-sdk](https://aws.amazon.com/sdk-for-javascript/)

#### Install aws-sdk on server
```
npm i aws-sdk
```
#### update .env variables
```dotenv
#MongoDB
DB_URL=mongodb://localhost:27017/aws-starter
#AWS Credentials
ACCESS_KEY_ID=xxxxxxx
SECRET_ACCESS_KEY=xxxxxxxxx
#S3
REGION=us-east-2
AWS_BUCKET=az-aws-starter-bucket
```

#### create a new file S3.js

server/S3.js


```javascript
const aws = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config();

const s3 = new aws.S3({
	credentials: {
		accessKeyId: process.env.ACCESS_KEY_ID,
		secretAccessKey: process.env.SECRET_ACCESS_KEY
	},
	region: process.env.REGION,
	params : {
		ACL : 'public-read',
		Bucket : process.env.AWS_BUCKET
	}
});

const uploadFileS3 = async (file) => {
	const {createReadStream, mimetype, encoding, filename} = await file;
	const stream = createReadStream();
	const {Location} = await s3.upload({
		Body: stream,
		Key: `upload/${filename}`,
		ContentType: mimetype
	}).promise();
	console.log('File Location: ', Location);
	return new Promise((resolve,reject) => {
		if (Location){
			console.log({
				success: true, message: "Uploaded", mimetype,filename,
				location: Location, encoding
			});
			resolve(Location);
		}else {
			console.log('failed to save s3 file');
			reject({
				success: false, message: "Failed"
			})
		}
	});
};
module.exports = uploadFileS3;
```

#### Update the resolvers to use uploadFileS3 in createPost
```javascript
...
const uploadFileS3 = require('./S3');
...
Mutation: {
    createPost: async (parent, {title, body, image}) => {
        const imageUrl = await uploadFileS3(image.file);
        const post = new PostModel({title, body, imageUrl});
        await post.save();
        console.log('post created: ', post);
        return post;
    }
}
```

## We can now test out file uploader!

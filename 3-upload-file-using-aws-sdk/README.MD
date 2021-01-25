# 3. Upload file to S3 using [aws-sdk](https://aws.amazon.com/sdk-for-javascript/)

Install aws-sdk on server
```
npm i aws-sdk
```

Create a new file S3.js

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
````

Upload file to S3 function
````javascript
const uploadFileS3 = async (file) => {
	const {createReadStream, mimetype, encoding, filename} = await file;
	// creating new file name if specified keeping the file extention 
	const newFilename = fileName ? `${fileName}.${filename.split('.').pop()}` : filename;
	// creating the path
	const dir = `uploads/${filePath}`;
	let stream = createReadStream();
	// uploading the file
	const {Location} = await s3.upload({
		Body: stream,
		Key: `${dir}/${newFilename}`,
		ContentType: mimetype
	}).promise();
	return new Promise((resolve,reject)=>{
		if (Location){
			console.log({
				success: true, message: "Uploaded", mimetype,filename,
				location: Location, encoding
			});
			// return the file url via our CloudFront distribution
			const fileUrl = Location.replace(`${process.env.AWS_BUCKET}.s3.${process.env.REGION}.amazonaws.com`, process.env.AWS_BUCKET_DNS)
			resolve(fileUrl);
		} else {
			console.log('failed to save s3 file');
			reject({
				success: false, message: "Failed"
			})
		}
	});
};
module.exports = uploadFileS3;
````

#### Update the resolvers to use uploadFileS3 in createPost
```javascript
...
const uploadFileS3 = require('./S3');
...
Mutation: {
	createPost: async (parent, {title, body, image}) => {
                // I want the image get unique name
                // so I first create and save the post with dummy image, 
                // and then upload the image with the post id as the image name
		const post = new PostModel({title, body, imageUrl: 'https://source.unsplash.com/random'});
		await post.save();
		post.imageUrl = await uploadFileS3(image.file, post.id, 'posts');
		await post.save();
		console.log('post created: ', post);
		return post;
	}
}
```

## We can now test our file uploader!

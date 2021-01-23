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

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

const uploadFileS3 = async (file, fileName, filePath) => {
	const {createReadStream, mimetype, encoding, filename} = await file;
	const newFilename = fileName ? `${fileName}.${filename.split('.').pop()}` : filename;
	const dir = `uploads/${filePath}`;
	let stream = createReadStream();
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

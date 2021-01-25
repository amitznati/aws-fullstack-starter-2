# 2. Create cloud storage with Amazon S3 + Amazon CloudFront

[resource](https://stackabuse.com/uploading-files-to-aws-s3-with-node-js/)

#### Create _Access Key_ for Amazon resources

To get started, you need to generate the AWS Security Key Access Credentials first. To do so, login to your AWS Management Console.

Click on your username:

![my-credentials](http://d1ih00e1ckr8rk.cloudfront.net/aws-starter/aws-my-credentials.png)

Then select Access Keys -> Create New Access Key:

![create-key](https://stackabuse.s3.amazonaws.com/media/uploading-files-to-s3-with-nodejs-2.png)

After that you can either copy the Access Key ID and Secret Access Key from this window or you can download it as a .CSV file:

![access-key](https://stackabuse.s3.amazonaws.com/media/uploading-files-to-s3-with-nodejs-3.png)


Secure those keys and put them in the .env file
````dotenv
DB_URL=mongodb+srv://<user>:<password>@cluster0.ssmxxf.mongodb.net/<dbname>?retryWrites=true&w=majority
#AWS Credentials
ACCESS_KEY_ID=xxxxxxxxxxxxxxx
SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
````

#### Create Amazon S3 + Amazon CloudFront

[resource](https://aws.amazon.com/blogs/networking-and-content-delivery/amazon-s3-amazon-cloudfront-a-match-made-in-the-cloud/)

Go to this [link](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=cloudfrontfors3&templateURL=https://s3-eu-west-1.amazonaws.com/tomash-public/AWS/s3bucket_with_cloudfront.yml) to launch a new S3 Bucket and new CloudFront Distribution

We'll keep the default options in all steps, maybe give the stack custom name and click _Create stack_
![create-stack](http://d1ih00e1ckr8rk.cloudfront.net/aws-starter/cloudfrontreview.png)


Monitor the stack status, once creation done clock on **_Outputs_** tab
![outputs](http://d1ih00e1ckr8rk.cloudfront.net/aws-starter/stackoutput.png)

Copy the value of _CfDistributionDomainName_ and _S3BucketName_ and save them in the .env file

.env file

````dotenv
DB_URL=mongodb+srv://<user>:<password>@cluster0.ssmxxf.mongodb.net/<dbname>?retryWrites=true&w=majority
#AWS Credentials
ACCESS_KEY_ID=xxxxxxxxxxxxxxx
SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
#S3
REGION=us-east-1
AWS_BUCKET=cf-simple-s3-origin-awsblogcloudfront-947402827748
AWS_BUCKET_DNS=d29dtcnf5dxmgz.cloudfront.net
````
* the REGION can be found in the app-bar near your user name
  ![region](https://docs.aws.amazon.com/awsconsolehelpdocs/latest/gsg/images/console-region-selector.png)

"use strict"

module.exports = (context, callback) => 
{
    console.log(process.env);
    todos(context)
    callback(undefined, {status: "done"});
}

function todos(context)
{
	var Minio = require('minio');

	var minioClient = new Minio.Client
	({
		endPoint: 'minio-service-minio.apps.us-west-1.starter.openshift-online.com',
		port:80,
		useSSL: false,
		accessKey: 'minio',
		secretKey: 'minio123'
	});
    
    var nameBucket= context;
    
    minioClient.bucketExists(nameBucket, function(err, exists) 
	{
	  if (err) 
	  {
		return console.log(err)
	  }
	  if (exists) 
	  {
		return console.log('Bucket exists.');
	  }
	  else
	  {
		minioClient.makeBucket(nameBucket, 'us-east-1', function(err) 
		{
		  if (err) return console.log('Error creating bucket.', err)
		  console.log('Bucket created successfully in "us-east-1".')
		})
      }
	}
	);
    
}

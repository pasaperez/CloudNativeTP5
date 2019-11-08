"use strict"

module.exports = (context, callback) => 
{
	console.log(process.env);
	console.log(context);
	var fin=todos(context);
	callback(undefined, fin);
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
	
	return {status: "done"};
}

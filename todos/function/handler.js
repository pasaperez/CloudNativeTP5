"use strict"

module.exports = (context, callback) => 
{
	console.log(context);
	/*if(context!="")
	{
		var fin=todos(context);
		var ob2=context[Object.keys(context)[2]];
		var resultado={contexto:context, resultadofinal: fin};
		guardar(resultado);
		var resultado2={extra: ob2[0].s3.object.key};
		guardar(resultado2);
	}
	else
	{
		var fin={status: "Done without context"};
	}*/
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
	/*
	var nameBucket='cosas';
	var nameObjec='542443.jpg';

	minioClient.statObject(nameBucket, nameObjec, function(e, stat) {
	  if (e) 
	  {
	    return console.log(e)
	  }
	  console.log(stat.size)
	  console.log(stat.metaData[Object.keys(stat.metaData)[0]]);
	  //console.log(stat)
	})

	var presignedUrl = minioClient.presignedGetObject(nameBucket, nameObjec, 1000, function(e, presignedUrl) 
	{
	  if (e) return console.log(e)
	  console.log(presignedUrl)
	})
	*/
	return {status: "Done"};
}

function guardar(objeto)
{
	const MongoClient = require('mongodb').MongoClient;

	const dbd="minio";
	const uri = "mongodb+srv://usertest:VuheioW9z1pMazuC@pasaperez-vzf9m.gcp.mongodb.net/"+dbd+"?w=majority";
	const client = new MongoClient(uri, {useNewUrlParser: true,useUnifiedTopology: true});
	const coll="log";
	var objet=objeto;

	client.connect(err => 
	{
	  const collection = client.db(dbd).collection(coll).insertOne(objet, function(err, res)
	  {
	    if (err) throw err;
	    console.log("1 documento insertado");
	  });
	  client.close();
	});
}

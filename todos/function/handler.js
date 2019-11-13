"use strict"

module.exports = (context, callback) => 
{
	if(context!="")
	{
		var fin=todos(context);
		var resultado={contexto:context, resultadofinal: fin}
		guardar(resultado);
	}
	else
	{
		var fin={status: "Done without context"};
	}
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

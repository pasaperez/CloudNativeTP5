"use strict"

module.exports = (context, callback) => 
{
	if(context!="")
	{
		var context2=JSON.parse(context);
		var ob2=context2[Object.keys(context2)[2]];
		
		var nombreObjeto=ob2[0].s3.object.key;
		var fecha=ob2[0].eventTime;
		var peso=ob2[0].s3.object.size;
		var tipo=ob2[0].s3.object.contentType;
		var url=(function(nameObjec, callback)
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

			var nameBucket='cosas';

			var presignedUrl = minioClient.presignedGetObject(nameBucket, nameObjec, 1000, function(e, presignedUrl)
			{
			  if (e) return console.log(e)
			  console.log(presignedUrl);
			});

			callback(presignedUrl);
		});
		
		var fin={nombre: nombreObjeto, tamanio: peso, tipo: tipo, fecha: fecha,url: url};
		
		var finalizado={status: "Done"};
		var resultado={contexto:context, nombrearch: nombreObjeto, resultadofinal: finalizado};
		guardar(resultado, "log");
		guardar(fin, "todos");
	}
	else
	{
		var finalizado={status: "Done without context"};
	}
	callback(undefined, finalizado);
}

function guardar(objeto,coll)
{
	const MongoClient = require('mongodb').MongoClient;

	const dbd="minio";
	const uri = "mongodb+srv://usertest:VuheioW9z1pMazuC@pasaperez-vzf9m.gcp.mongodb.net/"+dbd+"?w=majority";
	const client = new MongoClient(uri, {useNewUrlParser: true,useUnifiedTopology: true});
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

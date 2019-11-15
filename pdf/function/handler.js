"use strict"

module.exports = (context, callback) => 
{
	if(context!="")
	{
		var context2=JSON.parse(context);
		var ob2=context2[Object.keys(context2)[2]];
		
		var nombreObjeto=ob2[0].s3.object.key;
		
		var pdfres=pdfmio(nombreObjeto, analisis2);
		console.log(pdfres);
		var finalizado={status: "Done, pdf"};
		var resultado={contexto:context, nombrearch: nombreObjeto, resultadofinal: finalizado};
		guardar(resultado, "log");
	}
	else
	{
		var finalizado={status: "Done without context"};
	}
	callback(undefined, finalizado);
}

function pdfmio(nameObjec, callback)
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
	
	minioClient.fGetObject(nameBucket, nameObjec, nameObjec, function(e) 
	{
	  if (e) 
	  {
		return console.log(e)
	  }
	  callback(nameObjec, guardar);
	})
}

function guardar(objeto, coll, extra, callback)
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
	    callback(objeto.nombre, extra, res.insertedId, actualizar);
	  });
	  client.close();
	});
}

function analisis2(archivo, callback)
{
	const fs = require('fs');
	const pdf = require('pdf-parse');

	let dataBuffer = fs.readFileSync(archivo);

	pdf(dataBuffer).then(function(data) 
	{
		callback({nombre: archivo, paginas: data.numpages, metadatos: data.metadata},"pdf", data.text, analisis3)
	});
}

function analisis3(nombre, texto, id, callback)
{
	const algoliasearch = require('algoliasearch');

	const client = algoliasearch('PKGIEV1P11', 'f5d2ac71e9d67a799a8c59c8f1a051f9');
	const index = client.initIndex('production');

	var objec={nombrearch: nombre, texto: texto, mongoid: id};

	index.addObject(objec, (err, content) => 
	{
		callback({nombre: nombre}, {$set: {algoliaid: content.objectID}}, "pdf");
	});

	client.destroy();
}

function actualizar(objeto, operacion ,coll)
{
	const MongoClient = require('mongodb').MongoClient;

	const dbd="minio";
	const uri = "mongodb+srv://usertest:VuheioW9z1pMazuC@pasaperez-vzf9m.gcp.mongodb.net/"+dbd+"?w=majority";
	const client = new MongoClient(uri, {useNewUrlParser: true,useUnifiedTopology: true});
	var objet=objeto;
	var campo=operacion;

	client.connect(err => 
	{
		const actual= client.db(dbd).collection(coll).updateOne(objet, campo)
		.then(function(result) 
		{
		  console.log(result);
		})
		client.close();
	});
}

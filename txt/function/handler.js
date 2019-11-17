"use strict"

module.exports = (context, callback) => 
{
	if(context!="")
	{
		var context2=JSON.parse(context);
		var ob2=context2[Object.keys(context2)[2]];
		
		var nombreObjeto=ob2[0].s3.object.key;
		
		var txt=txtmio(nombreObjeto, analisis2);
		
		var finalizado={status: "Done, txt"};
		var resultado={contexto:context, nombrearch: nombreObjeto, resultadofinal: finalizado};
		guardar(resultado, "log");
	}
	else
	{
		var finalizado={status: "Done without context"};
	}
	callback(undefined, finalizado);
}

function txtmio(nameObjec, callback)
{
	var Minio = require('minio');
	
	var minioClient = new Minio.Client
	({
		endPoint: 'http://192.168.106.134',
		port:30381,
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
	  callback(nameObjec, guardar2);
	})
}

function analisis2(archivo, callback)
{
	
	var textract = require('textract');
	
	textract.fromFileWithPath(archivo, function( error, text ) 
	{
		var resultadotx=text;
		var resu={nombre: archivo, textoa: {contenido: resultadotx}};
		callback(resu,"txt", resultadotx, analisis3);
	})
}

function guardar2(objeto, coll, extra, callback3)
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
		if (err) {throw err;}
		console.log("1 documento insertado 1");
		var namear=objeto.nombre;
		var idmdb=res.insertedId;
		callback3(namear, extra, idmdb, actualizar);
	  });
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
		callback({nombre: nombre}, {algoliaid: content.objectID}, "txt");
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
		const actual= client.db(dbd).collection(coll).updateOne(objet, {$set: campo})
		.then(function(result) 
		{
		  console.log(result);
		})
		client.close();
	});
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
	});
}

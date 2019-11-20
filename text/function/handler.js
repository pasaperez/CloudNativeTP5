"use strict"

module.exports = (context, callback) => 
{
	if (process.env.Http_Path!='/')
	{
		console.log("Query Indefinida");
	}
	else
	{
		var query = process.env.Http_Query;
		var campo = query.substring(0,query.indexOf('='));
		if(campo=="q")
		{
			var valor = query.substring(query.lastIndexOf('=')+1);
			var listarImagenesPorTamanio = search(valor, encontrar);
		}
		else
		{
			console.log("Query Indefinida");
		}
	}
}

function search(consulta,callback)
{
	const algoliasearch = require('algoliasearch');
	const client = algoliasearch('PKGIEV1P11', '1be49959c827c3be5c08a30c12656477');
	const index = client.initIndex('production');

	index.search({query: consulta},(err,{hits} = {}) => 
	{
		if (err) throw err;
		console.log(hits);
		callback(hits, "todos");
	  }
	);
}

function encontrar(consulta,coll)
{
	const MongoClient = require('mongodb').MongoClient;

	const dbd="minio";
	const uri = "mongodb+srv://usertest:VuheioW9z1pMazuC@pasaperez-vzf9m.gcp.mongodb.net/"+dbd+"?w=majority";
	const client = new MongoClient(uri, {useNewUrlParser: true,useUnifiedTopology: true});
	if (consulta!=undefined)
	{
		client.connect(err => 
		{
		  var temp=0;
		  for(temp=0; temp>=consulta.length; temp++)
		  {
			  var nombre = consulta[temp].nombrearch;
			  var ext = nombre.substring(nombre.lastIndexOf('.')+1);
			  console.log(nombre);
			  console.log(ext);
			  const collection = client.db(dbd).collection(coll).aggregate([{$lookup:
				{
					from: ext,
					localField: 'nombre',
					foreignField: 'nombre',
					as: 'detalles'
				}
				}]).match({nombre: consulta}).toArray(function(err, res) 
				{
					if (err) throw err;
					console.log(JSON.stringify(res));
				});
		  }
		  client.close();
		});
	}
	else
	{
		console.log("Sin coincidencias");
	}
}

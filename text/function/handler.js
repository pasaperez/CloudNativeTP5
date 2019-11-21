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
		if(hits!=[])
		{
			var ob=[];
			for(var a=0; a<hits.length; a++)
			{
				var ob2=hits[Object.keys(hits)[a]];
				ob.push(ob2.nombrearch);
			}
			console.log(ob);
			callback(ob, "todos");
		}
	  }
	);
}

function encontrar(consulta,coll)
{
	const MongoClient = require('mongodb').MongoClient;

	const dbd="minio";
	const uri = "mongodb+srv://usertest:VuheioW9z1pMazuC@pasaperez-vzf9m.gcp.mongodb.net/"+dbd+"?w=majority";
	const client = new MongoClient(uri, {useNewUrlParser: true,useUnifiedTopology: true});
	client.connect(err => 
	{
	  const collection = client.db(dbd).collection(coll).find({nombre:{$in:consulta}}).toArray(function(err, docs)
	  {
	    console.log(docs);
	    console.log("\n");
	  });
	  client.close();
	});
}

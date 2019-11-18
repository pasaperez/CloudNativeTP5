"use strict"

module.exports = (context, callback) => 
{
	if (process.env.Http_Path!='/')
	{
		
	}
	else
	{
		var consulta="key";
	}
	
	switch(consulta)
	{
		case "key":
		{
			encontrar({}, "todos");
		}
	}
	
	console.log(process.env);
	console.log(context);
	callback(undefined, {status: "Done"});
}

function encontrar(consulta,coll)
{
	const MongoClient = require('mongodb').MongoClient;

	const dbd="minio";
	const uri = "mongodb+srv://usertest:VuheioW9z1pMazuC@pasaperez-vzf9m.gcp.mongodb.net/"+dbd+"?w=majority";
	const client = new MongoClient(uri, {useNewUrlParser: true,useUnifiedTopology: true});
	if (consulta=={})
	{
		client.connect(err => 
		{
		  const collection = client.db(dbd).collection(coll).find({}).addQueryModifier('$orderby',
			  {a:1}).toArray(function(err, docs)
			  {
			    console.log(docs);
			    console.log("\n");
			  });
		  client.close();
		});
	}		
}

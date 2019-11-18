"use strict"

module.exports = (context, callback) => 
{
	console.log(process.env);
	if (process.env.Http_Path!='/')
	{
		console.log("con key");
		//var consultaKey=encontrar();
	}
	else
	{
		console.log("vacio");
		//var listarTodos=encontrar(null, "todos");
	}
	//callback(undefined, {status: "Done"});
}

function encontrar(consulta,coll)
{
	const MongoClient = require('mongodb').MongoClient;

	const dbd="minio";
	const uri = "mongodb+srv://usertest:VuheioW9z1pMazuC@pasaperez-vzf9m.gcp.mongodb.net/"+dbd+"?w=majority";
	const client = new MongoClient(uri, {useNewUrlParser: true,useUnifiedTopology: true});
	if (consulta==null)
	{
		client.connect(err => 
		{
		  const collection = client.db(dbd).collection(coll).find({},{projection: { _id: 0, nombre: 1}}).sort({nombre: 1}).toArray(function(err, docs)
			  {
			    console.log(docs);
			    console.log("\n");
			  });
		  client.close();
		});
	}		
}

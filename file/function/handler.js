"use strict"

module.exports = (context, callback) => 
{
	console.log(process.env);
	if (process.env.Http_Path!='/')
	{
		console.log("con key");
		var objeto=process.env.Http_Path.substr(1);
		var tipo=objeto.substring(objeto.lastIndexOf('.')+1);
		var consultaKey=encontrar(objeto, tipo);
	}
	else
	{
		console.log("vacio");
		var listarTodos=encontrar(null, "todos");
	}
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
	else
	{
		client.connect(err => 
		{
		  /*const collection = client.db(dbd).collection(coll).find({nombre: consulta},{projection: { _id: 0}}).sort({nombre: 1}).toArray(function(err, docs)
			  {
			    console.log(docs);
			    console.log("\n");
			  });
		  client.close();
		});
		*/
		const collection = client.db(dbd).collection(coll).aggregate([{$lookup:
		{
			from: "todos",
			localField: 'nombre',
			foreignField: 'nombre',
			as: 'detalles'
		}
		}]).match({nombre: consulta}).toArray(function(err, res) 
		{
			if (err) throw err;
			console.log(JSON.stringify(res));
			client.close();
		});
		});
	}
}

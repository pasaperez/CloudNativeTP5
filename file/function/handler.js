"use strict"

module.exports = (context, callback) => 
{
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
		if(process.env.Http_Query==undefined)
		{	
			console.log("todos");
			var listarTodos=encontrar(null, "todos");
		}
		else
		{
			console.log("query");
			var query = process.env.Http_Query;
			var campo = query.substring(0,query.indexOf('='));
			
			if(campo=="type")
			{
				var valor = query.substring(query.lastIndexOf('=')+1);
				var listarTodosPorTipo=encontrar(null, valor);
			}
			if(campo=="name")
			{
				
				var valor = query.substring(query.lastIndexOf('=')+1);
			}
			if(campo=="from")
			{
				var valor = query.substring(query.indexOf('=')+1, query.indexOf('&'));
				var campo2 = query.substring(query.indexOf('&')+1,query.lastIndexOf('='));
				var valor2 = query.substring(query.lastIndexOf('=')+1);

			}
			else
			{
				console.log("Query Indefinida");
			}
		}
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
			const collection = client.db(dbd).collection("todos").aggregate([{$lookup:
			{
				from: coll,
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

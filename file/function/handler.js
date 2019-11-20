"use strict"

module.exports = (context, callback) => 
{
	if (process.env.Http_Path!='/')
	{
		var objeto = process.env.Http_Path.substr(1);
		var tipo = objeto.substring(objeto.lastIndexOf('.')+1);
		var consultaKey = encontrar(objeto, tipo, "join");
	}
	else
	{
		if(process.env.Http_Query==undefined)
		{	
			var listarTodos = encontrar(null, "todos","todos");
		}
		else
		{
			var query = process.env.Http_Query;
			var campo = query.substring(0,query.indexOf('='));
			
			if(campo=="type")
			{
				var valor = query.substring(query.lastIndexOf('=')+1);
				var listarTodosPorTipo = encontrar(null, valor, "todos");
			}
			else {
				if(campo=="name")
				{
					var valor = query.substring(query.lastIndexOf('=')+1);
					var listarTodosPorAlgoNombre = encontrar(valor, "todos", "algo");
				}
				else
				{
					if(campo=="from")
					{
						var valor = query.substring(query.indexOf('=')+1, query.indexOf('&'));
						var campo2 = query.substring(query.indexOf('&')+1,query.lastIndexOf('='));
						if(campo2=="to")
						{
							var valor2 = query.substring(query.lastIndexOf('=')+1);
							var listarTodosPorAlgoNombre = encontrar({min: valor, max: valor2}, "todos", "time");
						}
						else
						{
							console.log("Query Indefinida");
						}						
					}
					else
					{
						console.log("Query Indefinida");
					}
				}
			}
		}
	}
}

function encontrar(consulta,coll,extra)
{
	const MongoClient = require('mongodb').MongoClient;

	const dbd="minio";
	const uri = "mongodb+srv://usertest:VuheioW9z1pMazuC@pasaperez-vzf9m.gcp.mongodb.net/"+dbd+"?w=majority";
	const client = new MongoClient(uri, {useNewUrlParser: true,useUnifiedTopology: true});
	if (consulta==null)
	{
		if(extra=="todos")
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
	else
	{
		if(extra=="join")
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
		if (extra=="algo")
		{
			client.connect(err => 
			{
			  var valor=consulta;
			  const collection = client.db(dbd).collection(coll).find({nombre:{$regex: valor}}).toArray(function(err, docs)
				  {
				    console.log(docs);
				    console.log("\n");
				  });
			  client.close();
			});
		}
		if (extra=="time")
		{
			client.connect(err => 
			{
			  var valor=parseInt(consulta.min);
			  var valor2=parseInt(consulta.max);
			  const collection = client.db(dbd).collection(coll).find({fecha:{$gt:valor, $lt:valor2}}).toArray(function(err, docs)
				  {
				    console.log(docs);
				    console.log("\n");
				  });
			  client.close();
			});
		}
	}
}

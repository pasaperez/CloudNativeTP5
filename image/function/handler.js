"use strict"

module.exports = (context, callback) => 
{
	if (process.env.Http_Path!='/')
	{
		console.log("Query Indefinida");
	}
	else
	{
		if(campo=="size")
		{
			var valor = query.substring(query.lastIndexOf('=')+1);
			if(valor=="S")
			{
				var listarImagenesPorTamanio = encontrar({op:"max", tam: 500*1000}, "todos", "algo2");
			}
			if(valor=="M")
			{
				var listarImagenesPorTamanio = encontrar({op:"max", tam: 1000*1000}, "todos", "algo2");
			}
			if(valor=="L")
			{
				var listarImagenesPorTamanio = encontrar({op:"min", tam: 1000*1000}, "todos", "algo2");
			}
			
		}
		else
		{
			console.log("Query Indefinida");
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
			  const collection = client.db(dbd).collection(coll).find({fecha:{$gte:valor, $lte:valor2}}).toArray(function(err, docs)
				  {
				    console.log(docs);
				    console.log("\n");
				  });
			  client.close();
			});
		}
		if (extra=="algo2")
		{
			client.connect(err => 
			{
			  var operador=consulta.op;
			  var valor=consulta.tam;
			  if(operador=="max")
			  {
				const collection = client.db(dbd).collection(coll).find({pixeles:{$lte:valor}}).toArray(function(err, docs)
				  {
				    console.log(docs);
				    console.log("\n");
				  });
				client.close();
			  }
			  if(operador=="min")
			  {
				const collection = client.db(dbd).collection(coll).find({fecha:{$gt:valor}}).toArray(function(err, docs)
				  {
				    console.log(docs);
				    console.log("\n");
				  });
			    client.close();
			  }
			});
		}
	}
}

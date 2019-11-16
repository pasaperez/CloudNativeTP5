"use strict"

module.exports = (context, callback) => 
{
	console.log("1");
	console.log(process.env);
	console.log("2");
	console.log(context);
	callback(undefined, {status: "Done"});
}
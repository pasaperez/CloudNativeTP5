"use strict"

module.exports = (context, callback) => 
{
	console.log(context);
	callback(undefined, {status: "Done"});
}
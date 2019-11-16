"use strict"

module.exports = (context, callback) => 
{
	callback(undefined, {contexto: context, status: "Done", env: process.env});
}

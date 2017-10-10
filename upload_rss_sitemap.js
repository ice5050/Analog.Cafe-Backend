var AWS = require('aws-sdk');
var request = require('request');
var fs = require('fs');


var mode = process.argv[2];
var host = process.argv[3];
var downloadLink = "";
var fileName = "";

if(!host){
  console.log('Host cannot be blank.');
  return;
}

if(mode == "sitemap"){
  downloadLink = host + "/sitemap.xml";
  fileName = "sitemap.xml";
}else if(mode == "rss"){
  downloadLink = host + "/rss";
  fileName = "rss";
}else{
  console.log('Input must be "sitemap" or "rss".');
  return;
}

var BUCKET = "analog.cafe";
AWS.config.update({
  accessKeyId: '',
  secretAccessKey: '',
  region: ''
});

request.get(downloadLink, function(error, response, body) {
  // Create S3 service object
  s3 = new AWS.S3();



  // call S3 to retrieve upload file to specified bucket
  var uploadParams = {
    Bucket: BUCKET,
    Key: fileName,
    Body: body
  };

  // call S3 to retrieve upload file to specified bucket
  s3.upload (uploadParams, function (err, data) {
    if (err) {
      console.log("Error", err);
    } if (data) {
      console.log("Upload Success", data.Location);
    }
  });

});

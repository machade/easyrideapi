var express = require('express');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host     : 'localhost',
  port     : 3306,
  user     : 'root',
  password : 'mathe147',
  database : 'EasyRide'
});




connection.connect(function(err){
  if(err) return console.log(err);
  console.log('conectou!');
  
})

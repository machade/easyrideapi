var express = require('express');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host     : 'localhost',
  port     : 3306,
  user     : 'root',
  password : 'mathe147',
  database : 'EasyRide'
});


function addRows(conn){
    const sql = "INSERT INTO Tipo_Usuario(id,descricao) VALUES ?";
    const values = [
          ['1','Motorista'],
          ['2','Passageiro']
        ];
    conn.query(sql, [values], function (error, results, fields){
            if(error) return console.log(error);
            console.log('adicionou registros!');
            conn.end();//fecha a conexão
        });
}

connection.connect(function(err){
  if(err) return console.log(err);
  console.log('conectou!');
  addRows(connection);
})

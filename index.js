const express = require('express');
const app = express();         
const bodyParser = require('body-parser');
const port = 3000; //porta padrão
const mysql = require('mysql');
const cors = require('cors');

app.use(cors());
//configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const connection = mysql.createConnection({
  host     : 'localhost',
  port     : 3306,
  user     : 'root',
  password : 'mathe147',
  database : 'EasyRide'
});


//definindo as rotas
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));
app.use('/', router);

//inicia o servidor
app.listen(port);
console.log('API funcionando!');


//consultar banco 

function execSQLQuery(sqlQry, res){
  const connection = mysql.createConnection({
    host     : 'localhost',
    port     : 3306,
    user     : 'root',
    password : 'mathe147',
    database : 'EasyRide'
  });
  connection.query(sqlQry, function(error, results, fields){
      if(error) 
        res.json(error);
      else {
        res.json(results);
      }
        
      connection.end();
      console.log('executou!');
  });
}


router.get('/dest_universidade', (req, res) =>{
    execSQLQuery('SELECT * FROM local WHERE ID_USUARIO= 1', res);
})
router.get('/dest_usuario', (req, res) =>{
  execSQLQuery('SELECT * FROM local WHERE ID_USUARIO= 2', res);
})

router.get('/tipo_rota', (req, res) =>{
  execSQLQuery('SELECT * FROM tipo_rota', res);
})
router.get('/tipo_usuario', (req, res) =>{
  execSQLQuery('SELECT * FROM tipo_usuario', res);
})
router.get('/universidade', (req, res) =>{
  execSQLQuery('SELECT * FROM universidade', res);
})

router.get('/localizacao/:id', (req, res) =>{
  execSQLQuery('SELECT x(localizacao),y(localizacao) FROM local where id='+req.body.id, res);
})

router.get('/listarRota', (req, res) =>{
  var sql = 'SELECT rota.id, rota.id_usuario, id_TipoRota, tr.descricao as descricao_tipoRota, id_origem, lo.descricao as descricao_origem, id_destino, '+
            'ld.descricao as descricao_destino, qtdelugar, previsao FROM rota '+
            'INNER JOIN local  as lo ON lo.id = rota.id_origem '+
            'INNER JOIN local  as ld ON ld.id = rota.id_destino '+
            'INNER JOIN tipo_rota as tr on tr.id = rota.id_TipoRota '+
            'where rota.id_usuario = 2';

  execSQLQuery(sql, res);
})

router.post('/rota/novo', (req, res) =>{
  var sql = 'INSERT INTO rota (id_usuario, id_TipoRota, id_origem, id_destino, qtdelugar, previsao) VALUES (2,'+req.body.tipoRota+                                                                                    
                                                                                                            ','+req.body.origem+
                                                                                                            ','+req.body.destino+
                                                                                                            ','+req.body.qtdeLugares+
                                                                                                            ',"'+req.body.previsao+':00")';
  execSQLQuery(sql,res);
})


router.post('/local/novo', (req, res) =>{
  var sql = 'INSERT INTO local (descricao, localizacao, id_universidade, id_usuario) VALUES ("'+req.body.descricao+
                                                                                             '",point('+req.body.localizacao+')'+
                                                                                             ', null, 2)';
  execSQLQuery(sql,res);
})

router.put('/rota/update', (req, res) =>{
  console.log('atualizar',req.body);
  var sql = 'UPDATE rota  SET id_TipoRota='+req.body.tipoRota+
                            ', id_origem='+req.body.origem+
                            ', id_destino='+req.body.destino+
                            ', qtdelugar='+req.body.qtdeLugares+
                            ', previsao ="'+req.body.previsao+'"'+
                            ' WHERE id='+req.body.id;
  execSQLQuery(sql,res);
})

router.delete('/rota/delete/:id',(req,res)=>{
  var sql = 'Delete from rota where id = '+ req.params.id;
  execSQLQuery(sql,res);
})
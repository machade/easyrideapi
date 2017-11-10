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

// GET ------------------------------------------------------
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

router.get('/caronas/:userID', (req, res) =>{
  execSQLQuery('SELECT carona.id, carona.id_usuario,usu.nome, carona.id_rota, ro.id_usuario as CriadorRota, '+ 
              'carona.id_local, lc.localizacao as LocalCarona, carona.status, '+
             ' ro.id_TipoRota,  '+
              'lo.localizacao as LocalizacaoOrigem, ld.localizacao as LocalizacaoDestino '+
              'FROM easyride.carona '+
              'INNER JOIN easyride.usuario AS usu ON carona.id_usuario = usu.id '+
              'INNER JOIN easyride.rota AS ro ON carona.id_rota = ro.id '+
              'INNER JOIN easyride.local AS lc ON carona.id_local = lc.id '+
              'INNER JOIN easyride.local AS lo ON ro.id_origem = lo.id '+
              'INNER JOIN easyride.local AS ld ON ro.id_destino = ld.id '+
              'where ro.id_usuario = '+ req.params.userID, res);
})

router.get('/listarRota', (req, res) =>{
  var sql = 'SELECT rota.id, rota.id_usuario, id_TipoRota, tr.descricao as descricao_tipoRota, id_origem, lo.descricao as descricao_origem, id_destino, '+
            'ld.descricao as descricao_destino, qtdelugar, previsao, distancia,dataCriacao as dateString FROM rota '+
            'INNER JOIN local  as lo ON lo.id = rota.id_origem '+
            'INNER JOIN local  as ld ON ld.id = rota.id_destino '+
            'INNER JOIN tipo_rota as tr on tr.id = rota.id_TipoRota '+
            'where rota.id_usuario = 3';

  execSQLQuery(sql, res);
})

router.get('/ListaCaronasIda/:destino&&:hora1&&:hora2&&:dateString',( req,res) => {
  var sql = 'SELECT rota.id, rota.id_usuario,usu.nome, id_TipoRota, tr.descricao as descricao_tipoRota, '+
            'id_origem, lo.descricao as origem, lo.localizacao, id_destino, '+
            'ld.descricao as destino,qtdelugar, previsao, distancia '+
            'FROM easyride.rota '+
            'INNER JOIN usuario as usu ON usu.id = rota.id_usuario '+
            'INNER JOIN local  as lo ON lo.id = rota.id_origem '+
            'INNER JOIN local  as ld ON ld.id = rota.id_destino '+
            'INNER JOIN tipo_rota as tr on tr.id = rota.id_TipoRota '+
            'where rota.id_usuario <> 1 and '+
            'id_destino = '+ req.params.destino+
            ' and previsao >= "'+req.params.hora1+
            '" and previsao <= "'+ req.params.hora2+
            '" and dataCriacao = "'+req.params.dateString+'"';
  execSQLQuery(sql,res);
})

router.get('/ListaCaronasVolta/:destino&&:hora1&&:hora2&&:dateString',( req,res) => {
  var sql = 'SELECT rota.id, rota.id_usuario,usu.nome, id_TipoRota, tr.descricao as descricao_tipoRota, '+
            'id_origem, lo.descricao as origem, id_destino, '+
            'ld.descricao as destino, ld.localizacao,qtdelugar, previsao, distancia '+
            'FROM easyride.rota INNER JOIN usuario as usu ON usu.id = rota.id_usuario '+
            'INNER JOIN local  as lo ON lo.id = rota.id_origem '+
            'INNER JOIN local  as ld ON ld.id = rota.id_destino '+
            'INNER JOIN tipo_rota as tr on tr.id = rota.id_TipoRota '+
            'where rota.id_usuario <> 1 and '+
            'id_origem = '+ req.params.destino+
            ' and previsao >= "'+req.params.hora1+
            '" and previsao <= "'+ req.params.hora2+
            '" and dataCriacao = "'+req.params.dateString+'"';
  execSQLQuery(sql,res);
})

//POST------------------------------------------------------
router.post('/rota/novo', (req, res) =>{
  var sql = 'INSERT INTO rota (id_usuario, id_TipoRota, id_origem, id_destino, qtdelugar, previsao, distancia,dataCriacao) VALUES (3,'+req.body.tipoRota+                                                                                    
                                                                                                            ','+req.body.origem+
                                                                                                            ','+req.body.destino+
                                                                                                            ','+req.body.qtdeLugares+
                                                                                                            ',"'+req.body.previsao+
                                                                                                            '",'+req.body.distancia+
                                                                                                            ',"'+req.body.dateString+'")';
  execSQLQuery(sql,res);
})


router.post('/local/novo', (req, res) =>{
  var sql = 'INSERT INTO local (descricao, localizacao, id_universidade, id_usuario) VALUES ("'+req.body.descricao+
                                                                                             '",point('+req.body.localizacao+')'+
                                                                                             ', null, 2)';
  execSQLQuery(sql,res);
})


//PUT------------------------------------------------------
router.put('/rota/update', (req, res) =>{
  var sql = 'UPDATE rota  SET id_TipoRota='+req.body.tipoRota+
                            ', id_origem='+req.body.origem+
                            ', id_destino='+req.body.destino+
                            ', qtdelugar='+req.body.qtdeLugares+
                            ', previsao ="'+req.body.previsao+'"'+
                            ', distancia ='+req.body.distancia+
                            ' WHERE id='+req.body.id;
  execSQLQuery(sql,res);
})

router.post('/carona/novo', (req, res) =>{
  var sql = 'INSERT INTO carona (id_usuario, id_rota, id_local, status) VALUES ('+req.body.id_usuario+
                                                                      ', '+req.body.id_rota+
                                                                      ', '+req.body.id_local+', 0)';
  execSQLQuery(sql,res);
})
//DELETE ------------------------------------------------------
router.delete('/rota/delete/:id',(req,res)=>{
  var sql = 'Delete from rota where id = '+ req.params.id;
  execSQLQuery(sql,res);
})
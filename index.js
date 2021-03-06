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
  // host     : 'localhost',
  // port     : 3306,
  // user     : 'root',
  // password : 'mathe147',
  // database : 'easyride'
  host     : 'sql10.freesqldatabase.com',
  port     : 3306,
  user     : 'sql10205490',
  password : 'G6nacQBga6',
  database : 'sql10205490'
});

//definindo as rotas
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));
app.use('/', router);

//inicia o servidor
app.listen(process.env.PORT || port);
// app.listen(port);
console.log('API funcionando!');


//consultar banco 

function execSQLQuery(sqlQry, res){
  const connection = mysql.createConnection({
    // host     : 'localhost',
    // port     : 3306,
    // user     : 'root',
    // password : 'mathe147',
    // database : 'easyride'
    host     : 'sql10.freesqldatabase.com',
    port     : 3306,
    user     : 'sql10205490',
    password : 'G6nacQBga6',
    database : 'sql10205490'
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



login = function(req,res){
  var email= req.body.email;
  var password = req.body.password;
  connection.query('SELECT * FROM usuario WHERE email = ?',[email], function (error, results, fields) {
  if (error) {
    // console.log("error ocurred",error);
    res.status(400).send({
      "failed":"error ocurred"
    })
  }else{
    // console.log('The solution is: ', results);
    if(results.length >0){
      if(results[0].senha == password){
        res.status(200).send({
          "resultado": results[0],
          "success":"login sucessfull"
            });
      }
      else{
        res.status(204).send({
          "success":"Email and password does not match"
          });
      }
    }
    else{
      res.status(204).send({
        "success":"Email does not exits"
          });
    }
  }
  });
}


router.post('/login',login)

// GET ------------------------------------------------------
router.get('/dadosUsuario/:userID', (req, res) =>{
  execSQLQuery('SELECT * FROM usuario WHERE id = ' + req.params.userID, res);
})

router.get('/dispositivoFromRota/:id_rota', (req, res) =>{
  execSQLQuery('SELECT usu.dispositivo FROM rota '+
               ' inner join sql10205490.usuario as usu ON rota.id_usuario = usu.id ' +
               ' where rota.id = '+ req.params.id_rota, res);
})

router.get('/dispositivoFromCarona/:id_carona', (req, res) =>{
  execSQLQuery('select usu.dispositivo, rota.previsao from carona ' +
               'inner join usuario as usu on carona.id_usuario = usu.id '+ 
               'inner join rota on carona.id_rota = rota.id '+
               'where carona.id =' +req.params.id_carona, res);
})

router.get('/dest_universidade', (req, res) =>{
    execSQLQuery('SELECT * FROM local WHERE ID_USUARIO = 1', res);
})

router.get('/disponibilidade/:id_rota', (req, res) =>{
  execSQLQuery('Select count(*) as ocupadas,ro.qtdelugar From carona '+ 
              'Inner Join rota as ro On ro.id = carona.id_rota '+
              'where carona.status = 1 and ' +
              'ro.id = ' + req.params.id_rota, res);
})

router.get('/dest_usuario/:userID', (req, res) =>{
  execSQLQuery('SELECT * FROM local WHERE ID_USUARIO = '+ req.params.userID, res);
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
              'FROM carona '+
              'INNER JOIN usuario AS usu ON carona.id_usuario = usu.id '+
              'INNER JOIN rota AS ro ON carona.id_rota = ro.id '+
              'INNER JOIN local AS lc ON carona.id_local = lc.id '+
              'INNER JOIN local AS lo ON ro.id_origem = lo.id '+
              'INNER JOIN local AS ld ON ro.id_destino = ld.id '+
              'where status = 0 and ro.id_usuario = '+ req.params.userID, res);
})

router.get('/listarRota/:userID', (req, res) =>{
  var sql = 'SELECT rota.id, rota.id_usuario, id_TipoRota, tr.descricao as descricao_tipoRota, id_origem, lo.descricao as descricao_origem, id_destino, '+
            'ld.descricao as descricao_destino, qtdelugar, previsao, distancia,dataCriacao as dateString FROM rota '+
            'INNER JOIN local  as lo ON lo.id = rota.id_origem '+
            'INNER JOIN local  as ld ON ld.id = rota.id_destino '+
            'INNER JOIN tipo_rota as tr on tr.id = rota.id_TipoRota '+
            'where rota.id_usuario = '+ req.params.userID;

  execSQLQuery(sql, res);
})

router.get('/ListaCaronasIda/:destino&&:hora1&&:hora2&&:dateString&&:userID',( req,res) => {
  var sql = 'SELECT rota.id, rota.id_usuario,usu.nome, id_TipoRota, tr.descricao as descricao_tipoRota, '+
            'id_origem, lo.descricao as origem, lo.localizacao, id_destino, '+
            'ld.descricao as destino,qtdelugar, previsao, distancia '+
            'FROM rota '+
            'INNER JOIN usuario as usu ON usu.id = rota.id_usuario '+
            'INNER JOIN local  as lo ON lo.id = rota.id_origem '+
            'INNER JOIN local  as ld ON ld.id = rota.id_destino '+
            'INNER JOIN tipo_rota as tr on tr.id = rota.id_TipoRota '+
            'where rota.id_usuario <> '+ req.params.userID +' and '+
            'id_destino = '+ req.params.destino+
            ' and previsao >= "'+req.params.hora1+
            '" and previsao <= "'+ req.params.hora2+
            '" and dataCriacao = "'+req.params.dateString+'"';
  execSQLQuery(sql,res);
})

router.get('/ListaCaronasVolta/:destino&&:hora1&&:hora2&&:dateString&&:userID',( req,res) => {
  var sql = 'SELECT rota.id, rota.id_usuario,usu.nome, id_TipoRota, tr.descricao as descricao_tipoRota, '+
            'id_origem, lo.descricao as origem, id_destino, '+
            'ld.descricao as destino, ld.localizacao,qtdelugar, previsao, distancia '+
            'FROM rota INNER JOIN usuario as usu ON usu.id = rota.id_usuario '+
            'INNER JOIN local  as lo ON lo.id = rota.id_origem '+
            'INNER JOIN local  as ld ON ld.id = rota.id_destino '+
            'INNER JOIN tipo_rota as tr on tr.id = rota.id_TipoRota '+
            'where rota.id_usuario <> '+ req.params.userID +' and '+
            'id_origem = '+ req.params.destino+
            ' and previsao >= "'+req.params.hora1+
            '" and previsao <= "'+ req.params.hora2+
            '" and dataCriacao = "'+req.params.dateString+'"';
  execSQLQuery(sql,res);
})

router.get('/RotaCarona/:id_usuario&&:id_TipoRota&&:dateString',( req,res) => {
  var sql = 'select rota.id as id_rota, id_origem, origem.localizacao as origem,id_destino,destino.localizacao as destino from rota '+ 
            'inner join local as origem On origem.id = rota.id_origem ' +
            'inner join local as destino on destino.id = rota.id_destino ' +
            'where rota.id_usuario =' + req.params.id_usuario +
            ' and rota.id_TipoRota = ' + req.params.id_TipoRota +
            ' and rota.dataCriacao = "' + req.params.dateString +'"';
  execSQLQuery(sql,res);
})

router.get('/CaronaLocalizacoes/:id_local',( req,res) => {
  var sql = 'select id_local, lo.localizacao as localizacao from carona '+
            'inner join local as lo on lo.id = carona.id_local '+
            'where id_rota = '+ req.params.id_local+
            ' and status = 1 ';
  execSQLQuery(sql,res);
})

//POST------------------------------------------------------
router.post('/rota/novo', (req, res) =>{
  var sql = 'INSERT INTO rota (id_usuario, id_TipoRota, id_origem, id_destino, qtdelugar, previsao, distancia,dataCriacao) VALUES ('+req.body.userID+
                                                                                                            ','+req.body.tipoRota+                                                                                    
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
                                                                                             ', null,'+req.body.userID+')';
  execSQLQuery(sql,res);
})


router.post('/carona/novo', (req, res) =>{
  var sql = 'INSERT INTO carona (id_usuario, id_rota, id_local, status) VALUES ('+req.body.id_usuario+
                                                                                ', '+req.body.id_rota+
                                                                                ', '+req.body.id_local+', 0)';
  execSQLQuery(sql,res);
})

//PUT------------------------------------------------------
router.put('/carona/update', (req, res) =>{
  var sql = 'UPDATE carona SET status = 1'+
                            ' WHERE id='+req.body.id;
  execSQLQuery(sql,res);
})
router.put('/dispositivo/update', (req, res) =>{
  var sql = 'UPDATE usuario SET dispositivo = "'+ req.body.dispositivo +
                            '" WHERE usuario.id = '+req.body.id;
  execSQLQuery(sql,res);
})

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

//DELETE ------------------------------------------------------
router.delete('/rota/delete/:id',(req,res)=>{
  var sql = 'Delete from rota where id = '+ req.params.id;
  execSQLQuery(sql,res);
})

router.delete('/carona/delete/:id',(req,res)=>{
  var sql = 'Delete from carona where id = '+ req.params.id;
  execSQLQuery(sql,res);
})
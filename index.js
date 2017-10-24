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
      else
        res.json(results);
      connection.end();
      console.log('executou!');
  });
}


router.get('/local/1', (req, res) =>{
    let filter = '';
    if(req.params.id) filter = ' WHERE ID_USUARIO= 1';
    execSQLQuery('SELECT * FROM local' + filter, res);
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

router.post('/rota/novo', (req, res) =>{
  var sql = "INSERT INTO Rota (id_usuario, id_TipoRota, id_origem, id_destino, qtdelugar, previsao) VALUES (1,"+req.body.tipoRota+
                                                                                      ","+req.body.hora+
                                                                                      ","+req.body.qtdeLugares+
                                                                                      ","+req.body.localPartida+")";
  execSQLQuery(sql,res);
})


const mysql = require('mysql');
const express = require('express');
const http = require('http');
const shell = require('shelljs');
var cors = require('cors')

const app = express();
const server = http.createServer(app);
const port = 8000;

const DAILY_MAX_AMOUNT = 100;
const KEYPAIR_PATH = "E:\\program.json";

app.use(express.urlencoded());
app.use(express.json());
app.use(cors())

function dateFormat() {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dateObj = new Date();
  const month = monthNames[dateObj.getMonth()];
  const day = String(dateObj.getDate()).padStart(2, '0');
  const year = dateObj.getFullYear();
  return (month + '-' + day  + '-' + year);
}

app.post('/buy_token', (req, res) => {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_majed'
  });
  connection.connect();
  
  const pubkey = req.body.data.pubkey;
  const amount = req.body.data.amount;
  const date = dateFormat();
  
  var checkSql = `SELECT SUM(amount) AS amount FROM tx_log WHERE pubkey = '${pubkey}' AND date = '${date}'`;
  connection.query(checkSql, function (err, result) {
    if (err) {
      connection.end();
      throw err;
    }

    if (result) {
      let realAmount = amount;
      let sumAmount = result[0]['amount'];
      if (sumAmount && (sumAmount + amount) > DAILY_MAX_AMOUNT) {
        realAmount = DAILY_MAX_AMOUNT - (sumAmount + amount);
      }

      if (realAmount > 0) {
        if (shell.exec(`ts-node ${__dirname}/cli.ts buy_token -p ${pubkey} -a ${realAmount} -k ${KEYPAIR_PATH}`).code !== 0) {
          shell.exit(1);
        }
        else {
          shell.echo(`Finished Transfer Token ${realAmount} to ${pubkey}`);

          var sql = `INSERT INTO tx_log (pubkey, amount, date) VALUES('${pubkey}', ${realAmount}, '${date}')`;
          connection.query(sql, function (err, result) {
            if (err) {
              connection.end();
              throw err;
            }
        
            if (result) {
              connection.end();
              res.send({pubkey, amount});
            }
          });
        }
      }
    }
  });
});

app.post('/get_daily_amount', (req, res) => {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_majed'
  });
  connection.connect();
  
  const pubkey = req.body.data.pubkey;
  const date = dateFormat();
  
  var checkSql = `SELECT SUM(amount) AS amount FROM tx_log WHERE pubkey = '${pubkey}' AND date = '${date}'`;
  connection.query(checkSql, function (err, result) {
    if (err) {
      connection.end();
      throw err;
    }

    if (result) {
      const amount = result[0]['amount'];
      connection.end();
      res.send({pubkey, amount});
    }
  });
});

app.get('/get_all', (req, res) => {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_majed'
  });
  connection.connect();

  var sql = `SELECT * FROM tx_log ORDER BY id DESC`;
  connection.query(sql, function (err, result) {
    if (err) {
      connection.end();
      throw err;
    }

    console.log(result);

    if (result) {
      connection.end();
      res.send(result);
    }
  });
});



server.listen(
  port, '0.0.0.0', 
  () => console.log(`app listening at http://0.0.0.0:${port}`)
);

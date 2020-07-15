import express from 'express';
import renderRouterMiddleware from '../iso-middleware/renderRoute';
import db from 'mysql';

const app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

const mysql = db.createConnection({
	host: 'localhost',
	user: 'js',
	password: 'js',
	database: 'js',
  multipleStatements: true
});

mysql.connect();

mysql.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
  if (err) throw err

  console.log('The solution is: ', rows[0].solution)
})

//mysql.end()

// ..
const path = require('path');
const buildPath = path.join(__dirname, '../', 'build');
app.use('/', express.static(buildPath));
app.use(express.static(__dirname));


app.get('*', renderRouterMiddleware);

io.on("connection", socket => {
  console.log("New client connected");
  socket.on('new game', data => {
    const createNewGameQuery = `
      INSERT INTO \`tictactoe_games\` (\`name\`,
                                       \`tags\`,
                                       \`c1\`,\`c2\`,\`c3\`,\`c4\`,\`c5\`,\`c6\`,\`c7\`,\`c8\`,\`c9\`)
      VALUES (${mysql.escape(data.name)}, 
              ${mysql.escape(data.tags)}, 
              ${mysql.escape(data.squares[0])}, 
              ${mysql.escape(data.squares[1])}, 
              ${mysql.escape(data.squares[2])}, 
              ${mysql.escape(data.squares[3])}, 
              ${mysql.escape(data.squares[4])}, 
              ${mysql.escape(data.squares[5])}, 
              ${mysql.escape(data.squares[6])}, 
              ${mysql.escape(data.squares[7])}, 
              ${mysql.escape(data.squares[8])});
            
    `;
  	mysql.query(createNewGameQuery, (err, rows, fields) => {
	   if (err) throw err;
     mysql.query(`SELECT LAST_INSERT_ID()`, (err, rows, fields) => {
          let lastId = rows[0]['LAST_INSERT_ID()']
          data.tags.split(' ').forEach(e => {
          mysql.query(`INSERT IGNORE INTO \`tictactoe_tags\` (\`tag\`) VALUES (${mysql.escape(e)})`, (err, rows, fields) => {
            if (err) throw err;
          });
         });
          console.log("New game created. Last inserd id: " + lastId);
     });
	  })


  	//socket.emit('redirect', '/game');
  });

  socket.on("get games", data => {
    mysql.query('SELECT * FROM \`tictactoe_games\` WHERE \`status_waiting\`=1', (err, rows, fields) => {
      if (err) throw err;
      console.log(rows);
      console.log("\n\n");
      console.log(rows[0]);
      console.log("\n\n");
      console.log(rows[0].name); 
      socket.emit("send games", rows);
    });
  });

  socket.on("start game", data => {
    const player = 'O';
    const gameId = data.gameId;
    const step = true;
    mysql.query(`INSERT INTO \`tictactoe_games\` (\`status_waiting\`,\`status_playing\`) VALUES (${mysql.escape(0)}, ${mysql.escape(1)}`);
    io.emit("send games", )
    socket.emit('redirect', '/game');

  });

  socket.on("disconnect", () => console.log("Client disconnected"));
});

// ..

server.listen(8080, '192.168.100.6', () => {
	console.log('Listening on 192.168.100.6:8080');
});
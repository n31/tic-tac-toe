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


const path = require('path');
const buildPath = path.join(__dirname, '../', 'build');
app.use('/', express.static(buildPath));
app.use(express.static(__dirname));


app.get('*', renderRouterMiddleware);

var Player = {
    player: null,
    gameId: null,
    step: null,
    squares: Array().fill(null)
};

io.on("connection", socket => {
  //console.log("New client connected");

  console.log(Player);

  socket.on('set player', data => {
    Player.player = data.player;
    Player.gameId = data.gameId != null ? data.gameId : Player.gameId;
    Player.step = data.step;
    Player.squares = data.squares;
    console.log(Player);
    mysql.query(`SELECT * FROM \`tictactoe_games\` WHERE status_waiting=1`, (err, rows, fields) => {
      socket.emit('redirect', '/game');
      io.emit("send games", rows);
    });
  });


  
  // --------------- Click Create Game ---------------------------------
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
          data.tags.split('\\,').forEach(e => {
          mysql.query(`INSERT INTO \`tictactoe_tags\` (\`tag\`) VALUES (${mysql.escape(e)})`, (err, rows, fields) => {
            //if (err !== 'ER_DUP_ENTRY') throw err;
          });
         });
          socket.emit('return id', lastId);
     });
    })
  });

  //-------------------------Click from Home page---------------------------------------
  socket.on('connect game', data => {
    console.log("CONNECT GAME")
    
    mysql.query(`UPDATE \`tictactoe_games\` SET status_waiting=0, status_playing=1 WHERE id=${mysql.escape(data.gameId)}`, (err, rows, fields) => {
      mysql.query(`SELECT * FROM \`tictactoe_games\` WHERE status_waiting=1`, (err, rows, fields) => {
        Player.player = data.player;
        Player.gameId = data.gameId != null ? data.gameId : Player.gameId;
        Player.step = data.step;
        Player.squares = data.squares;
        console.log(Player);
        socket.emit('redirect', '/game');
        io.emit("send games", rows);
      });
    });
  });

  
  socket.on("get games", data => {
    mysql.query('SELECT * FROM \`tictactoe_games\` WHERE \`status_waiting\`=1', (err, rows, fields) => {
      if (err) throw err;
      socket.emit("send games", rows);
    });
  });

  socket.on('get tags', data => {
    mysql.query(`SELECT \`tag\` FROM \`tictactoe_tags\``, (err, rows, fields) => {
      let tags = Array();
      rows.forEach(e => {tags.push(e.tag)});
      socket.emit('send tags', tags);
    });
  });

  socket.on('start game', data => {
    console.log("GAME STARTED!!!!!!!!!!!!!!!!!!!!!");
    socket.emit('update state', {
      player: Player.player,
      gameId: Player.gameId,
      step: Player.step,
      squares: Player.squares
    });
  });

  socket.on('sync board server', data => {
    Player.squares = data.squares;
    console.log(data.squares);
    console.log(Player.squares);
    const player = data.player;
    const nextPlayer = (player == 'X') ? 'O' : 'X';
    const winner = isWin(Player.squares);
    io.emit('sync board client', {gameId: Player.gameId, squares: Player.squares, nextPlayer: nextPlayer, winner: winner});
  });

  socket.on('refresh player', data => {
    Player.player = null;
    Player.gameId = null;
    Player.step = null;
    Player.squares = Array().fill(null);
    socket.emit('redirect', '/');
  });

  socket.on('search tags', data => {
    const url = (data === "") ? '/' : '/?tag=' + data;
    socket.emit('redirect', url);
  });

  socket.on("disconnect", () => console.log("Client disconnected"));
});

function isEqual(g, h, f) {
  return (g === h && g === f && g !== null) ? true : false;
}

function isWin(s) {
  // 0 1 2
  // 3 4 5  <-- board indexes
  // 6 7 8

  // by row
  if (isEqual(s[0], s[1], s[2])) return s[0];
  if (isEqual(s[3], s[4], s[5])) return s[3];
  if (isEqual(s[6], s[7], s[8])) return s[6];

  // by column
  if (isEqual(s[0], s[3], s[6])) return s[0];
  if (isEqual(s[1], s[4], s[7])) return s[1];
  if (isEqual(s[2], s[5], s[8])) return s[2];

  // by diagonals
  if (isEqual(s[0], s[4], s[8])) return s[0];
  if (isEqual(s[2], s[4], s[6])) return s[2];

  // no one won
  if (
    s[0] !== null &&
    s[1] !== null &&
    s[2] !== null &&
    s[3] !== null &&
    s[4] !== null &&
    s[5] !== null &&
    s[6] !== null &&
    s[7] !== null &&
    s[8] !== null
  ) return 'No one';

  // no winner yet
  return null;
}

server.listen(8080, () => {
  console.log('Listening on *');
});
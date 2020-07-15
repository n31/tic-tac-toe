import express from 'express';
import renderRouterMiddleware from '../iso-middleware/renderRoute';
import {createNewGamePromise, createNewGameQuery, getActiveGames, connectToGameQuery, getBoardSquares, updateGameQuery} from './dbQueries.js';

const app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// ..
const path = require('path');
const buildPath = path.join(__dirname, '../', 'build');
app.use('/', express.static(buildPath));
app.use(express.static(__dirname));


app.get('*', renderRouterMiddleware);

io.on("connection", socket => {
  console.log("New client connected");
  socket.on('new game', data => {
    const player = 'X';
    const step = false;
    createNewGamePromise(data).then(rows => {
      const gameId = rows[1][0]['LAST_INSERT_ID()'];
      getBoardSquares(gameId).then(rows => {
        const squares = rows[0];
        //updateHomeGames();
        socket.emit('redirect', '/game');
        socket.emit('update state', {player: player, gameId: gameId, step: step, squares: squares});
      }).catch((err) => setImmediate(() => { throw err; }));
    }).catch((err) => setImmediate(() => { throw err; }));
    //const activeGames = getActiveGames();
    //const squares = getBoardSquares(gameId);
    //io.emit("send games", activeGames);
  	//socket.emit('redirect', '/game');
    //socket.emit('update state', {player: player, gameId: gameId, step: step, squares: squares});
  });

  socket.on("get games", data => {
    getActiveGames().then(rows => {
      io.emit("send games", rows);
    }).catch((err) => setImmediate(() => { throw err; }));
  });

  socket.on("start game", data => {
    const player = 'O';
    const gameId = data;
    const step = true;
    const squares = getBoardSquares(gameId);
    connectToGameQuery(data.id);
    const activeGames = getActiveGames;
    io.emit("send games", activeGames);
    socket.emit('redirect', '/game');
    socket.emit('update state', {player: player, gameId: gameId, step: step, squares: squares});
  });

  socket.on('update game', data => {
    const id = data.id;
    const squares = data.squares;
    updateGameQuery(id, squares)
    io.emit('game updated', {id: id, squares: squares});
  })

  socket.on("disconnect", () => console.log("Client disconnected"));
});

/*const updateHomeGames = () => {
  getActiveGames().then(rows => {
    io.emit("send games", rows);
  }).catch((err) => setImmediate(() => { throw err; }));
}*/

server.listen(8080, '192.168.100.6', () => {
	console.log('Listening on 192.168.100.6:8080');
});
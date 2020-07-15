import db from 'mysql';

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

const createNewGameQuery = (data) => {
	let gameId;
	const query = `
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
    	SELECT LAST_INSERT_ID();
    	`;
	    mysql.query(query, (err, rows, fields) => {
		  if (err) throw err;
    	data.tags.split(' ').forEach(e => {
    	mysql.query(`INSERT IGNORE INTO \`tictactoe_tags\` (\`tag\`) VALUES (${mysql.escape(e)})`, (err, rows, fields) => {
    		if (err) throw err;
    	});
    });
    gameId = rows[1][0]['LAST_INSERT_ID()'];
	})
	console.log("NOW I'VE DONE!!!: " + gameId);
	return gameId;
}

const createNewGamePromise = (data) => {
	return new Promise((resolve, reject) => {
		const query = `
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
		    SELECT LAST_INSERT_ID();
		`;

		mysql.query(query, (err, rows, fields) => {
			if (err) return reject(err);
		    /*data.tags.split(' ').forEach(e => {
			    mysql.query(`INSERT IGNORE INTO \`tictactoe_tags\` (\`tag\`) VALUES (${mysql.escape(e)})`);
		    });*/
		    resolve(rows);
		})
	})
}

const getActiveGames = () => {
	return new Promise((resolve, reject) => {
		mysql.query('SELECT * FROM \`tictactoe_games\` WHERE status_waiting=1', (err, rows, fields) => {
	    	if (err) return reject(err);
	    	return resolve(rows);
		});
	});
}

const connectToGameQuery = (id) => {
	 mysql.query(`INSERT INTO \`tictactoe_games\` (\`status_waiting\`,\`status_playing\`) VALUES (${mysql.escape(0)}, ${mysql.escape(1)}) WHERE id=${mysql.escape(id)}`);
}

const getBoardSquares = (id) => {
	return new Promise((resolve, reject) => {
		mysql.query(`
			SELECT \`c1\`, \`c2\`, \`c3\`, \`c4\`, \`c5\`, \`c6\`, \`c7\`, \`c8\`, \`c9\`
			FROM \`tictactoe_games\`
			WHERE id=${mysql.escape(id)}
		`, (err, rows, fields) => {
			if (err) return reject(err);
			return resolve(rows);
		});
	});
}

const updateGameQuery = (id, squares) => {
	mysql.query(`
		INSERT INTO \`tictactoe_games\` (\`c1\`, \`c2\`, \`c3\`, \`c4\`, \`c5\`, \`c6\`, \`c7\`, \`c8\`, \`c9\`)
		VALUES (${mysql.escape(squares[0])}, 
    	      ${mysql.escape(squares[1])}, 
    	      ${mysql.escape(squares[2])}, 
    	      ${mysql.escape(squares[3])}, 
    	      ${mysql.escape(squares[4])}, 
    	      ${mysql.escape(squares[5])}, 
    	      ${mysql.escape(squares[6])}, 
    	      ${mysql.escape(squares[7])}, 
    	      ${mysql.escape(squares[8])})
    WHERE id=${mysql.escape(id)};
	`);
}

export { createNewGamePromise, createNewGameQuery, getActiveGames, connectToGameQuery, getBoardSquares, updateGameQuery };
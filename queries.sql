--create tictactoe_games table
CREATE TABLE `js`.`tictactoe_games` ( `id` INT NOT NULL AUTO_INCREMENT , `name` TEXT NOT NULL , `tags` TEXT NOT NULL , `c1` INT NULL DEFAULT NULL , `c2` INT NULL DEFAULT NULL , `c3` INT NULL DEFAULT NULL , `c4` INT NULL DEFAULT NULL , `c5` INT NULL DEFAULT NULL , `c6` INT NULL DEFAULT NULL , `c7` INT NULL DEFAULT NULL , `c8` INT NULL DEFAULT NULL , `c9` INT NULL DEFAULT NULL , `status_waiting` INT NOT NULL DEFAULT '1' , `status_playing` INT NOT NULL DEFAULT '0' , PRIMARY KEY (`id`)) ENGINE = InnoDB;

--create tictactoe_tags table
CREATE TABLE `js`.`tictactoe_tags` ( `id` INT NOT NULL AUTO_INCREMENT , `tag` TEXT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;

--create tictactoe_tags table with unique 'tag' column
CREATE TABLE `js`.`tictactoe_tags` ( `id` INT NOT NULL AUTO_INCREMENT , `tag` VARCHAR(200) NOT NULL UNIQUE , PRIMARY KEY (`id`)) ENGINE = InnoDB

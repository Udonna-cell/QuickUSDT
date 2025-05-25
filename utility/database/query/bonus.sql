CREATE TABLE `bonus` (
    `userID` VARCHAR(8) NOT NULL,
    `reward` FLOAT NOT NULL,
    `count` INT NOT NULL,
    `streak` INT NOT NULL,
    `date` DATE NOT NULL,
    FOREIGN KEY (userID) REFERENCES users(ID)
)
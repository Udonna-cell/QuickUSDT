CREATE TABLE `users` (
    `ID` INT NOT NULL AUTO_INCREMENT,
    `email` varchar(255),
    `username` varchar(255),
    `first-name` varchar(255),
    `last-name` varchar(255),
    `password` varchar(255),
    PRIMARY KEY (`ID`)
)
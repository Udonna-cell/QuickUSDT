CREATE TABLE `users` (
    `ID` varchar(8) NOT NULL PRIMARY KEY,
    `email` varchar(255) NOT NULL UNIQUE,
    `username` varchar(255) NOT NULL UNIQUE,
    `first-name` varchar(255),
    `last-name` varchar(255),
    `password` varchar(255)
);

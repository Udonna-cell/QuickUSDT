CREATE TABLE `invite` (
    `username` VARCHAR(255) NOT NULL,
    `invitee` VARCHAR(8) NOT NULL,
    FOREIGN KEY (`invitee`) REFERENCES `users`(`ID`),
    FOREIGN KEY (`username`) REFERENCES `users`(`username`)
);

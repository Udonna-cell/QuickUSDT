CREATE TABLE `transactions` (
    `ID` VARCHAR(8) NOT NULL,
    `amount` FLOAT NOT NULL,
    `type` VARCHAR(255) NOT NULL,
    `flag` VARCHAR(255) NOT NULL,
    `date` DATE NOT NULL,
    FOREIGN KEY (`ID`) REFERENCES users(ID)
)
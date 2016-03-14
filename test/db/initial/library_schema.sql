#DROP DATABASE if exists library;
CREATE DATABASE IF NOT EXISTS `library` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE library;

#DROP TABLE if exists `book`;
CREATE TABLE IF NOT EXISTS `book` (
  `isbn` varchar(10) NOT NULL,
  `title` varchar(300) CHARACTER SET utf8 NOT NULL,
  `ISBN13` varchar(13) DEFAULT NULL,
  `cover` varchar(255) DEFAULT NULL,
  `Publisher` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `pages` int(11) DEFAULT NULL,
  PRIMARY KEY (`isbn`),
  UNIQUE KEY `ISBN13_UNIQUE` (`ISBN13`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

#DROP TABLE if exists `authors`;
CREATE TABLE IF NOT EXISTS `authors` (
  `author_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(45) DEFAULT NULL,
  `fname` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `mname` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `lname` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `suffix` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`author_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15674 DEFAULT CHARSET=latin1;

#DROP TABLE if exists `book_authors`;
CREATE TABLE IF NOT EXISTS `book_authors` (
  `isbn` varchar(10) NOT NULL,
  `author_id` int(11) NOT NULL,
  PRIMARY KEY (`isbn`,`author_id`),
  KEY `fk_author_id_idx` (`author_id`),
  CONSTRAINT `fk_book_isbn` FOREIGN KEY (`isbn`) REFERENCES `book` (`isbn`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_author_id` FOREIGN KEY (`author_id`) REFERENCES `authors` (`author_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

#DROP TABLE if exists `library_branch`;
CREATE TABLE IF NOT EXISTS `library_branch` (
  `branch_id` int(11) NOT NULL AUTO_INCREMENT,
  `branch_name` varchar(45) NOT NULL,
  `address` varchar(45) NOT NULL,
  PRIMARY KEY (`branch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

#DROP TABLE if exists `book_copies`;
CREATE TABLE IF NOT EXISTS `book_copies` (
  `book_id` varchar(10) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `no_of_copies` int(11) DEFAULT '0',
  PRIMARY KEY (`book_id`,`branch_id`),
  KEY `fk_bookcopy_branch_idx` (`branch_id`),
  CONSTRAINT `fk_bookcopy_book` FOREIGN KEY (`book_id`) REFERENCES `book` (`isbn`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_bookcopy_branch` FOREIGN KEY (`branch_id`) REFERENCES `library_branch` (`branch_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

#DROP TABLE if exists `borrower`;
CREATE TABLE IF NOT EXISTS `borrower` (
  `Card_no` varchar(20) NOT NULL,
  `Ssn` varchar(12) NOT NULL,
  `Fname` varchar(45) NOT NULL,
  `Lname` varchar(45) NOT NULL,
  `Address` varchar(255) NOT NULL,
  `Phone` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `state` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`Card_no`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

#DROP TABLE if exists `book_loans`;
CREATE TABLE IF NOT EXISTS `book_loans` (
  `loan_id` int(11) NOT NULL AUTO_INCREMENT,
  `isbn` varchar(12) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `card_no` varchar(20) NOT NULL,
  `date_out` date DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `date_in` date DEFAULT NULL,
  PRIMARY KEY (`loan_id`),
  KEY `fk_bookloan_book_idx` (`isbn`),
  KEY `fk_bookloan_branch_idx` (`branch_id`),
  KEY `fk_boookloan_borrower_idx` (`card_no`),
  CONSTRAINT `fk_bookloan_book` FOREIGN KEY (`isbn`) REFERENCES `book` (`isbn`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_bookloan_branch` FOREIGN KEY (`branch_id`) REFERENCES `library_branch` (`branch_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_boookloan_borrower` FOREIGN KEY (`card_no`) REFERENCES `borrower` (`Card_no`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=665 DEFAULT CHARSET=latin1;

#DROP TABLE if exists `fines`;
CREATE TABLE IF NOT EXISTS `fines` (
  `loan_id` int(11) NOT NULL,
  `fine_amt` decimal(10,0) DEFAULT '0',
  `paid` bit(1) DEFAULT b'0',
  PRIMARY KEY (`loan_id`),
  CONSTRAINT `fk_fines_bookloans` FOREIGN KEY (`loan_id`) REFERENCES `book_loans` (`loan_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


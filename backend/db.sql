/*
SQLyog Trial v13.1.8 (64 bit)
MySQL - 10.4.21-MariaDB : Database - db_majed
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`db_majed` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `db_majed`;

/*Table structure for table `tx_log` */

DROP TABLE IF EXISTS `tx_log`;

CREATE TABLE `tx_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pubkey` varchar(256) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `date` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

/*Data for the table `tx_log` */

insert  into `tx_log`(`id`,`pubkey`,`amount`,`date`) values 
(2,'Ev8HkGcBM7qomSBfLrY88n9PpEneyoua5KquSUKghAKA',10,'February-08-2022'),
(3,'Ev8HkGcBM7qomSBfLrY88n9PpEneyoua5KquSUKghAKA',20,'February-08-2022'),
(4,'Ev8HkGcBM7qomSBfLrY88n9PpEneyoua5KquSUKghAKA',20,'February-08-2022'),
(5,'Ev8HkGcBM7qomSBfLrY88n9PpEneyoua5KquSUKghAKA',10,'February-08-2022'),
(6,'Ev8HkGcBM7qomSBfLrY88n9PpEneyoua5KquSUKghAKA',40,'February-08-2022');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

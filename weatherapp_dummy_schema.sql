-- MariaDB dump 10.19  Distrib 10.10.1-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: weatherapp_dummy
-- ------------------------------------------------------
-- Server version	10.10.1-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `weatherapp_dummy`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `weatherapp_dummy` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `weatherapp_dummy`;

--
-- Table structure for table `lokasilahan`
--

DROP TABLE IF EXISTS `lokasilahan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lokasilahan` (
  `idlahan` int(11) NOT NULL AUTO_INCREMENT,
  `lokasi` varchar(255) NOT NULL,
  PRIMARY KEY (`idlahan`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lokasilahan`
--

LOCK TABLES `lokasilahan` WRITE;
/*!40000 ALTER TABLE `lokasilahan` DISABLE KEYS */;
INSERT INTO `lokasilahan` VALUES
(1,'Cimalaka'),
(2,'Pamulihan'),
(3,'Cisitu'),
(4,'Conggeng'),
(5,'Cibeureum'),
(6,'Tanjungkerta'),
(7,'Cibuluh'),
(8,'Ganeas'),
(9,'Gegerbitung'),
(10,'Sariwangi'),
(11,'Citengah'),
(12,'Sukamandi'),
(13,'Situraja'),
(14,'Sumedang Selatan'),
(15,'Sumedang Utara'),
(16,'Jatinangor'),
(17,'Cimalaka'),
(18,'Pamulihan'),
(19,'Cisitu'),
(20,'Conggeng');
/*!40000 ALTER TABLE `lokasilahan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `noncuaca`
--

DROP TABLE IF EXISTS `noncuaca`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `noncuaca` (
  `idparameter` int(11) NOT NULL AUTO_INCREMENT,
  `ketersediaanbenih` varchar(25) NOT NULL,
  `hama` varchar(25) NOT NULL,
  `idlahan` int(11) NOT NULL,
  PRIMARY KEY (`idparameter`),
  KEY `idlahan` (`idlahan`),
  CONSTRAINT `noncuaca_ibfk_1` FOREIGN KEY (`idlahan`) REFERENCES `lokasilahan` (`idlahan`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `noncuaca`
--

LOCK TABLES `noncuaca` WRITE;
/*!40000 ALTER TABLE `noncuaca` DISABLE KEYS */;
/*!40000 ALTER TABLE `noncuaca` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `statusirigasi`
--

DROP TABLE IF EXISTS `statusirigasi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `statusirigasi` (
  `idirigasi` int(11) NOT NULL AUTO_INCREMENT,
  `status` varchar(25) NOT NULL,
  `idlahan` int(11) NOT NULL,
  PRIMARY KEY (`idirigasi`),
  KEY `idlahan` (`idlahan`),
  CONSTRAINT `statusirigasi_ibfk_1` FOREIGN KEY (`idlahan`) REFERENCES `lokasilahan` (`idlahan`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `statusirigasi`
--

LOCK TABLES `statusirigasi` WRITE;
/*!40000 ALTER TABLE `statusirigasi` DISABLE KEYS */;
/*!40000 ALTER TABLE `statusirigasi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `username` varchar(25) NOT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `role` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES
('user1','John Doe','Viewer'),
('user10','James Taylor','Viewer'),
('user2','Jane Smith','EitherOwner'),
('user3','Alice Johnson','BothOwner'),
('user4','Bob Brown','Viewer'),
('user5','Sarah Lee','Regulator'),
('user6','Michael Clark','Editor'),
('user7','Emily Davis','Viewer'),
('user8','David Wilson','Regulator'),
('user9','Jennifer Hall','EitherOwner');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `weathercondition`
--

DROP TABLE IF EXISTS `weathercondition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `weathercondition` (
  `idcuaca` int(11) NOT NULL AUTO_INCREMENT,
  `tanggal` date NOT NULL,
  `timestamp` timestamp NOT NULL,
  `suhu` float DEFAULT NULL,
  `kelembapanudara` float DEFAULT NULL,
  `intensitascahaya` float DEFAULT NULL,
  `intensitashujan` float DEFAULT NULL,
  `idlahan` int(11) NOT NULL,
  PRIMARY KEY (`idcuaca`),
  KEY `fk_idlahanweathercondition` (`idlahan`),
  CONSTRAINT `fk_idlahanweathercondition` FOREIGN KEY (`idlahan`) REFERENCES `lokasilahan` (`idlahan`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weathercondition`
--

LOCK TABLES `weathercondition` WRITE;
/*!40000 ALTER TABLE `weathercondition` DISABLE KEYS */;
INSERT INTO `weathercondition` VALUES
(1,'2024-02-26','2024-02-26 01:00:00',25.5,75,500,10,1),
(2,'2024-02-26','2024-02-26 01:00:00',28.3,68,450,5,2),
(3,'2024-02-26','2024-02-26 01:00:00',23.8,80,600,20,3),
(4,'2024-02-26','2024-02-26 01:00:00',26.1,72,550,15,4),
(5,'2024-02-26','2024-02-26 01:00:00',30.5,65,400,3,5);
/*!40000 ALTER TABLE `weathercondition` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `weatherforecast`
--

DROP TABLE IF EXISTS `weatherforecast`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `weatherforecast` (
  `idwaktutanam` int(11) NOT NULL AUTO_INCREMENT,
  `tanggal` date NOT NULL,
  `statushujan` varchar(25) NOT NULL,
  `statuswaktutanam` varchar(25) NOT NULL,
  `idlahan` int(11) NOT NULL,
  PRIMARY KEY (`idwaktutanam`),
  KEY `idlahan` (`idlahan`),
  CONSTRAINT `weatherforecast_ibfk_1` FOREIGN KEY (`idlahan`) REFERENCES `lokasilahan` (`idlahan`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weatherforecast`
--

LOCK TABLES `weatherforecast` WRITE;
/*!40000 ALTER TABLE `weatherforecast` DISABLE KEYS */;
/*!40000 ALTER TABLE `weatherforecast` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-04-24 21:35:26

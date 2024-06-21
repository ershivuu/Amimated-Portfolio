-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: portfolio
-- ------------------------------------------------------
-- Server version	8.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `homesectionfirst`
--

DROP TABLE IF EXISTS `homesectionfirst`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `homesectionfirst` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_heading` varchar(255) DEFAULT NULL,
  `first_content` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `homesectionfirst`
--

LOCK TABLES `homesectionfirst` WRITE;
/*!40000 ALTER TABLE `homesectionfirst` DISABLE KEYS */;
INSERT INTO `homesectionfirst` VALUES (1,'Creativess','I am a dedicated and results-driven product manager with a xpassion for creating innovative products that meet the needs '),(2,'Passionate','I am a dedicated and results-driven product manager with a passion for creating innovative products.'),(3,'Product','My experience has equipped me with a robust technical understanding that I leverage to communicate effectively with engineering and design teams.'),(4,'Manager','I bring a unique blend of skills and experiences that enable me to effectively bridge the gap between technical teams and market demands.');
/*!40000 ALTER TABLE `homesectionfirst` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `homesectionsecond`
--

DROP TABLE IF EXISTS `homesectionsecond`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `homesectionsecond` (
  `id` int NOT NULL AUTO_INCREMENT,
  `second_heading` varchar(255) DEFAULT NULL,
  `second_image_url` varchar(255) DEFAULT NULL,
  `original_file_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `homesectionsecond`
--

LOCK TABLES `homesectionsecond` WRITE;
/*!40000 ALTER TABLE `homesectionsecond` DISABLE KEYS */;
INSERT INTO `homesectionsecond` VALUES (1,'Animation','1718026055807.gif','vfge'),(2,'Frontend','1718026067147.gif','gfdgdf'),(3,'Interactions','1718026075495.gif','gdfgdg'),(4,'& More','1718026083224.gif','fdg');
/*!40000 ALTER TABLE `homesectionsecond` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `section_services`
--

DROP TABLE IF EXISTS `section_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `section_services` (
  `services_id` int NOT NULL AUTO_INCREMENT,
  `main_heading` varchar(255) DEFAULT NULL,
  `main_content` varchar(255) DEFAULT NULL,
  `section_img` varchar(255) DEFAULT NULL,
  `section_img_original_name` varchar(255) DEFAULT NULL,
  `section_heading` varchar(255) DEFAULT NULL,
  `section_content` longtext,
  PRIMARY KEY (`services_id`),
  UNIQUE KEY `unique_main_heading_main_content` (`main_heading`,`main_content`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `section_services`
--

LOCK TABLES `section_services` WRITE;
/*!40000 ALTER TABLE `section_services` DISABLE KEYS */;
INSERT INTO `section_services` VALUES (1,'Services','Together, these services help companies and organizations use technology more efficiently, increase productivity, improve customer satisfaction, and spur innovation and growth.','1717825016366.jpeg','software.jpeg','Software Development','\r\nSoftware development is a comprehensive process that involves the creation and maintenance of applications, frameworks, or other software components. It encompasses several stages, including planning, analysis, design, development, testing, deployment, and maintenance.'),(2,'Services','Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ','1717840490167.jpeg','ui.jpeg','UI/UX DESIGN','UI/UX design is a critical component of software development, focusing on creating intuitive, user-friendly, and aesthetically pleasing interfaces. Here’s an overview of the concepts, processes, and best practices in UI/UX design'),(10,NULL,NULL,'1717840548282.jpeg','mobile.jpeg','MOBILE DEVELOPMENT  ','Mobile development involves creating software applications that run on mobile devices, such as smartphones and tablets. It encompasses various stages, from concept and design to coding, testing, and deployment.'),(11,NULL,NULL,'1717841062195.jpeg','webdev.jpeg','WEB DEVELOPMENT ','Web development involves creating and maintaining websites and web applications. It encompasses various disciplines, including front-end development, back-end development, and full-stack development.'),(14,NULL,NULL,'1717841097967.jpeg','digital_marketing.jpeg','DIGITAL MARKETING ','\r\nDigital marketing involves promoting products or services using digital channels to reach and engage a targeted audience. This includes a range of strategies such as SEO, content marketing, social media marketing, email marketing, and more.');
/*!40000 ALTER TABLE `section_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `section_works`
--

DROP TABLE IF EXISTS `section_works`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `section_works` (
  `idsection_works` int NOT NULL AUTO_INCREMENT,
  `heading` varchar(255) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `work_img` varchar(255) DEFAULT NULL,
  `work_img_original_name` varchar(255) DEFAULT NULL,
  `project_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idsection_works`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `section_works`
--

LOCK TABLES `section_works` WRITE;
/*!40000 ALTER TABLE `section_works` DISABLE KEYS */;
INSERT INTO `section_works` VALUES (1,'Mobile Apps','Lorem Ipsum is simply dummy text of the printing and typesetting industry. ','1718186704688.jpg','iposup.jpg',NULL),(2,'Desktop Apps','Lorem Ipsum is simply dummy text','1717832262751.jpg','medicaps.jpg',NULL),(10,'Web Apps','Lorem Ipsum is simply dummy text of the printing and','1718111042750.jpg',NULL,'cviewsirvey.jpg');
/*!40000 ALTER TABLE `section_works` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sliders`
--

DROP TABLE IF EXISTS `sliders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sliders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `image` varchar(255) DEFAULT NULL,
  `description` longtext,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sliders`
--

LOCK TABLES `sliders` WRITE;
/*!40000 ALTER TABLE `sliders` DISABLE KEYS */;
INSERT INTO `sliders` VALUES (1,'1717838780270.jpeg','PROJECT 1','2024-06-08 09:26:20'),(2,'1717838845361.jpeg','PROJECT 2','2024-06-08 09:27:25'),(3,'1717838866050.jpeg','PROJECT 3','2024-06-08 09:27:46'),(4,'1717838883583.jpeg','PROJECT 4','2024-06-08 09:28:03'),(5,'1717838915050.jpeg','PROJECT 5','2024-06-08 09:28:35'),(6,'1717838968744.jpg','PROJECT 6','2024-06-08 09:29:29'),(28,'1718350526758.jpg','test 2','2024-06-14 07:35:26');
/*!40000 ALTER TABLE `sliders` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-21 10:49:03

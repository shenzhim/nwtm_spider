DROP TABLE IF EXISTS `data`;
CREATE TABLE `data` (
  `sku` bigint(20) NOT NULL,
  `name` varchar(160),
  `marketprice` DOUBLE(8,2),
  `saleprice` DOUBLE(8,2),
  `status` varchar(10),
  `reason` varchar(160),
  `created` DATETIME,
  `changed` DATETIME,
  PRIMARY KEY (`sku`),
  KEY `I_Table` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
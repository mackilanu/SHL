<?php

require_once("includes/config.php");
require_once("includes/opendb.php");
require_once("includes/epostsender.php");

echo FILEBEGIN;
 
echo '<title>Startsida</title>';
echo MOBILE;

require_once("includes/bootstrap.php");



echo BODYBEGIN;

require_once("includes/header.php");




echo CONTENTBEGIN;
echo "<script type='text/javascript' src='javascript/login.js'></script>";




echo CONTENTEND;
require_once("includes/footer.php");	
echo "<link rel='stylesheet' type='text/css' href='css/login.css'>";
echo "<script type='text/javascript' src='javascript/md5.js'></script>";


echo BODYEND;
?>


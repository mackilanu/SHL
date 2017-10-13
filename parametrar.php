<?php

@session_start();

if (!isset($_SESSION['JerseyNo'])){
    header('Location: nosession.php');
    exit;
}

if ($_SESSION['Priviledge'] != 4){
    header('Location: unauthorized.php');
    exit;
}


header("Content-type: text/html; charset=utf-8");

date_default_timezone_set("Europe/Stockholm");


require_once("includes/config.php");
require_once("includes/opendb.php");
require_once("includes/io.php");

echo DOCTYPEN . '<title>Ändra parametrar</title>' . RESTEN;

echo BODY;

echo FOTEN;
require_once("includes/parametrar.php");


require_once("includes/loginfo.php"); // Fixar inloggningsuppgifterna


// Tillhörande JavaScript-filer
echo '<script type="text/javascript" src="javascript/common.js"></script>';
echo '<script type="text/javascript" src="javascript/parametrar.js"></script>';


echo AVSLUT;

?>


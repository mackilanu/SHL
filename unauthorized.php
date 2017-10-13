<?php

@session_start();


if (!isset($_SESSION['JerseyNo'])){
    header('Location: nosession.php');
    exit;
}

header("Content-type: text/html; charset=utf-8");

date_default_timezone_set("Europe/Stockholm");


require_once("includes/config.php");


echo DOCTYPEN . '<title>Obehörig</title>' . RESTEN;

echo BODY;

echo FOTEN;
//require_once("includes/parametrar.php");


require_once("includes/loginfo.php"); // Fixar inloggningsuppgifterna


// Tillhörande JavaScript-filer
echo '<script type="text/javascript" src="javascript/common.js"></script>';
echo '<script type="text/javascript" src="javascript/unauthorized.js"></script>';

echo AVSLUT;


?>

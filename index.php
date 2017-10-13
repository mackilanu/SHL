<?php

@session_start();


header("Content-type: text/html; charset=utf-8");

date_default_timezone_set("Europe/Stockholm");


require_once("includes/config.php");
require_once("includes/opendb.php");
require_once("includes/io.php");

echo DOCTYPEN . '<title>Startsida</title>' . RESTEN;

echo BODY;

echo FOTEN;
require_once("includes/parametrar.php");


// Tillhörande JavaScript-filer
echo '<script type="text/javascript" src="javascript/common.js"></script>';
echo '<script type="text/javascript" src="javascript/index.js"></script>';

echo AVSLUT;



?>

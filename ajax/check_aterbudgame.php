<?php

@session_start();


if (!isset($_SESSION['JerseyNo'])){
    header("Location: ../nosession.php");
    exit();
}

header("Content-type: text/html; charset=utf-8");

date_default_timezone_set("Europe/Stockholm");

require_once("../includes/config.php");
require_once("../includes/io.php");
require_once("../includes/opendb.php");
require_once("../includes/epostsender.php");

$JerseyNo  = $_GET['JerseyNo'];
$Date      = $_GET['Date'];
$season    = $_SESSION['Season'];

echo CheckIfGame($JerseyNo, $Date, $season);

function CheckIfGame($JerseyNo, $Date, $season){
   
   $message_data = "SHL-ERROR vid ajax/Send_aterbud.php function CheckIfGame($JerseyNo, $Date, $season)";
   $SQL          = "CALL read_match('$season', '$JerseyNo', '$Date')";

   list($affected_rows, $result) = opendb($message_data, $SQL);

   if($affected_rows == 1){
     return '{"status": "GameDay", "date": "'. $Date .'"}';
   }else{
      return '{"status": "NoGame", "date": "'. $Date .'"}';
 }
}



?>

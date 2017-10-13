<?php

header("Content-type: text/html; charset=utf-8");

@session_start();

if (!isset($_SESSION['JerseyNo'])){
    header("Location: ../nosession.php");
    exit();
}



date_default_timezone_set("Europe/Stockholm");

require_once("../includes/config.php");
require_once("../includes/io.php");
require_once("../includes/opendb.php");


$season     = $_GET['season'];
$JerseyNo   = $_GET['JerseyNo'];
$Datum      = $_GET['Datum'];


echo removeledighet($season,$JerseyNo,$Datum);





function removeledighet($season,$JerseyNo,$Datum){
    $message_data = "SHL-ERROR vid ajax/delete_ledighet.php function removeledighet($season,$JerseyNo,$Datum)";


    $SQL = "CALL delete_Ledighet($season,$JerseyNo,'$Datum')";


    list($affected_rows,$result)  = opendb($message_data,$SQL);
    if (!$result) return '{"status": "Error"}';

    return '{"status": "OK"}';
}

?>

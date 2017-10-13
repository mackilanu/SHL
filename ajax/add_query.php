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


$QueryID   = $_GET['QueryID'];
$Query     = $_GET['Query'];

echo addquery($QueryID, $Query);





function addquery($QueryID, $Query){
    $message_data = "SHL-ERROR vid ajax/add_query.php function addquery($QueryID, $Query)";


    $Season  = $_SESSION['Season'];
    $SQL = "CALL insert_CoachRapportQuerys($Season, $QueryID, '$Query')";
    
    list($affected_rows,$result)  = opendb($message_data,$SQL);
    if (!$result) return '{"status": "Error"}';

    return '{"status": "OK"}';
}

?>

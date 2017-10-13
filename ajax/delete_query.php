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

echo deletequery($QueryID);





function deletequery($QueryID){
    $message_data = "SHL-ERROR vid ajax/delete_query.php function deletequery($QueryID)";


    $Season  = $_SESSION['Season'];
    $SQL = "CALL delete_CoachRapportQuery($Season,$QueryID)";

    list($affected_rows,$result)  = opendb($message_data,$SQL);
    if (!$result) return '{"status": "Error"}';

    return '{"status": "OK"}';
}

?>

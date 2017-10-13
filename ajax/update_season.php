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


$LastDate  = $_GET['LastDate'];
$Publish   = $_GET['Publish'];

echo  update_data($LastDate,$Publish);



function update_data($LastDate,$Publish){

    $message_data = "SHL-ERROR vid ajax/update_season.php function update_data($LastDate,$Publish)";

    $Season = $_SESSION['Season'];
    $SQL          = "CALL update_Season($Season,'$LastDate',";
    if (!$Publish){
        $SQL .= 'NULL';
    } else {
        $SQL .= "'$Publish'";
    }
    $SQL .= ')';

    list($affected_rows,$result) = opendb($message_data,$SQL);

    if (!$result OR $affected_rows == 0) return '{"status": "Error"}';

    return '{"status": "OK"}';
}

?>

<?php

header("Content-type: text/html; charset=utf-8");

@session_start();

if (!isset($_SESSION['JerseyNo'])){
    header("Location: ../nosession.php");
    exit();
}

header('Content-Type: application/json');


date_default_timezone_set("Europe/Stockholm");

require_once("../includes/config.php");
require_once("../includes/io.php");
require_once("../includes/opendb.php");


$season     = $_GET['season'];
$JerseyNo   = $_GET['JerseyNo'];

echo getFranvaro($season,$JerseyNo);



function getFranvaro($season,$JerseyNo){

    $message_data = "SHL-ERROR vid ajax/get_franvaro.php function getFranvaro($season,$JerseyNo).";

    if ($JerseyNo == 0){
        $SQL  = "CALL read_AllasLedigheter($season)";
    } else {
        $SQL  = "CALL read_DomarLedigheter($season,$JerseyNo)";
    }

    $affected_rows = 0;
    list($affected_rows,$result)    = opendb($message_data,$SQL);
    if (!$result) return '{"status": "Error"}';

    $Ledighet = '{"status": "OK", "Dag": [';
    for ($i = 0; $i < $affected_rows; ++$i){

        $row = $result->fetch_array(MYSQLI_ASSOC);
        if ($i > 0){
            $Ledighet .=  ',';
        }
        $Ledighet     .=  json_encode($row);
    }
    $Ledighet       .= ']}';


    return $Ledighet;
}

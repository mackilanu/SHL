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



$season    = $_GET['season'];
$JerseyNo  = $_GET['JerseyNo'];


$Querylista  = read_reportquerys($season);
if ($Querylista != '{"status": "Error"}'){
    $Querylista = read_rapporter($season,$JerseyNo);
}

echo $Querylista;



function read_reportquerys($season){

    global $Querylista;

    $message_data = "SHL-ERROR vid ajax/rapporter.php function read_reportquerys($season).";

    $SQL  = "CALL read_report_querys($season)";

    list($affected_rows,$result) = opendb($message_data,$SQL);

    if (!$result) return '{"status": "Error"}';


    $Querylista = '{"status": "OK", "Query": [';
    for ($i = 0; $i < $affected_rows; ++$i){
        $row = $result->fetch_array(MYSQLI_ASSOC);
        if ($i > 0){
            $Querylista .=  ',';
        }
        $Querylista     .=  json_encode($row);
    }
    $Querylista         .= '], ';

    return $Querylista;

}

function read_rapporter($season,$JerseyNo){

    global $Querylista;

    $message_data = "SHL-ERROR vid ajax/rapporter.php function read_rapport($season,$JerseyNo).";



    if ($JerseyNo == 0){
        $SQL  = "CALL read_AllasRapporter($season)";
    } else {
        $SQL  = "CALL read_rapporter($season, $JerseyNo)";
    }

    list($affected_rows,$result) = opendb($message_data,$SQL);

    if (!$result) return '{"status": "Error"}';

    $Querylista .= '"Rapport": [';
    for ($i = 0; $i < $affected_rows; ++$i){
        $row = $result->fetch_array(MYSQLI_ASSOC);
        if ($i > 0){
            $Querylista .=  ',';
        }
        $Querylista     .=  json_encode($row);
    }

    $Querylista         .= ']}';

    return $Querylista;

}

?>

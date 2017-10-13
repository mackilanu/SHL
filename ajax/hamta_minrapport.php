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



$GameId  = $_GET['GameId'];

$svar  = read_reportquerys();
if ($svar != '{"status": "Error"}'){
    $s = $svar;
    $svar = read_rapport($GameId);
    if ($svar != '{"status": "Error"}'){
        if ($svar != '"Betyg": -1, '){
            $s .= $svar;
            $svar = read_rapportrader($GameId);
            if ($svar != '{"status": "Error"}') $s .= $svar;
        } else {
            $s .= '"Answer": []}';
        }
    }
}

echo $s;



function read_reportquerys(){

    $message_data = "SHL-ERROR vid ajax/hamta_minrapport.php function read_reportquerys().";

    $Season       = $_SESSION['Season'];
    $SQL  = "CALL read_report_querys($Season)";

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

function read_rapport($GameId){

    $message_data = "SHL-ERROR vid ajax/hamta_minrapport.php function read_rapport($GameId).";

    
    $Season       = $_SESSION['Season'];
    $JerseyNo     = $_SESSION['JerseyNo'];
    $SQL  = "CALL read_minCoachRapporter($Season, $GameId, $JerseyNo)";
    
    list($affected_rows,$result) = opendb($message_data,$SQL);

    if (!$result) return '{"status": "Error"}';

    if ($affected_rows == 0){
        $Betyg = '"Betyg": -1, '; //Betyder att rapport ej skriven eller ej publicerad
    } else {
        $row   = $result->fetch_row();
        $Betyg = '"Betyg": ' . $row[0] . ', ';
    }
    
    return $Betyg;

}


function read_rapportrader($GameId){

    $message_data = "SHL-ERROR vid ajax/hamta_minrapport.php function read_rapportrader($GameId).";

    $Season       = $_SESSION['Season'];
    $JerseyNo     = $_SESSION['JerseyNo'];
    $SQL  = "CALL read_minCoachRapport($Season, $GameId, $JerseyNo)";
    
    list($affected_rows,$result) = opendb($message_data,$SQL);

    if (!$result) return '{"status": "Error"}';


    $Answerlista = '"Answer": [';
    for ($i = 0; $i < $affected_rows; ++$i){
        $row = $result->fetch_array(MYSQLI_ASSOC);
        if ($i > 0){
            $Answerlista .=  ',';
        }
        $Answerlista     .=  json_encode($row);
    }
    $Answerlista         .= ']}';

    
    return $Answerlista;

}

?>

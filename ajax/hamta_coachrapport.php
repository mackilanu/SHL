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
$DomarID = $_GET['DomarID'];

$s  = read_reportquerys();
$s .= read_rapport($GameId,$DomarID);
$s .= read_rapportrader($GameId,$DomarID);

echo $s;



function read_reportquerys(){

    $message_data = "SHL-ERROR vid ajax/hamta_coachrapport.php function read_reportquerys().";

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

function read_rapport($GameId,$DomarID){

    $message_data = "SHL-ERROR vid ajax/hamta_coachrapport.php function read_rapport($GameId).";

    
    $Season  = $_SESSION['Season'];
    $SQL     = "CALL read_CoachRapporter($Season, $GameId, $DomarID)";

    list($affected_rows,$result) = opendb($message_data,$SQL);

    if (!$result) return '{"status": "Error"}';

    if ($affected_rows == 0){
        $svar  = '"Betyg": -1, '; // Rapport ej skriven
        $svar .= '"Publicera": "N", '; // Ej publicerad
    } else {
        $row   = $result->fetch_row();
        $svar  = '"Betyg": "'    . $row[0] . '", ';
        $svar .= '"Publicera":"' . $row[1] . '", ';
    }
    
    return $svar;

}


function read_rapportrader($GameId,$DomarID){

    $message_data = "SHL-ERROR vid ajax/hamta_coachrapport.php function read_rapportrader($GameId).";

    $Season  = $_SESSION['Season'];
    $SQL     = "CALL read_minCoachRapport($Season, $GameId, $DomarID)";
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

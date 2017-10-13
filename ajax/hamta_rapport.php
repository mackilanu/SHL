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



$season   = $_GET['season'];
$JerseyNo = $_GET['JerseyNo'];
$GameId   = $_GET['GameId'];


echo read_rapportrader($season,$JerseyNo,$GameId);



function read_rapportrader($season,$JerseyNo,$GameId){

    $message_data = "SHL-ERROR vid ajax/hamta_rapport.php function read_rapportrader($season,$JerseyNo,$GameId).";

    $SQL  = "CALL read_minCoachRapport($season, $GameId, $JerseyNo)";

    list($affected_rows,$result) = opendb($message_data,$SQL);

    if (!$result) return '{"status": "Error"}';


    $Answerlista = '{"status": "OK", "Answer": [';
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

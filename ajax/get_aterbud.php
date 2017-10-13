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


echo  read_Aterbud($season,$JerseyNo);


function read_Aterbud($season,$JerseyNo){

    $message_data = "SHL-ERROR vid ajax/get_aterbud.php function read_Aterbud($season,$JerseyNo).";

    $svar = '';
    if ($JerseyNo == 0){
        $svar = read_Alla($season);
    } else {
        $svar = read_En($season, $JerseyNo);
    }

    return $svar;
}

function read_Alla($season){
    $message_data = "SHL-ERROR vid ajax/get_aterbud.php function read_Alla($season).";

    $SQL  = "CALL read_AllasAterbud($season)";

    list($affected_rows,$result) = opendb($message_data,$SQL);

    if (!$result) return '{"status": "Error"}';

    $Aterbudslista = '{"status": "OK", "Dag": [';
    for ($i = 0; $i < $affected_rows; ++$i){
        $row = $result->fetch_array(MYSQLI_ASSOC);
        if ($i > 0){
            $Aterbudslista .=  ',';
        }
        $Aterbudslista     .=  json_encode($row);
    }

    $Aterbudslista         .= ']}';

    return $Aterbudslista;

}


function read_En($season, $JerseyNo){

    $message_data = "SHL-ERROR vid ajax/get_aterbud.php function read_En($season,$JerseyNo).";

    $SQL  = "CALL read_Aterbud($season, $JerseyNo)";

    list($affected_rows,$result) = opendb($message_data,$SQL);

    if (!$result) return '{"status": "Error"}';


    $Aterbudslista = '{"status": "OK", "Dag": [';
    for ($i = 0; $i < $affected_rows; ++$i){
        $row = $result->fetch_array(MYSQLI_ASSOC);
        if ($i > 0){
            $Aterbudslista .=  ',';
        }
        $Aterbudslista     .=  json_encode($row);
    }

    $Aterbudslista         .= '], "Match": [';

    $FromDate  = new DateTime("now",new DateTimeZone('Europe/Stockholm'));
    $FromDate  = $FromDate->format("Y-m-d H:i:s");
    //$FromDate  = '2017-03-01 00:00:00';
    $SQL  = "CALL read_tillsattamatcher($season, $JerseyNo, '$FromDate')";

    $affected_rows = 0;
    list($affected_rows,$result) = opendb($message_data,$SQL);

    if (!$result) return '{"status": "Error"}';



    for ($i = 0; $i < $affected_rows; ++$i){
        $row = $result->fetch_array(MYSQLI_ASSOC);
        if ($i > 0){
            $Aterbudslista .=  ',';
        }
        $Aterbudslista     .=  json_encode($row);
    }

    $Aterbudslista         .= ']}';


    return $Aterbudslista;

}


?>

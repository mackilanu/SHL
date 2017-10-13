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



$season    = $_GET['season'];
$JerseyNo  = $_GET['JerseyNo'];


echo  read_Aterbud($season, $JerseyNo);


function read_Aterbud($season, $JerseyNo){

    $message_data = "SHL-ERROR vid ajax/aterbudstat.php function read_Aterbud($season, $JerseyNo).";

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

    $Aterbudslista         .= ']}';


    return $Aterbudslista;

}


?>

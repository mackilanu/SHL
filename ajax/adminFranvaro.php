<?php

header("Content-type: text/html; charset=utf-8");

@session_start();

if (!isset($_SESSION['JerseyNo'])){
    header("Location: ../nosession.php");
    exit();
}


require_once("../includes/config.php");
require_once("../includes/io.php");
require_once("../includes/opendb.php");


date_default_timezone_set("Europe/Stockholm");

echo getFranvaro();

function getFranvaro(){

    $message_data = "SHL-ERROR vid ajax/adminFranvaro.php function getFranvaro().";

    $JerseyNo = $_SESSION['JerseyNo'];
    $Season   = $_GET['Season'];
    $month    = $_GET['month'];


    if ($month == 0){
        $SQL  = "CALL read_Ledigheter($Season,$JerseyNo)";
    } else {

        $MinDatum = $_SESSION['MinDatum'];
        $MaxDatum = $_SESSION['MaxDatum'];

        $MinYear  = substr($MinDatum,0,4);
        $MaxYear  = substr($MaxDatum,0,4);

        $MinMonth = substr($MinDatum,5,2);
        $MaxMonth = substr($MaxDatum,5,2);

        if($month >= $MinMonth){
            $year = $MinYear;
        } else {
            $year = $MaxYear;
        }

        $SQL  = "CALL read_LedigheterMonth($Season, $JerseyNo, $year, $month)";
    }

    list($num_rows,$result) = opendb($message_data,$SQL);

    if (!$result) return '{"status": "Error"}';


    $Ledighet = '{"status": "OK", "Dag": [';
    for ($i = 0; $i < $num_rows; ++$i){

        $row = $result->fetch_array(MYSQLI_ASSOC);
        if ($i > 0){
            $Ledighet .=  ',';
        }
        $Ledighet     .=  json_encode($row);
    }
    $Ledighet       .= ']}';

    write_error("Ledighet=$Ledighet");

    return $Ledighet;
}

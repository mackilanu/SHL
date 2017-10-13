<?php

@session_start();

if (!isset($_SESSION['JerseyNo'])){
    $svar = '{"logged_out": "logedout"}';
    echo $svar;
    exit;
}


header("Content-type: text/html; charset=utf-8");

date_default_timezone_set("Europe/Stockholm");



require_once("../includes/config.php");
require_once("../includes/io.php");
require_once("../includes/opendb.php");
require_once("../includes/epostsender.php");


$svar     = '';
$JerseyNo = $_SESSION['JerseyNo'];


try {

    // Uppdatera utloggningen
    $message_data = "ERROR vid ajax/loggaut.php";

    if (isset($_SESSION['TrafficID'])){
        if ($_SESSION['TrafficID'] != -1){
            $TrafficID = $_SESSION['TrafficID'];
            $SQL       = "CALL update_UserTraffic($TrafficID)";


            list($affected_rows,$result) = opendb($message_data,$SQL);

            if (!$result || $affected_rows == 0){
                write_error(" ERROR - Uppdaterinen av inloggning misslyckades för JerseyNo=$JerseyNo enligt SQL=$SQL");
            }
        }
    }

    unset($_SESSION['Season']);
    unset($_SESSION['MinDatum']);
    unset($_SESSION['MaxDatum']);
    unset($_SESSION['JerseyNo']);
    unset($_SESSION['FirstName']);
    unset($_SESSION['LastName']);
    unset($_SESSION['Priviledge']);
    unset($_SESSION['Domartyp']);
    unset($_SESSION['databasens_Pw']);
    unset($_SESSION['TrafficID']);

    $svar = '{"logged_out": "yes"}';
}

catch(Exception $e) {
    $svar = '{"logged_out": "no"}';
    send_dberror(TO, 'SHL-ERROR vid ajax/loggaut.php',$e->getMessage());
}

echo $svar;

?>
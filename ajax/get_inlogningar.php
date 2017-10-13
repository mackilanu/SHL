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


$JerseyNo   = $_GET['JerseyNo'];


echo getinlogningar($JerseyNo);




// ================= Funktioner =================

function getinlogningar($JerseyNo){

    $message_data  = "ERROR vid /ajax/get_inlogningar.php function getinlogningar($JerseyNo)";

    $YYYY         = date('Y');
    $YYYY        -= 1;
    $MM           = date('m');
    $DD           = date('d');

    $Inloggning   = $YYYY . '-' . $MM . '-' . $DD; // Ett år tillbaka från dagens datum

    if ($JerseyNo == 0){
        $SQL     = "CALL read_AllasTrafik('$Inloggning')";
    } else {
        $SQL     = "CALL read_EnsTrafik('$Inloggning', $JerseyNo)";
    }


    $affected_rows = 0;
    list($affected_rows,$result)    = opendb($message_data,$SQL);
    if (!$result) return '{"status": "Error"}';

    $Data = '{"status": "OK", "Inlogningar": [';
    if ($affected_rows > 0){
        for ($i = 0; $i < $affected_rows; ++$i){
            $row = $result->fetch_array(MYSQLI_ASSOC);

            if ($i > 0){
                $Data .=  ',';
            }
            $Data .=  json_encode($row);
        }
    }
    $Data .= ']}';


    return $Data;

}

?>
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


$Season    = $_SESSION['Season'];
$GameId    = $_GET['GameId'];
$kolumn    = $_GET['kolumn'];
$JerseyNo  = $_GET['JerseyNo'];


if ($kolumn == 1){
    if ($JerseyNo == -1){
        $SQL = "CALL update_Match_HD1($Season,$GameId,NULL)";
    } else {
        $SQL = "CALL update_Match_HD1($Season,$GameId,$JerseyNo)";
    }
} else if ($kolumn == 2){
    if ($JerseyNo == -1){
        $SQL = "CALL update_Match_HD2($Season,$GameId,NULL)";
    } else {
        $SQL = "CALL update_Match_HD2($Season,$GameId,$JerseyNo)";
    }
} else if ($kolumn == 3){
    if ($JerseyNo == -1){
        $SQL = "CALL update_Match_LD1($Season,$GameId,NULL)";
    } else {
        $SQL = "CALL update_Match_LD1($Season,$GameId,$JerseyNo)";
    }
} else if ($kolumn == 4){
    if ($JerseyNo == -1){
        $SQL = "CALL update_Match_LD2($Season,$GameId,NULL)";
    } else {
        $SQL = "CALL update_Match_LD2($Season,$GameId,$JerseyNo)";
    }
} else if ($kolumn == 5){
    if ($JerseyNo == -1){
        $SQL = "CALL update_Match_Dcoach($Season,$GameId,NULL)";
    } else {
        $SQL = "CALL update_Match_Dcoach($Season,$GameId,$JerseyNo)";
    }
}



$message_data = "SHL-ERROR vid ajax/update_tillsattning.php SQL=$SQL";

//Execute database-query
$affected_rows = 0;
list($affected_rows,$result) = opendb($message_data,$SQL);

$svar = '';
if (!$result OR $affected_rows == 0){
    $svar = '{"status": "Error"}';
} else {
    $svar = Publicera($Season,$GameId);
}

echo $svar;


function Publicera($Season,$GameId){

    $message_data = "SHL-ERROR vid ajax/update_tillsattning.php function publicera($Season,$GameId).";

    
    $SQL  = "CALL read_AllaMatchdomare($Season, $GameId)";
    
    list($affected_rows,$result) = opendb($message_data,$SQL);

    if (!$result or $affected_rows == 0) return '{"status": "Error"}';

    $row = $result->fetch_row();
    $HD1 =  $row[0];
    $HD2 =  $row[1];
    $LD1 =  $row[2];
    $LD2 =  $row[3];

    $s = '{"status": "OK", "AktiveraPublicera": "';
    if ($HD1 > 0 and $HD2 > 0 and $LD1 > 0 and $LD2 > 0){
        $s .= 'J';
    } else {
        $s .= 'N';
    }
    $s .= '"}';
    
    return $s;

}

?>

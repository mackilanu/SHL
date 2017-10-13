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
$action    = $_GET['action'];


if ($action != 'krysslista'){
    echo '{"status": "Fel indata"}';
    exit();
}



// Ta reda på maxmånaden där tillsättning av HD finns
$svar = '{"status": "OK", ';
$message_data = "SHL-ERROR vid ajax/kryssllista.php";

$SQL  = "CALL read_maxdate($Season)";

list($affected_rows,$result) = opendb($message_data,$SQL);

if (!$result){
    echo '{"status": "Error"}';
    exit();
}

$row     = $result->fetch_row();
$MaxDate = $row[0];
$YYYY    = substr($MaxDate,0,4);
$MM      = substr($MaxDate,5,2);
$svar .= '"MaxDate": "' . $MaxDate . '", "Domare": [';

// Ta sedan reda på alla HD

$SQL  = "CALL read_domarNamn()";

list($affected_rows,$result) = opendb($message_data,$SQL);

if (!$result){
    echo '{"status": "Error"}';
    exit();
}

for ($i = 0; $i < $affected_rows; ++$i){
    $row = $result->fetch_array(MYSQLI_ASSOC);
    if ($i > 0){
        $svar .=  ',';
    }
    $svar     .=  json_encode($row);
}

$svar         .= '], "Ledigheter": [';


// Ta reda på alla ledigheter för alla HD för maxmånaden
$SQL  = "CALL read_monthLedigheter($Season,$YYYY,$MM)";

list($affected_rows,$result) = opendb($message_data,$SQL);

if (!$result){
    echo '{"status": "Error"}';
    exit();
}

for ($i = 0; $i < $affected_rows; ++$i){
    $row = $result->fetch_array(MYSQLI_ASSOC);
    if ($i > 0){
        $svar .=  ',';
    }
    $svar     .=  json_encode($row);
}



$svar         .= '], "Matcher": [';

// Ta reda på alla tillsatta matcher
$Datum1 = $YYYY . '-' . $MM . '-' . '01 00:00:00';
$days = cal_days_in_month(CAL_GREGORIAN,$MM,$YYYY);
$Datum2 = $YYYY . '-' . $MM . '-' . $days . ' 23:59:59';
$domartyp = 1;
$SQL  = "CALL read_monthDomare('$Datum1','$Datum2',$domartyp)";

list($affected_rows,$result) = opendb($message_data,$SQL);

if (!$result){
    echo '{"status": "Error"}';
    exit();
}

for ($i = 0; $i < $affected_rows; ++$i){
    $row = $result->fetch_array(MYSQLI_ASSOC);
    if ($i > 0){
        $svar .=  ',';
    }
    $svar     .=  json_encode($row);
}

$svar         .= ']}';


echo $svar;


?>

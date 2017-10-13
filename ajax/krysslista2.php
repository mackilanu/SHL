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
$manad     = $_GET['manad'];
$domartyp  = $_GET['domartyp'];
write_error("Kryssllista2-domartyp=$domartyp");

$svar = '{"status": "OK", ';
$message_data = "SHL-ERROR vid ajax/kryssllista2.php";
/*
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

*/
// Ta reda på alla ledigheter för alla HD för maxmånaden
$svar         .= '"Ledigheter": [';
$YYYY  = $Season;
if ($manad < 8) $YYYY += 1;

$SQL  = "CALL read_monthLedigheter($Season,$YYYY,$manad)";

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
$Datum1 = $YYYY . '-' . $manad . '-' . '01 00:00:00';
$days = cal_days_in_month(CAL_GREGORIAN,$manad,$YYYY);
$Datum2 = $YYYY . '-' . $manad . '-' . $days . ' 23:59:59';
$SQL  = "CALL read_monthDomare('$Datum1','$Datum2',$domartyp)";
write_error("SQL=$SQL");
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


write_error("svar=$svar");
echo $svar;


?>

<?php

@session_start();

if (!isset($_SESSION['JerseyNo'])){
    header('Location: nosession.php');
    exit;
}

if ($_SESSION['Priviledge'] != 3 and $_SESSION['Domartyp'] != 3){
    header('Location: unauthorized.php');
    exit;
}


header("Content-type: text/html; charset=utf-8");

date_default_timezone_set("Europe/Stockholm");


require_once("includes/config.php");
require_once("includes/io.php");
require_once("includes/opendb.php");

echo DOCTYPEN . '<title>Mina matcher</title>' . RESTEN;

echo BODY;

echo FOTEN;
require_once("includes/parametrar.php");


require_once("includes/loginfo.php"); // Fixar inloggningsuppgifterna

$FromDate  = new DateTime("now",new DateTimeZone('Europe/Stockholm'));
$FromDate  = $FromDate->format("Y-m-d");
$ToDate    = date('Y-m-d', strtotime($FromDate. ' + 7 days'));

echo '<script type="text/javascript">';
echo "var FromDate = '" . $FromDate . "';";
echo "var ToDate = '"   . $ToDate   . "';";

echo "var Domarlista  = '';";
echo "Domarlista      = JSON.parse( '" . read_domare()   . "' );";

echo "var Matchlista  = '';";
echo "Matchlista      = JSON.parse( '" . read_matcher($FromDate,$ToDate)   . "' );";
echo "</script>";

// Tillhörande JavaScript-filer
echo '<script type="text/javascript" src="javascript/common.js"></script>';
echo '<script type="text/javascript" src="javascript/coachmatcher.js"></script>';


echo AVSLUT;


function read_domare(){

    $message_data = "SHL-ERROR vid minamatcher.php function read_domare().";

    $SQL  = "CALL read_Domare()";

    list($affected_rows,$result) = opendb($message_data,$SQL);


    if (!$result or $affected_rows == 0){
        return '{"status": "Error"}';
    }


    $Domarlista = '{"status": "OK", "Domare": [';
    for ($i = 0; $i < $affected_rows; ++$i){
        $row = $result->fetch_array(MYSQLI_ASSOC);
        if ($i > 0){
            $Domarlista .=  ',';
        }
        $Domarlista     .=  json_encode($row);
    }
    $Domarlista         .= ']}';

    return $Domarlista;

}


function read_matcher($FromDate,$ToDate){

    $message_data = "SHL-ERROR vid coachmatcher.php function read_matcher($FromDate,$ToDate).";
    $Season       = $_SESSION['Season'];
    $JerseyNo     = $_SESSION['JerseyNo'];

    $SQL  = "CALL read_matcherCoach($Season, $JerseyNo, '$FromDate', '$ToDate')";

    list($affected_rows,$result) = opendb($message_data,$SQL);

    if (!$result) return '{"status": "Error"}';


    $Matchlista = '{"status": "OK", "Match": [';

    for ($i = 0; $i < $affected_rows; ++$i){
        $row = $result->fetch_row();
        if ($i > 0){
            $Matchlista .=  ',';
        }
        // $Matchlista     .=  json_encode($row);

        $GameId   = $row[0];
        $Date     = $row[1];
        $HomeCode = $row[2];
        $HomeName = $row[3];
        $AwayCode = $row[4];
        $AwayName = $row[5];
        $HD1      = $row[6];
        $HD2      = $row[7];
        $LD1      = $row[8];
        $LD2      = $row[9];
        $Dcoach   = $row[10];
        $Arena    = $row[11];


        // Hämtar information om Coachrapport för HD1
        $HD1color = rapportinfo($GameId, $HD1);
        $HD2color = rapportinfo($GameId, $HD2);
        $LD1color = rapportinfo($GameId, $LD1);
        $LD2color = rapportinfo($GameId, $LD2);

        $Matchlista .= '{"GameId": "'  . $GameId   . '", ';
        $Matchlista .= '"Date": "'     . $Date     . '", ';
        $Matchlista .= '"HomeCode": "' . $HomeCode . '", ';
        $Matchlista .= '"HomeName": "' . $HomeName . '", ';
        $Matchlista .= '"AwayCode": "' . $AwayCode . '", ';
        $Matchlista .= '"AwayName": "' . $AwayName . '", ';
        $Matchlista .= '"HD1": "'      . $HD1      . '", ';
        $Matchlista .= '"HD1color": "' . $HD1color . '", ';
        $Matchlista .= '"HD2": "'      . $HD2      . '", ';
        $Matchlista .= '"HD2color": "' . $HD2color . '", ';
        $Matchlista .= '"LD1": "'      . $LD1      . '", ';
        $Matchlista .= '"LD1color": "' . $LD1color . '", ';
        $Matchlista .= '"LD2": "'      . $LD2      . '", ';
        $Matchlista .= '"LD2color": "' . $LD2color . '", ';
        $Matchlista .= '"Dcoach": "'   . $Dcoach   . '", ';
        $Matchlista .= '"Arena": "'    . $Arena    . '"}';

    }

    $Matchlista         .= ']}';
    write_error("Matchlista=$Matchlista");

    return $Matchlista;

}

function rapportinfo($GameId, $DomarID){

    if ($DomarID == '') return 'white';

    $message_data = "SHL-ERROR vid coachmatcher.php function rapportinfo($GameId, $DomarID).";
    $Season       = $_SESSION['Season'];
    $JerseyNo     = $_SESSION['JerseyNo'];

    $SQL  = "CALL read_CoachRapporter($Season, $GameId, $DomarID)";
    write_error("SQL=$SQL");

    list($affected_rows,$result) = opendb($message_data,$SQL);

    $domarColor = 'black';
    if (!$result) return $domarColor; // color black indikerar på Error

    if ($affected_rows == 0){
        $domarColor  = 'white'; // Rapport ej skriven
    } else {
        $row   = $result->fetch_row();
        $Publicera = $row[1];
        if ($Publicera == 'J'){
            $domarColor  = 'DarkSeaGreen'; // Rapport publicerad
        } else {
            $domarColor  = 'Yellow'; // Rapport ej publicerad
        }
    }

    return $domarColor;

}

?>

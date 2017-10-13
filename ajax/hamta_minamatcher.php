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


$FromDate    = $_GET['FromDate'];
$ToDate      = $_GET['ToDate'];

$Season      = $_SESSION['Season'];
$JerseyNo    = $_SESSION['JerseyNo'];
$Domartyp    = $_SESSION['Domartyp'];

if ($Domartyp == 1){
    $SQL  = "CALL read_matcherHD($Season, $JerseyNo, '$FromDate', '$ToDate')";
    $svar = read_poster($SQL);
} else if ($Domartyp == 2){
    $SQL  = "CALL read_matcherLD($Season, $JerseyNo, '$FromDate', '$ToDate')";
    $svar = read_poster($SQL);
} else if ($Domartyp == 3){
    $SQL  = "CALL read_matcherCoach($Season, $JerseyNo, '$FromDate', '$ToDate')";
    $svar = read_colorposter($SQL);
}


echo $svar;





function read_poster($SQL){
    $message_data = "SHL-ERROR vid ajax/hamta_minamatcher.php function read_poster($SQL)";

	//Execute database-query

    list($affected_rows,$result) = opendb($message_data,$SQL);

    if (!$result) return '{"status": "Error"}';


    $Matchlista = '{"status": "OK", "Match": [';
    for ($i = 0; $i < $affected_rows; ++$i){
        $row = $result->fetch_array(MYSQLI_ASSOC);
        if ($i > 0){
            $Matchlista .=  ',';
        }
        $Matchlista     .=  json_encode($row);
    }
    $Matchlista         .= ']}';

    return $Matchlista;

}

function read_colorposter($SQL){
    $message_data = "SHL-ERROR vid ajax/hamta_minamatcher.php function read_colorposter($SQL)";

	//Execute database-query

    list($affected_rows,$result) = opendb($message_data,$SQL);

    if (!$result) return '{"status": "Error"}';


    $Matchlista = '{"status": "OK", "Match": [';
    for ($i = 0; $i < $affected_rows; ++$i){
        $row = $result->fetch_row();
        if ($i > 0){
            $Matchlista .=  ',';
        }

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

    return $Matchlista;

}

function rapportinfo($GameId, $DomarID){

    if ($DomarID == '') return 'white';

    $message_data = "SHL-ERROR vid coachmatcher.php function rapportinfo($GameId, $DomarID).";
    $Season       = $_SESSION['Season'];
    $JerseyNo     = $_SESSION['JerseyNo'];

    $SQL  = "CALL read_CoachRapporter($Season, $GameId, $DomarID)";

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

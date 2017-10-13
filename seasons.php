<?php

@session_start();

if (!isset($_SESSION['JerseyNo'])){
    header('Location: nosession.php');
    exit;
}

if ($_SESSION['Priviledge'] != 4){
    header('Location: unauthorized.php');
    exit;
}


header("Content-type: text/html; charset=utf-8");

date_default_timezone_set("Europe/Stockholm");


require_once("includes/config.php");
require_once("includes/opendb.php");
require_once("includes/io.php");

echo DOCTYPEN . '<title>Säsonger</title>' . RESTEN;

echo BODY;

echo FOTEN;
require_once("includes/parametrar.php");


require_once("includes/loginfo.php"); // Fixar inloggningsuppgifterna


echo '<script type="text/javascript">';
echo "var Seasonlista  = '';";
echo "Seasonlista      = JSON.parse( '" . read_seasons()   . "' );";

$MinDatum = $_SESSION['MinDatum'];
$MaxDatum = $_SESSION['MaxDatum'];
$SeasonDates = '{"status": "OK", "MinDatum": "' . $MinDatum . '", "MaxDatum": "' . $MaxDatum . '"}';
echo "SeasonDates  = $SeasonDates" . ';';

echo "</script>";

// Tillhörande JavaScript-filer
echo '<script type="text/javascript" src="javascript/common.js"></script>';
echo '<script type="text/javascript" src="javascript/seasons.js"></script>';


echo AVSLUT;



function read_seasons(){

    $message_data = "SHL-ERROR vid parameters.php function read_seasons.";

    $SQL  = "CALL read_seasons()";

    list($affected_rows,$result) = opendb($message_data,$SQL);

    if (!$result or $affected_rows == 0){
        return '{"status": "Error"}';
    }


    $Seasonlista = '{"status": "OK", "Season": [';
    for ($i = 0; $i < $affected_rows; ++$i){
        $row = $result->fetch_array(MYSQLI_ASSOC);
        if ($i > 0){
            $Seasonlista .=  ',';
        }
        $Seasonlista     .=  json_encode($row);
    }
    $Seasonlista         .= ']}';


    return $Seasonlista;

}

?>

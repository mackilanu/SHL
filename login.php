<?php

@session_start();


header("Content-type: text/html; charset=utf-8");

date_default_timezone_set("Europe/Stockholm");

require_once("includes/config.php");
require_once("includes/io.php");
require_once("includes/opendb.php");


echo DOCTYPEN . '<title>Logga in</title>' . RESTEN;

echo BODY;

echo FOTEN;

require_once("includes/parametrar.php");


echo '<script type="text/javascript">';
echo "var Season  = '';";
echo "Season      = JSON.parse( '" . readSeason()   . "' );";

echo "var SeasonDates  = '';";
echo "SeasonDates      = JSON.parse( '" . read_seasonDates($Season)   . "' );";
echo "</script>";

echo '<script type="text/javascript" src="javascript/md5.js"></script>';
echo '<script type="text/javascript" src="javascript/common.js"></script>';
echo '<script type="text/javascript" src="javascript/login.js"></script>';

echo AVSLUT;



function readSeason(){

    global $Season;
    $message_data = "SHL-ERROR vid login.php function readSeason.";

    $SQL  = "CALL read_LastSeason()";

    list($affected_rows,$result) = opendb($message_data,$SQL);

    if (!$result or $affected_rows == 0){
        unset($_SESSION['Season']);
        return '{"status": "Error"}';
    }


    $Seasonlista  = '{"status": "OK", "Season": ';
    $row          = $result->fetch_row();
    $Season       = $row[0];
    $Seasonlista .=  $Season;
    $Seasonlista .= '}';

    $_SESSION['Season']  = $Season;

    return $Seasonlista;

}

function read_seasonDates($Season){

    $message_data = "SHL-ERROR vid login.php function read_seasonDates.";

    $SQL  = "CALL read_SeasonsDates($Season)";

    list($affected_rows,$result) = opendb($message_data,$SQL);

    if (!$result or $affected_rows == 0){
        return '{"status": "Error"}';
    }



    $row = $result->fetch_row();

    $MinDatum = $row[0];
    $MaxDatum = $row[1];

    $_SESSION['MinDatum']      = $MinDatum;
    $_SESSION['MaxDatum']      = $MaxDatum;

    $Seasonlista  = '{"status": "OK", "MinDatum": "';
    $Seasonlista .= $MinDatum .'", "MaxDatum": "' . $MaxDatum . '"}';

    write_error("Seasonlista=$Seasonlista");

    return $Seasonlista;

}

?>

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
require_once("includes/io.php");
require_once("includes/opendb.php");

echo DOCTYPEN . '<title>Rapportfrågor </title>' . RESTEN;

echo BODY;

echo FOTEN;
require_once("includes/parametrar.php");


require_once("includes/loginfo.php"); // Fixar inloggningsuppgifterna


echo '<script type="text/javascript">';

echo "var Querylista  = '';";
echo "Querylista      = JSON.parse( '" . read_reportquerys()   . "' );";

echo "</script>";

// Tillhörande JavaScript-filer
echo '<script type="text/javascript" src="javascript/common.js"></script>';
echo '<script type="text/javascript" src="javascript/reportquerys.js"></script>';


echo AVSLUT;



function read_reportquerys(){

    $message_data = "SHL-ERROR vid reportquerys.php function read_reportquerys().";

    $Season       = $_SESSION['Season'];
    $SQL  = "CALL read_report_querys($Season)";

    list($affected_rows,$result) = opendb($message_data,$SQL);

    if (!$result) return '{"status": "Error"}';


    $Querylista = '{"status": "OK", "Query": [';
    for ($i = 0; $i < $affected_rows; ++$i){
        $row = $result->fetch_array(MYSQLI_ASSOC);
        if ($i > 0){
            $Querylista .=  ',';
        }
        $Querylista     .=  json_encode($row);
    }
    $Querylista         .= ']}';
    
    return $Querylista;

}


?>

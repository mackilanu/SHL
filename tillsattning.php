<?php

@session_start();

if (!isset($_SESSION['JerseyNo'])){
    header('Location: nosession.php');
    exit;
}

if ($_SESSION['Priviledge'] != 4 ){
    header('Location: unauthorized.php');
    exit;
}

header("Content-type: text/html; charset=utf-8");

date_default_timezone_set("Europe/Stockholm");


require_once("includes/config.php");
require_once("includes/io.php");
require_once("includes/opendb.php");

echo DOCTYPEN . '<title>Domartillsättning</title>' . RESTEN;

echo BODY;

echo FOTEN;
require_once("includes/parametrar.php");


// Fixar menyn
echo '<script type="text/javascript">';
echo "var Season = "  . $_SESSION['Season']   . ";";
echo 'var MinDatum =' . "'" . $_SESSION['MinDatum'] . "';";
echo "var MaxDatum =" . '"' . $_SESSION['MaxDatum'] . '";';
echo 'var tillsattningsfil = "'. TILLSATTNINGSFIL .'";';
echo "var Domarlista  = '';";
echo "Domarlista      = JSON.parse( '" . read_domare()   . "' );";
echo "</script>";

require_once("includes/loginfo.php"); // Fixar inloggningsuppgifterna


// Tillhörande JavaScript-filer
echo '<script type="text/javascript" src="javascript/common.js"></script>';
echo '<script type="text/javascript" src="javascript/tillsattning.js"></script>';


echo AVSLUT;



function read_domare(){

    $message_data = "SHL-ERROR vid tillsattning.php function read_domare().";

    $SQL  = "CALL read_Domare()";

    list($affected_rows,$result) = opendb($message_data,$SQL);


    //if (!$result or $affected_rows == 0){
    if (!$result){
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

?>

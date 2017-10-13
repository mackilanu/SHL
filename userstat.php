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


$JNO             = $_GET['JNO'];
$DomdaGrundspel  = $_GET['GI'];
$DomdaSlutspel   = $_GET['SI'];
$Fornamn         = $_GET['FN'];
$Efternamn       = $_GET['LN'];

require_once("includes/config.php");
require_once("includes/io.php");
require_once("includes/opendb.php");

echo DOCTYPEN . '<title>Domarstatistik</title>' . RESTEN;

echo BODY;

echo FOTEN;
require_once("includes/parametrar.php");


require_once("includes/loginfo.php"); // Fixar inloggningsuppgifterna

// Fixar menyn
echo '<script type="text/javascript">';
echo "var DomdaGrundspel = "  . $DomdaGrundspel . ';';
echo "var DomdaSlutspel  = "  . $DomdaSlutspel  . ';';
echo "var FirstName      = '" . $Fornamn        . "';";
echo "var LastName       = '" . $Efternamn      . "';";

echo "var Resultatlista  = '';";
echo "Resultatlista      = JSON.parse( '" . read_userstat($JNO)   . "' );";

echo "</script>";

// Tillhörande JavaScript-filer
echo '<script type="text/javascript" src="javascript/common.js"></script>';
echo '<script type="text/javascript" src="javascript/userstat.js"></script>';


echo AVSLUT;

function read_userstat($JNO){

    $message_data = "SHL-ERROR vid userstat.php function read_userstat($JNO).";

    // Börja med att läsa alla säsonger
    $SQL  = "CALL read_Seasons()";

    list($affected_rows,$result) = opendb($message_data,$SQL);
    if (!$result or $affected_rows == 0) return '{"status": "Error"}';


    // Fortsätter med statistiken
    $Resultatlista = '{"status": "OK", "Resultat": [';
    for ($i = 0; $i < $affected_rows; ++$i){

        if ($i > 0){
            $Resultatlista .=  ',';
        }

        $row    = $result->fetch_row();
        $Season = $row[0];

        $SQL  = "CALL read_grundspelcountSeason($Season,$JNO)";

        list($affected_rows2,$result2) = opendb($message_data,$SQL);
        if (!$result2) return '{"status": "Error"}';

        if ($affected_rows2 < 1){
            $Grundspelcount = 0;
        } else {
            $row            = $result2->fetch_row();
            $Grundspelcount = $row[0];
        }


        $SQL  = "CALL read_slutspelcountSeason($Season,$JNO)";

        list($affected_rows3,$result3) = opendb($message_data,$SQL);
        if (!$result3) return '{"status": "Error"}';

        if ($affected_rows3 < 1){
            $Slutspelcount = 0;
        } else {
            $row           = $result3->fetch_row();
            $Slutspelcount = $row[0];
        }

        $Resultatlista .= '{"Season": '        . $Season         . ', ';
        $Resultatlista .= '"Grundspelcount": ' . $Grundspelcount . ', ';
        $Resultatlista .= '"Slutspelcount": '  . $Slutspelcount  . '}';

    }

    $Resultatlista .= ']}';

    return $Resultatlista;

}
?>

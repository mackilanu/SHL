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


$season     = $_GET['season'];
$JerseyNo   = $_GET['JerseyNo'];
$Datum      = $_GET['Datum'];


echo setledighet($season,$JerseyNo,$Datum);





function setledighet($season,$JerseyNo,$Datum){
    $message_data = "SHL-ERROR vid ajax/set_ledighet.php function setledighet($season,$JerseyNo,$Datum)";

    // kontrollera om tillsättning finns.
    $SQL = "CALL get_tillsattning($season, '$Datum', $JerseyNo)";

    list($affected_rows,$result)  = opendb($message_data,$SQL);
    if (!$result) return '{"status": "Error"}';

    if ($affected_rows == 1){
        $row = $result->fetchrow();
        $HomeName = $row[0];
        $AwayName = $row[1];
        $svar  = '{"status": "Tillsatt", ';
        $svar .= '"HomeName": "' . $HomeName . '", ';
        $svar .= '"AwayName": "' . $AwayName . '"}';
        return $svar;
    }

    // Tillsättning saknas. Notering av ledighet ät tillåten.

    $RegistreratAv = $_SESSION['FirstName'] . ', ' . $_SESSION['LastName'];

    $SQL = "CALL insert_Ledighet($season,$JerseyNo, '$Datum', '$RegistreratAv')";

    list($affected_rows,$result)  = opendb($message_data,$SQL);
    if (!$result) return '{"status": "Error"}';

    return '{"status": "OK"}';
}

?>

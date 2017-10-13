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


$season   = $_GET['season'];
$datum    = $_GET['datum'];
$action   = $_GET['action'];
$JerseyNo = $_SESSION['JerseyNo'];


$svar = '';
if ($action == 'delete'){
    $svar =  radera_ledighet($season,$JerseyNo,$datum);
    } else if ($action == 'insert'){
    //$SQL =  "CALL delete_Ledighet($season, $JerseyNo, '$datum')";
    $svar = setledighet($season,$JerseyNo,$datum);
}

echo $svar;


function radera_ledighet($season,$JerseyNo,$datum){
    $message_data = "SHL-ERROR vid ajax/update_ledighet.php function radera_ledighet($season,$JerseyNo,$datum)";

    $SQL =  "CALL delete_Ledighet($season, $JerseyNo, '$datum')";

    list($affected_rows,$result)  = opendb($message_data,$SQL);
    if (!$result) return '{"status": "Error"}';

    return '{"status": "Deleted"}';

}


function setledighet($season,$JerseyNo,$datum){
    $message_data = "SHL-ERROR vid ajax/update_ledighet.php function setledighet($season,$JerseyNo,$datum)";

    // kontrollera om tillsättning finns.
    $Season   = $_SESSION['Season'];
    $JerseyNo = $_SESSION['JerseyNo'];
    $SQL      = "CALL get_tillsattning($Season, '$datum', $JerseyNo)";

    list($affected_rows,$result)  = opendb($message_data,$SQL);
    if (!$result) return '{"status": "Error"}';


    if ($affected_rows == 1){

        $row = $result->fetch_row();
        $HomeName = $row[0];
        $AwayName = $row[1];
        $svar  = '{"status": "Tillsatt", ';
        $svar .= '"HomeName": "' . $HomeName . '", ';
        $svar .= '"AwayName": "' . $AwayName . '"}';


        return $svar;
    }

    // Tillsättning saknas. Notering av ledighet ät tillåten.

    $RegistreratAv  = $_SESSION['FirstName'] . ', ' . $_SESSION['LastName'];
    $Registrerat    = new DateTime("now",new DateTimeZone('Europe/Stockholm'));
    $Registrerat    = $Registrerat->format("Y-m-d H:i:s");

    $SQL = "CALL insert_Ledighet($Season, $JerseyNo, '$datum', '$RegistreratAv')";


    list($affected_rows,$result)  = opendb($message_data,$SQL);
    if (!$result) return '{"status": "Error"}';

    $svar  = '{"status": "OK", ';
    $svar .= '"Registrerat": "'    . $Registrerat . '", ';
    $svar .= '"RegistreratAv": "'  . $RegistreratAv . '"}';

    return $svar;
}

?>

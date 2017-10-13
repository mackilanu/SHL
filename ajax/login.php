<?php

@session_start();


header("Content-type: text/html; charset=utf-8");

date_default_timezone_set("Europe/Stockholm");


require_once("../includes/config.php");
require_once("../includes/io.php");
require_once("../includes/opendb.php");
require_once("../includes/salta_pw.php");
require_once("../includes/epostsender.php");


$JerseyNo = $_GET['JerseyNo'];
$Pw       = $_GET['Pw'];

echo loggain($JerseyNo,$Pw);


// ================= Funktioner =================

function loggain($JerseyNo,$Pw){

    unset($_SESSION['JerseyNo']);
    unset($_SESSION['FirstName']);
    unset($_SESSION['LastName']);
    unset($_SESSION['Priviledge']);
    unset($_SESSION['Domartyp']);
    unset($_SESSION['databasens_Pw']);
    unset($_SESSION['TrafficID']);

    $message_data = "ERROR vid ajax/login.php function loggain($JerseyNo,$Pw)";

    $SQL   = "CALL read_Pw($JerseyNo)";

    list($affected_rows,$result)    = opendb($message_data,$SQL);

    if (!$result || $affected_rows == 0) return '{"status": "Error"}'; // Gäller för problem med databasen.


    $row           = $result -> fetch_row();

    $databasens_Pw = avsalta($row[0]); // Avsaltad med MD5 krypterat
    $FirstName     = $row[1];
    $LastName      = $row[2];
    $Priviledge    = $row[3];
    $Domartyp      = $row[4];

    $svar    = '{"status": "OK", ';


    if ($Pw == $databasens_Pw){
        $svar .= '"JerseyNo": '    . $JerseyNo    . ', ';
        $svar .= '"FirstName": "'  . $FirstName   . '", ';
        $svar .= '"LastName": "'   . $LastName    . '", ';
        $svar .= '"Priviledge": '  . $Priviledge  . ', ';
        $svar .= '"Domartyp": '    . $Domartyp    . '}';


        $YYYY   = date('Y');
        $Season = $YYYY;
        $MM     = date('m');
        if ($MM < 8){
            $Season = $YYYY - 1;
        }

        $_SESSION['JerseyNo']      = $JerseyNo;
        $_SESSION['FirstName']     = $FirstName;
        $_SESSION['LastName']      = $LastName;
        $_SESSION['Priviledge']    = $Priviledge;
        $_SESSION['Domartyp']      = $Domartyp;
        $_SESSION['databasens_Pw'] = $databasens_Pw;
        $_SESSION['TrafficID']     = -1;   // TrafficID för inloggningen


        // Registrera inloggningen
        $Tidpunkt  = new DateTime("now",new DateTimeZone('Europe/Stockholm'));
        $Tidpunkt  = $Tidpunkt->format("Y-m-d H:i:s");
        $SQL   = "CALL insert_UserTraffic($JerseyNo,'$Tidpunkt')";

        list($affected_rows2,$result2)    = opendb($message_data,$SQL);

        if (!$result2 or $affected_rows2 == 0){
            write_error("SHL-ERROR - ajax/login.php-->Registrering av userinloggning misslyckades för JerseyNo=$JerseyNo enligt SQL=$SQL");
        } else {
            $row = $result2->fetch_row();
            $TrafficID  = $row[0];

            $_SESSION['TrafficID']  = $TrafficID;
        }

    } else {
        $svar .= '"JerseyNo": "-1"}';
    }


    return $svar;
}





?>
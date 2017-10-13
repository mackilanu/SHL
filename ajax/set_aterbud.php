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
require_once("../includes/epostsender.php");


$season        = $_GET['season'];
$JerseyNo       = $_GET['JerseyNo'];
$GameId         = $_GET['GameId'];
$Datum          = $_GET['Datum'];
$Datum_2        = substr($Datum,0,10);


$Registrerat    =  new DateTime("now",new DateTimeZone('Europe/Stockholm'));
$Registrerat    = $Registrerat->format("Y-m-d H:i:s");
$Registrerat_Av = 'Återbud-' . $_SESSION['FirstName'] . ', ' . $_SESSION['LastName'];


$svar = '';

// Kör med transaktioner

$ErrorNr      = -1;

try {

	$mysqli       = new mysqli(DB_HOST, DB_USER, DB_PW, DB_NAME);

	//Open database
	if (mysqli_connect_errno()){
	    $message_data .= mysqli_connect_error();
	    send_dberror(TO, "SHL-ERROR vid ajax/set_aterbud.php ", $message_data);
	    $ErrorNr = '1';
	    throw new Exception($ErrorNr);
	}

	//Chance character set to utf8
	if (!$mysqli->set_charset("utf8")){ // Chance character set to utf8
	    $message_data .= $mysqli->error;
	    send_dberror(TO, "SHL-ERROR vid ajax/set_aterbud.php ", $message_data);
	    $ErrorNr = '2';
	    throw new Exception($ErrorNr);
	}



	$mysqli -> autocommit(FALSE); // i.e., start transaction


    // Registrera en frånvaropost i tabellen Ledigheter
	$SQL   = "CALL insert_Ledighet($season, $JerseyNo, '$Datum_2', '$Registrerat_Av')";
	$message_data  = "SHL-ERROR vid ajax/set_aterbud.php SQL=$SQL";

	list($affected_rows,$result)  = opendb($message_data,$SQL);
	if (!$result){
	    send_dberror(TO, "SHL-ERROR vid ajax/set_aterbud.php ", $message_data);
	    $ErrorNr = '-1';
	    throw new Exception($ErrorNr);
	}

    clearStoredResults($mysqli);

    // Registrera en post i tabellen Aterbud
	$SQL   = "CALL insert_aterbud($season, $JerseyNo, $GameId, '$Registrerat', '$Registrerat_Av')";
	$message_data  = "SHL-ERROR vid ajax/set_aterbud.php SQL=$SQL";

	list($affected_rows,$result)  = opendb($message_data,$SQL);
	if (!$result){
	    send_dberror(TO, "SHL-ERROR vid ajax/set_aterbud.php ", $message_data);
	    $ErrorNr = '-2';
	    throw new Exception($ErrorNr);
	}

    clearStoredResults($mysqli);

    // Ta reda på matchens domare
    $SQL   = "CALL read_MatchensDomare($season, $GameId)";
    $message_data  = "SHL-ERROR vid ajax/set_aterbud.php SQL=$SQL";

    $affected_rows = 0;
    list($affected_rows,$result)  = opendb($message_data,$SQL);
    if (!$result){
        send_dberror(TO, "SHL-ERROR vid ajax/set_aterbud.php ", $message_data);
        $ErrorNr = '-3';
        throw new Exception($ErrorNr);
    }

    if ($affected_rows == 0){
        $message_data .= '. Matchen SAKNAS i tabellen Matcher!';
        send_dberror(TO, "SHL-ERROR vid ajax/set_aterbud.php ", $message_data);
        $ErrorNr = '-4';
        throw new Exception($ErrorNr);
    }


    $row     =  $result->fetch_row();
    $HD1     =  $row[0];
    $HD2     =  $row[1];
    $LD1     =  $row[2];
    $LD2     =  $row[3];
    $Dcoach  =  $row[4];


    // Gör relevantfält av HD1, HD2, LD1, LD2 i tabellen Matcher till negativ värde genom att multiplicera med -1


    clearStoredResults($mysqli);

    $SQL = "CALL negera_";
    if ($HD1 == $JerseyNo){
        $SQL .= 'HD1';
    } else if ($HD2 == $JerseyNo){
        $SQL .= 'HD2';
    } else if ($LD1 == $JerseyNo){
        $SQL .= 'LD1';
    } else if ($LD2 == $JerseyNo){
        $SQL .= 'LD2';
    }
    $SQL .= "($season, $GameId)";
	$message_data  = "SHL-ERROR vid ajax/set_aterbud.php SQL=$SQL";

    //Execute database-query
    $affected_rows = 0;
	list($affected_rows,$result)  = opendb($message_data,$SQL);
    if (!$result){
        $ErrorNr = '-5';
        $msg     = "ErrorNr = -5 -" .  $SQL . " - " . $mysqli->error;
        send_dberror(TO, "SHL-ERROR vid ajax/set_aterbud.php ", $msg);
        throw new Exception($ErrorNr);
    }

    clearStoredResults($mysqli);

    /*



    // Ta reda på domarnas namnn och E-postadresser
    $SQL = "CALL read_userEpost($HD1)";
	$message_data  = "SHL-ERROR vid ajax/set_aterbud.php SQL=$SQL";

	list($affected_rows,$result)  = opendb($message_data,$SQL);
    if (!$result = $mysqli->query($SQL)){
        $ErrorNr = '-6';
        $msg     = "ErrorNr = -6 -" .  $SQL . " - " . $mysqli->error;
        send_dberror(TO, "SHL-ERROR vid ajax/set_aterbud.php ", $msg);
        throw new Exception($ErrorNr);
    }
        
    $row            =  $result->fetch_row();
    $HD1_aktiv      =  $row[0];
    $HD1_FirstName  =  $row[1];
    $HD1_LastName   =  $row[2];
    $HD1_Domartyp   =  $row[3];
    $HD1_Email      =  $row[4];


    clearStoredResults($mysqli);
    
    $SQL = "CALL read_userEpost($HD2)";
	$message_data  = "SHL-ERROR vid ajax/set_aterbud.php SQL=$SQL";

	list($affected_rows,$result)  = opendb($message_data,$SQL);
    if (!$result = $mysqli->query($SQL)){
        $ErrorNr = '-7';
        $msg     = "ErrorNr = -7 -" .  $SQL . " - " . $mysqli->error;
        send_dberror(TO, "SHL-ERROR vid ajax/set_aterbud.php ", $msg);
        throw new Exception($ErrorNr);
    }
        
    $row            =  $result->fetch_row();
    $HD2_aktiv      =  $row[0];
    $HD2_FirstName  =  $row[1];
    $HD2_LastName   =  $row[2];
    $HD2_Domartyp   =  $row[3];
    $HD2_Email      =  $row[4];

   
    clearStoredResults($mysqli);

    $SQL = "CALL read_userEpost($LD1)";
	$message_data  = "SHL-ERROR vid ajax/set_aterbud.php SQL=$SQL";

	list($affected_rows,$result)  = opendb($message_data,$SQL);
    if (!$result = $mysqli->query($SQL)){
        $ErrorNr = '-8';
        $msg     = "ErrorNr = -8 -" .  $SQL . " - " . $mysqli->error;
        send_dberror(TO, "SHL-ERROR vid ajax/set_aterbud.php ", $msg);
        throw new Exception($ErrorNr);
    }
        
    $row            =  $result->fetch_row();
    $LD1_aktiv      =  $row[0];
    $LD1_FirstName  =  $row[1];
    $LD1_LastName   =  $row[2];
    $LD1_Domartyp   =  $row[3];
    $LD1_Email      =  $row[4];


    clearStoredResults($mysqli);
    
    $SQL = "CALL read_userEpost($LD2)";
	$message_data  = "SHL-ERROR vid ajax/set_aterbud.php SQL=$SQL";

	list($affected_rows,$result)  = opendb($message_data,$SQL);
    if (!$result = $mysqli->query($SQL)){
        $ErrorNr = '-9';
        $msg     = "ErrorNr = -9 -" .  $SQL . " - " . $mysqli->error;
        send_dberror(TO, "SHL-ERROR vid ajax/set_aterbud.php ", $msg);
        throw new Exception($ErrorNr);
    }
        
    $row            =  $result->fetch_row();
    $LD2_aktiv      =  $row[0];
    $LD2_FirstName  =  $row[1];
    $LD2_LastName   =  $row[2];
    $LD2_Domartyp   =  $row[3];
    $LD2_Email      =  $row[4];


    if ($Dcoach != null){

        clearStoredResults($mysqli);

        $SQL = "CALL read_userEpost($Dcoach)";
        $message_data  = "SHL-ERROR vid ajax/set_aterbud.php SQL=$SQL";

        list($affected_rows,$result)  = opendb($message_data,$SQL);
        if (!$result = $mysqli->query($SQL)){
            $ErrorNr = '-10';
            $msg     = "ErrorNr = -10 -" .  $SQL . " - " . $mysqli->error;
            send_dberror(TO, "SHL-ERROR vid ajax/set_aterbud.php ", $msg);
            throw new Exception($ErrorNr);
        }
        
        $row            =  $result->fetch_row();
        $Dcoach_aktiv      =  $row[0];
        $Dcoach_FirstName  =  $row[1];
        $Dcoach_LastName   =  $row[2];
        $Dcoach_Domartyp   =  $row[3];
        $Dcoach_Email      =  $row[4];
    }

    clearStoredResults($mysqli);

    // Hämta information om matchen
    $SQL = "CALL read_Matchinfo($Season, $GameId)";
    $message_data  = "SHL-ERROR vid ajax/set_aterbud.php SQL=$SQL";

    list($affected_rows,$result)  = opendb($message_data,$SQL);
    if (!$result = $mysqli->query($SQL)){
        $ErrorNr = '-11';
        $msg     = "ErrorNr = -11 -" .  $SQL . " - " . $mysqli->error;
        send_dberror(TO, "SHL-ERROR vid ajax/set_aterbud.php ", $msg);
        throw new Exception($ErrorNr);
    }
        
    $row       =  $result->fetch_row();
    $Datum     =  $row[0];
    $HomeCode  =  $row[1];
    $HomeName  =  $row[2];
    $AwayCode  =  $row[3];
    $AwayName  =  $row[4];
    $Arena     =  $row[5];
    $GameType  =  $row[6];
    $Level     =  $row[7];
    
    // Skicka e-post till övriga domare, och ev. domarcoach, i denna match


    $body  = '<!DOCTYPE html>
  <html lang="sv" class="">
  <head>
  <meta charset="utf-8" />
  </head>
  <body>';

    $body .= '<h1 style="background: #ffa500; font-size:25pt;"><strong>Tillsättningsprogrammet</strong></h1>';
    $body .= '<h2>Meddelande om återbud</h2>';
    $body .= '<br>';
    $body .= 'Till:';
    $body .= '<br>' . $HD1_FirstName    . ', ' . $HD1_LastName;
    $body .= '<br>' . $HD2_FirstName    . ', ' . $HD2_LastName;
    $body .= '<br>' . $LD1_FirstName    . ', ' . $LD1_LastName;
    $body .= '<br>' . $LD2_FirstName    . ', ' . $LD2_LastName;

    if ($Dcoach != null){
        $body .= '<br>' . $Dcoach_FirstName . ', ' . $Dcoach_LastName;
    }
    $body .= '<br><br>';
    

    if ($HD1 == $JerseyNo){
        $FirstName = $HD1_FirstName;
        $LastName  = $HD1_LastName;
    } else if ($HD2 == $JerseyNo){
        $FirstName = $HD2_FirstName;
        $LastName  = $HD2_LastName;
    } else if ($LD1 == $JerseyNo){
        $FirstName = $LD1_FirstName;
        $LastName  = $LD1_LastName;
    } else if ($LD2 == $JerseyNo){
        $FirstName = $LD2_FirstName;
        $LastName  = $LD2_LastName;
    }

    $body .= '<p>Härmed meddelas att : <strong>' . $FirstName . ', ' . $LastName . '</strong>';
    $body .= ' lämnat återbud till följande: ';
    $body .= '<br><br>';
    $body .= 'Match: <strong>'    . $HomeName . ' - ' . $AwayName . '</strong>';
    $body .= '<br>Datum: <strong>'    . $Datum    . '</strong>';
    $body .= '<br>Arena: <strong>'    . $Arena    . '</strong>';
    $body .= '<br>GameType: <strong>' . $GameType . '</strong>';
    $body .= '<br>Level: <strong>'    . $Level    . '</strong>';
    
    $body .= '<br><br><br>Med vänliga hälsningar';
    $body .= '<br>Tillsättningsprogrammet';
    $body .= '<br>';
    $body .= '</body></html>';

    
    $transaktionresult = '';

    $mottagare = $HD1_Email . ',' . $HD2_Email . ',' . $LD1_Email . ',' . $LD2_Email;
    if ($Dcoach != null){
        $mottagare .= ',' . $Dcoach_Email;
    }
    
    if (send_epost($mottagare,"Tillsättningsprogrammet-återbud",$body)){
        $transaktionresult = '{"status": "OK", "sendEpost": "yes"}';
    } else {
        $transaktionresult = '{"status": "OK", "sendEpost": "no"}';
    }
    */

    $mysqli->commit();
    $mysqli->autocommit(TRUE); // i.e., end transaction

    $transaktionresult = '{"status": "OK"}';

}


catch ( Exception $e ) {
	// before rolling back the transaction, you'd want
	// to make sure that the exception was db-related

	$mysqli->rollback();
	$mysqli->autocommit(TRUE); // i.e., end transaction

	if ($svar == ''){
	    $transaktionresult = '{"status": "Error", "Errnumber": "' . $e->getMessage() . '"}';
	    send_dberror(TO, "SHL-ERROR vid ajax/set_aterbud.php ", $transaktionresult);
	} else {
	    $transaktionresult = $svar;
	}
}


echo $transaktionresult;


?>

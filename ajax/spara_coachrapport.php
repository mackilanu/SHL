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



$GameId     = $_GET['GameId'];
$DomarID    = $_GET['DomarID'];
$Betyg      = $_GET['Betyg'];
$Publicera  = $_GET['Publicera'];
$Answer     = $_GET['Answer'];



// Börjar transaktionen

$ErrorNr           = -1;
$transaktionresult = '{"status": "Error"}';


try {

	$mysqli       = new mysqli(DB_HOST, DB_USER, DB_PW, DB_NAME);

	//Open database
	if (mysqli_connect_errno()){
	    $message_data .= mysqli_connect_error();
	    send_dberror(TO, "SHL-ERROR vid ajax/spara_coachrapport.php ", $message_data);
	    $ErrorNr = '1';
	    throw new Exception($ErrorNr);
	}

	//Chance character set to utf8
	if (!$mysqli->set_charset("utf8")){ // Chance character set to utf8
	    $message_data .= $mysqli->error;
	    send_dberror(TO, "SHL-ERROR vid ajax/spara_coachrapport.php ", $message_data);
	    $ErrorNr = '2';
	    throw new Exception($ErrorNr);
	}


    $Season = $_SESSION['Season'];
	$SQL = "CALL insert_CoachRapporter($Season, $GameId, $DomarID, ";
	if ($Betyg == ''){
	    $SQL .= 'NULL,';
	} else {
	    $SQL .= "$Betyg,";
	}


	if ($Publicera == ''){
	    $SQL .= 'NULL)';
	} else {
	    $SQL .= "'$Publicera')";
	}




	//Execute database-query
	$affected_rows = 0;
	if (!$result = $mysqli->query($SQL)){
	    $ErrorNr = '3';
	    $msg     = "ErrorNr = 3 -" .  $SQL . " - " . $mysqli->error;
	    send_dberror(TO, "SHL-ERROR vid ajax/spara_coachrapport.php ", $msg);
	    throw new Exception($ErrorNr);
	}


    for ($i = 0; $i < sizeof($Answer); $i++){

        $Svaret  = $Answer[$i]['Answer'];
        $QueryID = $Answer[$i]['QueryID'];

        $SQL = "CALL insert_CoachRapport($Season, $GameId, $DomarID, $QueryID, '$Svaret')";


        clearStoredResults($mysqli);

        //Execute database-query
        $affected_rows = 0;
        if (!$result = $mysqli->query($SQL)){
            $ErrorNr = '6';
            $msg     = "ErrorNr = 6 - " .  $SQL . " - " . $mysqli->error;
            send_dberror(TO, "SHL-ERROR vid ajax/spara_coachrapport.php ", $msg);
            throw new Exception($ErrorNr);
        }
    }

    $transaktionresult = '{"status": "OK"}';

	$mysqli->commit();
	$mysqli->autocommit(TRUE); // i.e., end transaction


}


catch ( Exception $e ) {
	// before rolling back the transaction, you'd want
	// to make sure that the exception was db-related

	$mysqli->rollback();
	$mysqli->autocommit(TRUE); // i.e., end transaction

    $transaktionresult = '{"status": "Error", "Errnumber": "' . $e->getMessage() . '"}';
    send_dberror(TO, "SHL-ERROR vid ajax/spara_coachrapport.php ", $transaktionresult);

    $transaktionresult = '{"status": "Error"}';

}

echo $transaktionresult;


?>

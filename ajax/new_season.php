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


$Season   = $_GET['Season'];


$svar = '';


// Börjar transaktionen

$ErrorNr      = -1;

try {
    // Läs in i en array alla JerseyNo

    $message_data = "SHL-ERROR vid ajax/new_season.php.";

    $SQL  = "CALL read_JerseyNumbers()";

    list($affected_rows,$result) = opendb($message_data,$SQL);

    if (!$result or $affected_rows == 0){
	    $svar  = '{"status": "Error"}';
	    $ErrorNr = '-3';
	    throw new Exception($ErrorNr);
    }


    $Userslista = [];
    for ($i = 0; $i < $affected_rows; ++$i){
        $row = $result->fetch_row();
        $Userslista[$i] = $row[0];
    }


	$mysqli       = new mysqli(DB_HOST, DB_USER, DB_PW, DB_NAME);

	//Open database
	if (mysqli_connect_errno()){
	    $message_data .= mysqli_connect_error();
	    send_dberror(TO, "SHL-ERROR vid ajax/new_season.php ", $message_data);
	    $ErrorNr = '1';
	    throw new Exception($ErrorNr);
	}

	//Chance character set to utf8
	if (!$mysqli->set_charset("utf8")){ // Chance character set to utf8
	    $message_data .= $mysqli->error;
	    send_dberror(TO, "SHL-ERROR vid ajax/new_season.php ", $message_data);
	    $ErrorNr = '2';
	    throw new Exception($ErrorNr);
	}


	// Radera alla ledigheter och skapa nya med NULL-värde
	$SQL   = "CALL delete_Ledigheter()";

	$message_data  = "SHL-ERROR vid ajax/new_season.php SQL=$SQL";

	$affected_rows = 0;
	list($affected_rows,$result)  = opendb($message_data,$SQL);
	if (!$result){
	    send_dberror(TO, "SHL-ERROR vid ajax/new_season.php ", $message_data);
	    $ErrorNr = '-1';
	    throw new Exception($ErrorNr);
	}



    // Ledigheter
    $YYYY = date('Y');
    $MM   = date('m');

    $days[0] = 0;
    $days[1] = 31;
    $days[2] = 0;
    $days[3] = 31;
    $days[4] = 30;
    $days[5] = 31;
    $days[6] = 30;
    $days[7] = 31;
    $days[8] = 31;
    $days[9] = 30;
    $days[10] = 31;
    $days[11] = 30;
    $days[12] = 31;


    // Skapa tomma Ledigheter för aug. - dec
    for ($i = 8; $i < 13; ++$i){
        $YYYY = $Season;

        $m = $i;
        if ($m < 10){
            $m = '0' . $m;
        }

        for ($j = 1; $j < $days[$i] + 1; ++$j){
            $dd = $j;
            if ($dd < 10){
                $dd = '0' . $dd;
            }

            $Datum = $YYYY . '-' . $m . '-' . $dd;

            foreach($Userslista as $JerseyNo) {

                $SQL = "CALL insert_Ledighet($JerseyNo, '$Datum', NULL, NULL)";

                clearStoredResults($mysqli);

                //Execute database-query
                $affected_rows = 0;
                if (!$result = $mysqli->query($SQL)){
                    $ErrorNr = '6';
                    $msg     = "ErrorNr = 6 - " .  $SQL . " - " . $mysqli->error;
                    send_dberror(TO, "SHL-ERROR vid ajax/new_season.php ", $msg);
                    throw new Exception($ErrorNr);
                } else {
                    $affected_rows      = $mysqli->affected_rows;
                    if ($affected_rows == 0){ // Gäller för problem med dubblerade nycklar.
                        $ErrorNr          = '7';
                        $msg     = 'ErrorNr = 7 - ' . $SQL;
                        send_dberror(TO, "SHL-ERROR vid ajax/new_season.php ", $msg);
                        throw new Exception($ErrorNr);
                    }
                }
            }
        }

    }



    // Skapa tomma Ledigheter för jan. - juli
    for ($i = 1; $i < 8; ++$i){
        $YYYY = $Season + 1;

        if ((($YYYY % 4) == 0) && ((($YYYY % 100) != 0) || (($YYYY %400) == 0))){
            $days[2] = 29;
        } else {
            $days[2] = 28;
        }


        $m = $i;
        if ($m < 10){
            $m = '0' . $m;
        }

        for ($j = 1; $j < $days[$i] + 1; ++$j){
            $dd = $j;
            if ($dd < 10){
                $dd = '0' . $dd;
            }

            $Datum = $YYYY . '-' . $m . '-' . $dd;

            foreach($Userslista as $JerseyNo) {

                $SQL = "CALL insert_Ledighet($JerseyNo, '$Datum', NULL, NULL)";

                clearStoredResults($mysqli);

                //Execute database-query
                $affected_rows = 0;
                if (!$result = $mysqli->query($SQL)){
                    $ErrorNr = '8';
                    $msg     = "ErrorNr = 8 - " .  $SQL . " - " . $mysqli->error;
                    send_dberror(TO, "SHL-ERROR vid ajax/new_season.php ", $msg);
                    throw new Exception($ErrorNr);
                } else {
                    $affected_rows      = $mysqli->affected_rows;
                    if ($affected_rows == 0){ // Gäller för problem med dubblerade nycklar.
                        $ErrorNr          = '9';
                        $msg     = 'ErrorNr = 9 - ' . $SQL;
                        send_dberror(TO, "SHL-ERROR vid ajax/new_season.php ", $msg);
                        throw new Exception($ErrorNr);
                    }
                }
            }
        }

    }


    // Add the new Season
    $LastDate = $Season . '-08-01';
	$SQL = "CALL insert_Season('$Season','$LastDate')";


    clearStoredResults($mysqli);


	//Execute database-query
	$affected_rows = 0;
	if (!$result = $mysqli->query($SQL)){
	    $ErrorNr = '10';
	    $msg     = "ErrorNr = 10 -" .  $SQL . " - " . $mysqli->error;
	    send_dberror(TO, "SHL-ERROR vid ajax/new_season.php ", $msg);
	    throw new Exception($ErrorNr);
	} else {
        write_error("Insert season KLART.");

        $_SESSION['Season'] = $Season;

        /*
	    $affected_rows      = $mysqli->affected_rows;
	    if ($affected_rows == 0){ // Gäller för problem dubblerade nycklar.
            $ErrorNr          = '11';
            $msg     = "ErrorNr = 11" . $SQL . " - " . $mysqli->error;
            send_dberror(TO, "SHL-ERROR vid ajax/new_season.php ", $msg);
            throw new Exception($ErrorNr);
	    }
        */
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

    if ($svar == ''){
        $transaktionresult = '{"status": "Error", "Errnumber": "' . $e->getMessage() . '"}';
        send_dberror(TO, "SHL-ERROR vid ajax/new_season.php ", $transaktionresult);
	} else {
	    $transaktionresult = $svar;
	}

}

write_error("transaktionresult=$transaktionresult");
echo $transaktionresult;

?>

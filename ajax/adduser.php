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
require_once("../includes/salta_pw.php");
require_once("../includes/epostsender.php");


$JerseyNo   = $_GET['JerseyNo'];
$Domartyp   = $_GET['Domartyp'];
$Active     = $_GET['Active'];
$FirstName  = $_GET['FirstName'];
$LastName   = $_GET['LastName'];
$Priviledge = $_GET['Priviledge'];
$Email      = $_GET['Email'];
$Mobil      = $_GET['Mobil'];
$Personnr   = $_GET['Personnr'];
$Grundspel  = $_GET['Grundspel'];
$Slutspel   = $_GET['Slutspel'];



$svar = '';

// Börjar transaktionen

$ErrorNr      = -1;

try {

	$mysqli       = new mysqli(DB_HOST, DB_USER, DB_PW, DB_NAME);

	//Open database
	if (mysqli_connect_errno()){
	    $message_data .= mysqli_connect_error();
	    send_dberror(TO, "SHL-ERROR vid ajax/adduser.php ", $message_data);
	    $ErrorNr = '1';
	    throw new Exception($ErrorNr);
	}

	//Chance character set to utf8
	if (!$mysqli->set_charset("utf8")){ // Chance character set to utf8
	    $message_data .= $mysqli->error;
	    send_dberror(TO, "SHL-ERROR vid ajax/adduser.php ", $message_data);
	    $ErrorNr = '2';
	    throw new Exception($ErrorNr);
	}


	// Kontrollera om Epost redan finns
	$SQL   = "CALL read_EmailCount('$Email')";

	$message_data  = "SHL-ERROR vid ajax/adduser.php SQL=$SQL";

	$affected_rows = 0;
	list($affected_rows,$result)  = opendb($message_data,$SQL);
	if (!$result){
	    send_dberror(TO, "SHL-ERROR vid ajax/adduser.php ", $message_data);
	    $ErrorNr = '-1';
	    throw new Exception($ErrorNr);
	}

	if ($affected_rows > 0){
	    $row      =  $result->fetch_row();
	    $TrojaNr  =  $row[0];
	    $Fnamn    =  $row[1];
	    $Enamn    =  $row[2];
        $Dtyp     =  $row[3];

	    $svar  = '{"status": "EpostFinns", "TrojaNr": ' . $TrojaNr . ', "Fnamn": "' . $Fnamn . '", "Enamn": "' . $Enamn . '", "Domartyp": ' . $Dtyp . '}';
	    $ErrorNr = '-2';
	    throw new Exception($ErrorNr);
	}

	// Om Personnr är 12 tkn kontrollera om den redan finns
	if (strlen($Personnr) == 12){
	    $SQL   = "CALL read_PnrCount('$Personnr')";

        $message_data  = "SHL-ERROR vid ajax/adduser.php SQL=$SQL";

	    $affected_rows = 0;
	    list($affected_rows,$result)  = opendb($message_data,$SQL);
	    if (!$result){
            send_dberror(TO, "SHL-ERROR vid ajax/adduser.php ", $message_data);
            $ErrorNr = '-3';
            throw new Exception($ErrorNr);
	    }

	    if ($affected_rows > 0){
            $row      =  $result->fetch_row();
            $TrojaNr  =  $row[0];
            $Fnamn    =  $row[1];
            $Enamn    =  $row[2];
            $Dtyp     =  $row[3];

            $svar  = '{"status": "PnrFinns", "TrojaNr": ' . $TrojaNr . ', "Fnamn": "' . $Fnamn . '", "Enamn": "' . $Enamn . '", "Domartyp": ' . $Dtyp . '}';
            $ErrorNr = '-4';
            throw new Exception($ErrorNr);
	    }
	}


	// E-post finns inte. Inte heller samma 12-siffriga personnr.
	// Registrering av user kan ske.


	$mysqli -> autocommit(FALSE); // i.e., start transaction


	// Sparar user
	//Generera ny krypterat pw
    $chars  = 'qazxswed_cvfrtgbnhy!ujmkiolp0192837465PLOIKMJUYHNBGTRFVCDEWSXZAQ';
    $str    = "";
    $size   = strlen( $chars );
    for( $i = 0; $i < 8; $i++ ) {
        $str .= $chars[ rand( 0, $size - 1 ) ];
    }
    $newpw         = $str;

    $krypterat_Pw  = md5($newpw);
    $db_user_Pw    = saltaPw($krypterat_Pw);



	$SQL = "CALL insert_User($JerseyNo,";

	if ($Active == ''){
	    $SQL .= 'NULL,';
	} else {
	    $SQL .= "'$Active'" . ',';
	}

    $SQL .= "'$FirstName','$LastName',$Priviledge,'$db_user_Pw','$Email',";

	if ($Mobil == ''){
	    $SQL .= 'NULL,';
	} else {
	    $SQL .= "'$Mobil'" . ',';
	}

    $SQL .= "$Domartyp,";

	if ($Personnr == ''){
	    $SQL .= 'NULL,';
	} else {
	    $SQL .= "'$Personnr'" . ',';
	}

	if ($DomdaGrundspel == ''){
	    $SQL .= 'NULL,';
	} else {
	    $SQL .= "'$DomdaGrundspel'" . ',';
	}

	if ($DomdaSlutspel == ''){
	    $SQL .= 'NULL,';
	} else {
	    $SQL .= "'$DomdaSlutspel'" . ',';
	}

    $Registred_by    = $_SESSION['FirstName'] . ', ' . $_SESSION['LastName'];
    $Updated_by      = $Registred_by;
    $Registred_date  = new DateTime("now",new DateTimeZone('Europe/Stockholm'));
    $Registred_date  = $Registred_date->format("Y-m-d H:i:s");

	$SQL .= "'$Registred_by'" . ',';
	$SQL .= "'$Registred_date'" . ',';
	$SQL .= "'$Updated_by'"  . ')';



	//Execute database-query
	$affected_rows = 0;
	if (!$result = $mysqli->query($SQL)){
	    $ErrorNr = '3';
	    $msg     = "ErrorNr = 3 -" .  $SQL . " - " . $mysqli->error;
	    send_dberror(TO, "SHL-ERROR vid ajax/adduser.php ", $msg);
	    throw new Exception($ErrorNr);
	} else {
	    $affected_rows      = $mysqli->affected_rows;
	    if ($affected_rows == 0){ // Gäller för problem dubblerade nycklar.
            $ErrorNr          = '4';
            $msg     = "ErrorNr = 4" . $SQL . " - " . $mysqli->error;
            send_dberror(TO, "SHL-ERROR vid ajax/adduser.php ", $msg);
            throw new Exception($ErrorNr);
	    }
	}

    /*
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

    $FirstTime = true;
    
    for ($i = 1; $i < 13; ++$i){

        
        if ($MM < 8 and $i > 7){
            if ($FirstTime){
                $YYYY -= 1;
                $FirstTime = false;
            }
        } else if ($MM > 7 and $i < 8){
            if ($FirstTime){
                $YYYY += 1;
                $FirstTime = false;
            }
        }



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
            $SQL = "CALL insert_Ledighet($JerseyNo, '$Datum', NULL, NULL)";

            clearStoredResults($mysqli);

            //Execute database-query
            $affected_rows = 0;
            if (!$result = $mysqli->query($SQL)){
                $ErrorNr = '6';
                $msg     = "ErrorNr = 6 - " .  $SQL . " - " . $mysqli->error;
                send_dberror(TO, "SHL-ERROR vid ajax/adduser.php ", $msg);
                throw new Exception($ErrorNr);
            } else {
                $affected_rows      = $mysqli->affected_rows;
                if ($affected_rows == 0){ // Gäller för problem med dubblerade nycklar.
                    $ErrorNr          = '7';
                    $msg     = 'ErrorNr = 7 - ' . $SQL;
                    send_dberror(TO, "SHL-ERROR vid ajax/adduser.php ", $msg);
                    throw new Exception($ErrorNr);
                }
            }
        }
        
    }
    */

    $body  = '<!DOCTYPE html>
  <html lang="sv" class="">
  <head>
  <meta charset="utf-8" />
  </head>
  <body>';

    $body .= '<h1 style="background: #ffa500; font-size:25pt;"><strong>Refmanagment</strong></h1>';
    $body .= '<h2>Välkommen ' . $FirstName . ', ' . $LastName . ' som användare av refmanagment.</h2>';
    $body .= '<p>Ditt lösenord är: <strong>' . $newpw . '</strong>';
    $body .= '<br><br>Du kan när som helst ändra ditt lösenord när du är inloggad.';
    $body .= '<br><br>Med vänliga hälsningar';
    $body .= '<br>refmanagment';
    $body .= '<br>';
    $body .= '</body></html>';


	$transaktionresult = '';

    if (send_epost($Email,"Välkommen till refmanagment",$body)){
	    $transaktionresult = '{"status": "OK", "sendPw": "yes"}';
	} else {
	    $transaktionresult = '{"status": "OK", "sendPw": "no"}';
	}


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
	    send_dberror(TO, "SHL-ERROR vid ajax/adduser.php ", $transaktionresult);
	} else {
	    $transaktionresult = $svar;
	}
}


echo $transaktionresult;

?>

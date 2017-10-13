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



$GameId    = $_GET['GameId'];
$Datum     = $_GET['Datum'];
$HomeCode  = $_GET['HomeCode'];
$AwayCode  = $_GET['AwayCode'];
$domartyp  = $_GET['domartyp'];

$svar           = '';
$Domare         = [];
$UpptagnaDomare = [];
$LedigaDomare   = [];
$LedigaDomare_2 = [];

// Börjar transaktionen

$ErrorNr      = -1;

try {

	$mysqli       = new mysqli(DB_HOST, DB_USER, DB_PW, DB_NAME);

	//Open database
	if (mysqli_connect_errno()){
	    $message_data .= mysqli_connect_error();
	    send_dberror(TO, "SHL-ERROR vid ajax/hamta_domare.php ", $message_data);
	    $ErrorNr = '1';
	    throw new Exception($ErrorNr);
	}

	//Chance character set to utf8
	if (!$mysqli->set_charset("utf8")){ // Chance character set to utf8
	    $message_data .= $mysqli->error;
	    send_dberror(TO, "SHL-ERROR vid ajax/hamta_domare.php ", $message_data);
	    $ErrorNr = '2';
	    throw new Exception($ErrorNr);
	}



    $mysqli -> autocommit(FALSE); // i.e., start transaction



    // Läs alla domare som är aktiva och har rätt domartyp
    $SQL  = "CALL read_Domare2($domartyp)";
	$affected_rows = 0;
    $result = $mysqli->query($SQL);
	if (!$result){
	    send_dberror(TO, "SHL-ERROR vid ajax/hamta_domare.php ", $message_data);
	    $ErrorNr = '3';
	    throw new Exception($ErrorNr);
	}
    $affected_rows = $mysqli->affected_rows;

	$message_data  = "SHL-ERROR vid ajax/hamta_domare.php SQL=$SQL";
    list($affected_rows,$result) = opendb($message_data,$SQL);

    // och placera dem i array Domare
    $Domare         = [];
    for ($i = 0; $i < $affected_rows; ++$i){
        $row = $result->fetch_row();
        $Domare[$i] = $row[0];
    }

    clearStoredResults($mysqli);

    // Läs domare från tabellen Ledigheter, dvs är säsongsbaserat
    $Season       = $_SESSION['Season'];
    $SQL          = "CALL read_UpptagnaDomare($Season,'$Datum',$domartyp)";

	$affected_rows = 0;
    $message_data = "SHL-ERROR vid ajax/hamta_domare.php ($SQL)";
    $result = $mysqli->query($SQL);

	if (!$result){
	    send_dberror(TO, "SHL-ERROR vid ajax/hamta_domare.php ", $message_data);
	    $ErrorNr = '4';
	    throw new Exception($ErrorNr);
	}
    $affected_rows = $mysqli->affected_rows;

    $UpptagnaDomare = [];
    for ($i = 0; $i < $affected_rows; $i++){
        $row = $result->fetch_row();
        $JerseyNo = $row[0];
        $UpptagnaDomare[$i] = $JerseyNo;
    }



    $LedigaDomare = [];
    $j = 0;
    for ($i = 0; $i < count($Domare); $i++){
        $JerseyNo = $Domare[$i];
        if (in_array($JerseyNo, $UpptagnaDomare)) {
            // do nothing
        } else {
            $LedigaDomare[$j] = $JerseyNo;
            $j++;
        }
    }



    // Läs lediga domare från tabellen Matcher
    $svar = '';
    if ($domartyp == 3){

        $LedigaDomare_2 = [];

        $Datum1 = $Datum . ' 00:00:00';
        $Datum2 = $Datum . ' 23:59:59';

        // Impicit säsongsbaserat pga datum
        $SQL   = "CALL read_MatchCoach('$Datum1','$Datum2')";


        clearStoredResults($mysqli);

        //Execute database-query
        $affected_rows = 0;
        $message_data = "SHL-ERROR vid ajax/hamta_domare.php ($SQL)";
        $result = $mysqli->query($SQL);


        if (!$result){
            send_dberror(TO, "SHL-ERROR vid ajax/hamta_domare.php ", $message_data);
            $ErrorNr = '5';
            throw new Exception($ErrorNr);
        }

        $affected_rows = $mysqli->affected_rows;


        $antal = count($LedigaDomare);

        for ($i = 0; $i < $affected_rows; ++$i){
            $row = $result->fetch_row();

            for ($j = 0; $j < $antal; $j++){
                if ($LedigaDomare[$j] == $row[0]){
                    $LedigaDomare[$j] = -1;
                    break;
                }
            }
        }


        for ($i = 0; $i < $antal; $i++){
            if ($LedigaDomare[$i] > 0){
                $LedigaDomare_2[count($LedigaDomare_2)] = $LedigaDomare[$i];;
            }
        }


        // Skapa JSON-objektet för returen
        $svar = '{"status": "OK", "Domare": [';
        for ($i = 0; $i < count($LedigaDomare_2); $i++){
            if ($i > 0){
                $svar .= ', ';
            }
            $svar .= '{"JerseyNo":'    . $LedigaDomare_2[$i] . '}';
        }
        $svar .= ']}';

    }

    if ($domartyp < 3){

        $LedigaDomare_2 = [];

        $Datum1 = $Datum . ' 00:00:00';
        $Datum2 = $Datum . ' 23:59:59';

        // Implicit säsongsbaserat eftersom det bygger på datum.
        $SQL   = "CALL read_Matchdomare('$Datum1','$Datum2',$domartyp)";




        clearStoredResults($mysqli);


        //Execute database-query
        $affected_rows = 0;
        $message_data = "SHL-ERROR vid ajax/hamta_domare.php ($SQL)";
        $result = $mysqli->query($SQL);


        if (!$result){
            send_dberror(TO, "SHL-ERROR vid ajax/hamta_domare.php ", $message_data);
            $ErrorNr = '6';
            throw new Exception($ErrorNr);
        }
        $affected_rows = $mysqli->affected_rows;




        $antal = count($LedigaDomare);
        for ($i = 0; $i < $affected_rows; ++$i){
            $row = $result->fetch_row();

            $domare1 = $row[0];
            $domare2 = $row[1];

            if ($domare1){
                for ($j = 0; $j < $antal; $j++){
                    if ($LedigaDomare[$j] == abs($domare1)){
                        $LedigaDomare[$j] = -1;
                        break;
                    }
                }
            }



            if ($domare2){
                for ($j = 0; $j < $antal; $j++){
                    if ($LedigaDomare[$j] == abs($domare2)){
                        $LedigaDomare[$j] = -1;
                        break;
                    }
                }
            }
        }




        for ($i = 0; $i < $antal; $i++){

            if ($LedigaDomare[$i] > 0){


                $Season   = $_SESSION['Season'];
                $JerseyNo = $LedigaDomare[$i];
                $SQL   = "CALL read_TillsattStatistik($Season,'$HomeCode','$AwayCode',$JerseyNo,$domartyp)";


                clearStoredResults($mysqli);

                //Execute database-query
                $affected_rows = 0;
                $message_data = "SHL-ERROR vid ajax/hamta_domare.php ($SQL)";
                $result = $mysqli->query($SQL);

                if (!$result){
                    send_dberror(TO, "SHL-ERROR vid ajax/hamta_domare.php ", $message_data);
                    $ErrorNr = '7';
                    throw new Exception($ErrorNr);
                }
                $affected_rows = $mysqli->affected_rows;


                if ($affected_rows > 0){
                    $row = $result->fetch_row();

                    $hemma_hemma   = $row[0];
                    $borta_borta   = $row[1];
                    $seasonmatcher = $row[2];
                } else {
                    $hemma_hemma   = 0;
                    $borta_borta   = 0;
                    $seasonmatcher = 0;
                }


                $tmpArray = [];
                $tmpArray[0]  = $LedigaDomare[$i];
                $tmpArray[1]  = $hemma_hemma;
                $tmpArray[2]  = $borta_borta;
                $tmpArray[3]  = $seasonmatcher;

                $LedigaDomare_2[count($LedigaDomare_2)] = $tmpArray;

            }
        }



        // Skapa JSON-objektet för returen
        $svar = '{"status": "OK", "Domare": [';

        for ($i = 0; $i < count($LedigaDomare_2); $i++){
            if ($i > 0){
                $svar .= ', ';
            }
            $svar .= '{"JerseyNo":'    . $LedigaDomare_2[$i][0] . ', ';
            $svar .= '"hemma_hemma":'  . $LedigaDomare_2[$i][1] . ', ';
            $svar .= '"borta_borta":'  . $LedigaDomare_2[$i][2] . ', ';
            $svar .= '"veckomatcher":' . $LedigaDomare_2[$i][3] . '}';
        }
        $svar .= ']}';


    }




	$mysqli->commit();
	$mysqli->autocommit(TRUE); // i.e., end transaction


}


catch ( Exception $e ) {
	// before rolling back the transaction, you'd want
	// to make sure that the exception was db-related
    write_error("Exception");
	$mysqli->rollback();
	$mysqli->autocommit(TRUE); // i.e., end transaction

    $svar = '{"status": "Error"}';

}


echo $svar;

/*
$LedigaDomare_2 = [];

$message_data = "SHL-ERROR vid tillsattning.php read_domare2().";
// Läs alla domare som är aktiva och har rätt domartyp
$SQL  = "CALL read_Domare2($domartyp)";
list($affected_rows,$result) = opendb($message_data,$SQL);

if (!$result or $affected_rows == 0){
    echo '{"status": "Error"}';
    exit();
}

// och placera dem i array Domare
$Domare         = [];
for ($i = 0; $i < $affected_rows; ++$i){
    $row = $result->fetch_row();
    $Domare[$i] = $row[0];
}



// Läs domare från tabellen Ledigheter, dvs är säsongsbaserat
$Season       = $_SESSION['Season'];
$SQL          = "CALL read_UpptagnaDomare($Season,'$Datum',$domartyp)";
$message_data = "SHL-ERROR vid ajax/hamta_domare.php ($SQL)";

//Execute database-query
$affected_rows = 0;

list($affected_rows,$result) = opendb($message_data,$SQL);
if (!$result){
    echo '{"status": "Error"}';
    exit();
}

$UpptagnaDomare = [];
for ($i = 0; $i < $affected_rows; $i++){
    $row = $result->fetch_row();
    $JerseyNo = $row[0];
    $UpptagnaDomare[$i] = $JerseyNo;
}


$LedigaDomare = [];
$j = 0;
for ($i = 0; $i < count($Domare); $i++){
    $JerseyNo = $Domare[$i];
    if (in_array($JerseyNo, $UpptagnaDomare)) {
        // do nothing
    } else {
        $LedigaDomare[$j] = $JerseyNo;
        $j++;
    }
}




// Läs lediga domare från tabellen Matcher
$svar = '';
if ($domartyp == 3){
    if (read_coach($Datum)){
        // Skapa JSON-objektet för returen
        $svar = '{"status": "OK", "Domare": [';
        for ($i = 0; $i < count($LedigaDomare_2); $i++){
            if ($i > 0){
                $svar .= ', ';
            }
            $svar .= '{"JerseyNo":'    . $LedigaDomare_2[$i] . '}';
        }
        $svar .= ']}';

    } else {
        $svar = '{"status": "Error"}';
    }

} else {
    if (read_domare($Datum,$HomeCode,$AwayCode,$domartyp)){

        // Skapa JSON-objektet för returen
        $svar = '{"status": "OK", "Domare": [';

        for ($i = 0; $i < count($LedigaDomare_2); $i++){
            if ($i > 0){
                $svar .= ', ';
            }
            $svar .= '{"JerseyNo":'    . $LedigaDomare_2[$i][0] . ', ';
            $svar .= '"hemma_hemma":'  . $LedigaDomare_2[$i][1] . ', ';
            $svar .= '"borta_borta":'  . $LedigaDomare_2[$i][2] . ', ';
            $svar .= '"veckomatcher":' . $LedigaDomare_2[$i][3] . '}';
        }
        $svar .= ']}';

    } else {
        $svar = '{"status": "Error"}';
    }
}

write_error("svar=$svar");

echo $svar;
//exit();

// =================================================================



function read_domare($Datum,$HomeCode,$AwayCode,$domartyp){

    global $LedigaDomare;
    global $LedigaDomare_2;
    $LedigaDomare_2 = [];

    $Datum1 = $Datum . ' 00:00:00';
    $Datum2 = $Datum . ' 23:59:59';

    // Implicit säsongsbaserat eftersom det bygger på datum.
    $SQL   = "CALL read_Matchdomare('$Datum1','$Datum2',$domartyp)";
    //write_error("SQL=$SQL");


    $message_data = "SHL-ERROR vid ajax/hamta_domare.php function read_domare($Datum,$HomeCode,$AwayCode,$domartyp)";


	//Execute database-query
	$affected_rows = 0;
    list($affected_rows,$result) = opendb($message_data,$SQL);

    if (!$result) return false;


    $antal = count($LedigaDomare);
    for ($i = 0; $i < $affected_rows; ++$i){
        $row = $result->fetch_row();

        $domare1 = $row[0];
        $domare2 = $row[1];

        if ($domare1){
            for ($j = 0; $j < $antal; $j++){
                if ($LedigaDomare[$j] == abs($domare1)){
                    $LedigaDomare[$j] = -1;
                    break;
                }
            }
        }



        if ($domare2){
            for ($j = 0; $j < $antal; $j++){
                if ($LedigaDomare[$j] == abs($domare2)){
                    $LedigaDomare[$j] = -1;
                    break;
                }
            }
        }
    }



    for ($i = 0; $i < $antal; $i++){

        if ($LedigaDomare[$i] > 0){

            list($status,$hemma_hemma,$borta_borta,$seasonmatcher) = read_statistik($HomeCode,$AwayCode,$domartyp,$LedigaDomare[$i]);

            if ($status == false) return false;


            $tmpArray = [];
            $tmpArray[0]  = $LedigaDomare[$i];
            $tmpArray[1]  = $hemma_hemma;
            $tmpArray[2]  = $borta_borta;
            $tmpArray[3]  = $seasonmatcher;

            $LedigaDomare_2[count($LedigaDomare_2)] = $tmpArray;

        }
    }

    return true;

}


function read_statistik($HomeCode,$AwayCode,$domartyp,$JerseyNo){

    $message_data = "SHL-ERROR vid ajax/hamta_domare.php function read_statistik($HomeCode,$AwayCode,$domartyp,$JerseyNo)";


    $Season    = $_SESSION['Season'];

    $SQL   = "CALL read_TillsattStatistik($Season,'$HomeCode','$AwayCode',$JerseyNo,$domartyp)";

	//Execute database-query
	$affected_rows = 0;
    list($affected_rows,$result) = opendb($message_data,$SQL);

    if (!$result OR $affected_rows == 0) return array(false,-1,-1,-1);


    $row = $result->fetch_row();

    $hemma_hemma   = $row[0];
    $borta_borta   = $row[1];
    $seasonmatcher = $row[2];

    return array(true,$hemma_hemma,$borta_borta,$seasonmatcher);
}


function read_coach($Datum){

    global $LedigaDomare;
    global $LedigaDomare_2;
    $LedigaDomare_2 = [];

    $Datum1 = $Datum . ' 00:00:00';
    $Datum2 = $Datum . ' 23:59:59';

    // Impicit säsongsbaserat pga datum
    $SQL   = "CALL read_MatchCoach('$Datum1','$Datum2')";


    $message_data = "SHL-ERROR vid ajax/hamta_domare.php function read_coach($Datum)";


	//Execute database-query
	$affected_rows = 0;
    list($affected_rows,$result) = opendb($message_data,$SQL);

    if (!$result) return false;


    $antal = count($LedigaDomare);

    for ($i = 0; $i < $affected_rows; ++$i){
        $row = $result->fetch_row();

        for ($j = 0; $j < $antal; $j++){
            if ($LedigaDomare[$j] == $row[0]){
                $LedigaDomare[$j] = -1;
                break;
            }
        }
    }

    for ($i = 0; $i < $antal; $i++){
        if ($LedigaDomare[$i] > 0){
            $LedigaDomare_2[count($LedigaDomare_2)] = $LedigaDomare[$i];;
        }
    }

    return true;

}
*/
?>

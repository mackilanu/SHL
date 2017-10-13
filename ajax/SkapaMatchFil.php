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

$FromDate    = $_GET['FromDate'];
$ToDate      = $_GET['ToDate'];
$Season      = $_SESSION['Season'];
$usernames   = get_names();

if($usernames == "Error"){
    echo'{"status": "Error"}';
    return;
}

echo hamta_matcher($Season, $FromDate, $ToDate, $usernames);

function hamta_matcher($Season, $FromDate, $ToDate, $usernames){

    $SQL     = "CALL read_AllaUrvalsMatcher(". $Season .", '". $FromDate ."', '". $ToDate ."')";
    $message = "SHL-error ajax/SkapaMatchFil.php function hamta_matcher($Season, $FromDate, $ToDate). SQL = $SQL";

    list($num_rows, $result) = opendb($message, $SQL);

    if(!$result)
        return '{"status": "Error"}';
    
    if($num_rows == 0)
        return '{"status": "NoGames"}';

    $s = "Datum,Lag, HD, HD, LD, LD, Domarcoach;\n";

    while($row = $result->fetch_row()){

        if(!$row[10] || $row[10] < 0)
        $HD1 = "";
    else{
        $HD1 = display_name($row[10], $usernames);
    }


    if(!$row[11] || $row[11] < 0)
        $HD2 = "";
    else  {
        $HD2 = display_name($row[11], $usernames);
    }  
        
    if(!$row[12] || $row[12] < 0)
        $LD1 = "";
    else{
        $LD1 = display_name($row[12], $usernames);
    }


    if(!$row[13] || $row[13] < 0)
        $LD2 = "";
    else{
        $LD2 = display_name($row[13], $usernames);
    }

    if(!$row[14] || $row[14] < 0)
        $coach = "";
    else{
         $coach = display_name($row[14], $usernames);   
    }
 
    $s .= $row[7]  . ",";
    $s .= $row[1]  . "-". $row[4] . ",";
    $s .= $HD1 . ",";
    $s .= $HD2 . ",";
    $s .= $LD1 . ",";
    $s .= $LD2 . ",";
    $s .= $coach. ";\n";
     
}

    //Tömmer filen innan den fylls på igen.
    $handle = fopen (TILLSATTNINGSFIL, "w+");
    //Kontrollerar om det gick bra
    if($handle == false){
        fclose($handle);
        return '{"status": "Error"}';
    }

    fclose($handle);

    //Öppnar vederbörande fil
    $tillsattningsfil = fopen(TILLSATTNINGSFIL, "a");

    //Skriver hämtad information i filen
    $skriv = fwrite($tillsattningsfil, $s);

    //Kontrollerar om det gick bra att skriva till filen
    if($skriv == ""){
        fclose($tillsattningsfil);
        return '{"status": "Error"}';
    }

    fclose($tillsattningsfil);

    return '{"status": "OK"}';

}

//Denna funktion läser nmanen från samtliga konton i databasen.
function get_names(){
    
    $SQL     = "CALL read_userNames()";
    $message = "SHL-error ajax/SkapaMatchFil.php function hamta_matcher($Season, $FromDate, $ToDate). SQL = $SQLusernameHD1";

    list($num_rows, $result) = opendb($message, $SQL);

    if($num_rows == 0 || !$result)
        return 'Error';
   
    $arr = array();
    while($row = $result->fetch_assoc()){

        $arr[] = $row;
    }

    return $arr;
}

//Letar rätt på rätt för -och efternamn och returnerar namnet.
function display_name($JerseyNo, $usernames){
    
    $len = count($usernames);

    for($i = 0; $i < $len; $i++){
        if($usernames[$i]['JerseyNo'] == $JerseyNo){
           return $usernames[$i]['FirstName'] . " " . $usernames[$i]['LastName'];
        }
    }
}


?>

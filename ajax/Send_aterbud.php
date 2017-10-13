<?php

@session_start();


if (!isset($_SESSION['JerseyNo'])){
    header("Location: ../nosession.php");
    exit();
}

header("Content-type: text/html; charset=utf-8");

date_default_timezone_set("Europe/Stockholm");

require_once("../includes/config.php");
require_once("../includes/io.php");
require_once("../includes/opendb.php");
require_once("../includes/epostsender.php");

$JerseyNo  = $_GET['JerseyNo'];
$Date      = $_GET['Date'];
$season    = $_SESSION['Season'];
$time      = date('Y-m-d H:i:s', time());
$AddedBy   = $_SESSION['FirstName'] ." ". $_SESSION['LastName']; 


echo  Insert_Aterbud($JerseyNo, $Date, $time, $AddedBy, $season);


function SendEpost($GameId, $HomeName, $AwayName, $Date){


       if(KORNING == "TEST"){

         send_epost(TO, "Ändring av match",
          "Hej!
          <br><br>
          En match har blivit ändrad pågrund av att en administratör har registrerad återbud för en 
          utav domarna. Detta gäller matchen $HomeName -  $AwayName den $Date.<br><br>
          Mvh,<br> Tillsättningsprogrammet");
       }

       if(KORNING == "PRODUKTION"){

        $message_data = "SHL-ERROR vid ajax/Send_aterbud.php function SendEpost()";
        $SQL          = "CALL read_AdminEmails()";

        list($num_rows, $result) = opendb($message_data, $SQL);
        while($email = $result->fetch_assoc()){

        send_epost($email['Email'], "Ändring av match",
        "Hej!
        <br><br>
        En match har blivit ändrad pågrund av att en administratör har registrerad återbud för en 
        utav domarna. Detta gäller matchen $HomeName -  $AwayName den $Date. <br><br>
        Mvh,<br> Tillsättningsprogrammet>");
    }
   }
  }


  function RemoveFromGame($Date, $JerseyNo, $Season){
    
    $message_data = "SHL-ERROR vid ajax/Send_aterbud.php function RemoveFromGame()";

    list($num_rows, $result) = opendb($message_data, "CALL read_tillsatt_match('$Date', '$JerseyNo')");


    $row = $result->fetch_assoc();
     $id  = $row['GameId'];

    if($row['HD1'] == $JerseyNo){

      $SQL = "CALL remove_HD1('$Season', '$id')";
    }

    if($row['HD2'] == $JerseyNo){

      $SQL = "CALL remove_HD2('$Season', '$id')";
    }

     if($row['LD1'] == $JerseyNo){

      $SQL = "CALL remove_LD1('$Season', '$id')";
    }
     if($row['LD2'] == $JerseyNo){

      $SQL = "CALL remove_LD2('$Season', '$id')";
    }

    list($num_rowsRemove, $resultRemove) = opendb($message_data, $SQL);

     if($num_rows == 0 or !$result){

       return false;
     }else{
         return true;
     }



  }


function Insert_Aterbud($JerseyNo, $Date, $time, $AddedBy, $season){

    $message_data = "SHL-ERROR vid ajax/Send_aterbud.php function Insert_Aterbud($JerseyNo, $User).";

     $SQLStatus  = "CALL read_AterbudStatus('$JerseyNo', '$Date')";

     list($affected_rowsStatus,$resultStatus) = opendb($message_data, $SQLStatus);
     $rowsStatus = $resultStatus->fetch_assoc();

     if($rowsStatus['Noterad_Ledig'] != NULL){
        return '{"status": "RedanLedig", "date": "'.$Date.'"}';
     }
     
     if($rowsStatus['Noterad_Aterbud'] == NULL){
       $SQL    = "CALL Update_Aterbud('$time', '$AddedBy', '$Date', '$JerseyNo')";
       $status = "IN";
     }else{
       $SQL    = "CALL delete_Aterbud('$JerseyNo', '$Date')";
       $status = "OUT";
     }

     list($affected_rows,$result) = opendb($message_data,$SQL);
    

    if (!$result or $affected_rows == 0){
        return '{"status": "Error"}';
    }else{

        if($status == "IN"){
       $message_data = "SHL-ERROR vid ajax/Send_aterbud.php function SendEpost()";
        $SQL         = "CALL read_match('$season', '$JerseyNo', '$Date')";

   list($affected_rows, $result) = opendb($message_data, $SQL);

   if($affected_rows == 1){

   $remove =  RemoveFromGame($Date, $JerseyNo, $season);

   if($remove == true){
     $rows = $result->fetch_assoc();
     SendEpost($rows['GameId'], $rows['HomeName'], $rows['AwayName'],$rows['Date']);
    }else{
       return '{"status": "NoRemoval", "date": "'.$Date.'"}';
    }
            
  }
            return '{"status": "OK", "date": "'.$Date.'"}';
        
    }else{
        return '{"status": "OK", "date": "'.$Date.'"}';    
  }
 }
}


?>

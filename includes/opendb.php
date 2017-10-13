<?php

function opendb($message_data, $SQL){

    $mysqli       = new mysqli(DB_HOST, DB_USER, DB_PW, DB_NAME);

    //Open database
    if (mysqli_connect_errno()){
        $message_data .= mysqli_connect_error();
        send_epost(TO, "SHL-ERROR vid opendb.php function opendb", $message_data);
        return array(0,false);
    }


    //Chance character set to utf8
    if (!$mysqli->set_charset("utf8")){ // Chance character set to utf8
        $message_data .= $mysqli->error;
        send_epost(TO, "SHL-ERROR vid opendb.php function opendb", $message_data);
    }

    //Execute database-query
    $affected_rows = 0;
    if ($result = $mysqli->query($SQL)){
        $affected_rows = $mysqli->affected_rows;

        $mysqli->close();
        return array($affected_rows,$result);
    }


    //ERROR on query
    $message_data .= "\n".$SQL."\n".$mysqli->error;
    write_error("message_data=$message_data");
    send_epost(TO, "SHL-ERROR vid opendb.php function opendb", $message_data);

    $mysqli->close();

    return array(0,false);
}

function clearStoredResults($mysqli_link){
    while($mysqli_link->next_result()){
        if($l_result = $mysqli_link->store_result()){
            $l_result->free();
        }
    }
}

?>
<?php

require_once "/usr/share/php/Mail.php";
require_once "config.php";

function send_dberror($mottagare,$subject,$body){

    $headers = array ('From' => USERNAME,
        'To' => $mottagare,
        'Subject' => '=?utf-8?B?'.base64_encode($subject).'?=',
        'MIME-Version' => '1.0',
        'Content-Type' => 'text/html; charset=UTF-8');
    $smtp    = Mail::factory('smtp',
    array ('host' => HOST,
    'port' => PORT,
    'auth' => TRUE,
    'username' => USERNAME,
    'password' => PASSWORD));


    $mail       = $smtp->send($mottagare, $headers, $body);


    if (PEAR::isError($mail)) {
        $msg  = "Error - includes/epostsender.php function send_dberror.\nErrmsg=" . $mail->getMessage() . "\n\n";
        write_error($msg);
        write_missed($mottagare,$subject,$body);
    }
}


function send_epost($mottagare,$subject,$body){

    $avsandare    = USERNAME;

    if (KORNING == "TEST"){
        $mottagare = TO;
    }


    $headers = array ('From' => $avsandare,
                      'To' => $mottagare,
                      'Subject' => '=?utf-8?B?'.base64_encode($subject).'?=',
                      'MIME-Version' => '1.0',
                      'Content-Type' => 'text/html; charset=UTF-8');
    $smtp    = Mail::factory('smtp',
                             array ('host' => HOST,
                             'port' => PORT,
                             'auth' => TRUE,
                             'username' => USERNAME,
                             'password' => PASSWORD));


    $mail       = $smtp->send($mottagare, $headers, $body);

    if (PEAR::isError($mail)) {
        $msg  = "Error - includes/epostsender.php function send_epost.\nErrmsg=" . $mail->getMessage() . "\n\n";
        $msg .= 'mottagare=' . $mottagare . ', subject= ' . $subject . ', body= ' . $body;
        write_error($msg);
        //save_todb($mottagare,$subject,$body);
        return FALSE;
    }

    return TRUE;
}

function save_todb($mottagare,$subject,$body){

    $message_data = "ERROR vid includes/epostsender.php function save_todb($mottagare,$subject,$body)";

    $body = str_replace('"', '&quot;', $body);
    $body = str_replace("'", '&apos;', $body);

    $SQL = "CALL insert_MissedEmail('$mottagare','$subject','$body')";

    list($affected_rows,$result) = opendb($message_data, $SQL);

    if (!$result or $affected_rows == 0){
        write_missed($mottagare,$subject,$body);
}

return FALSE;
}

function write_missed($mottagare,$subject,$body){

    write_error("============ MISSED EMAIL som inte sparades i databasen under " . KORNING . "============");
    write_error("mottagare=$mottagare");
    write_error("subject=$subject");
    write_error("body=$body");
    write_error("============ MISSED EMAIL END =============================================");
}

?>

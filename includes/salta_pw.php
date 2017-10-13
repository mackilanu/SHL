<?php

function avsalta($pw){

    $pw1 = substr($pw,23,11);
    $pw2 = substr($pw,53,7);
    $pw3 = substr($pw,73,14);
    $pw = $pw1 . $pw2 . $pw3;

    // pw är nu avsaltad men fortfarande MD5 krypterat
    // och kan jämföras med den pw som kommer från
    // användaren (klienten-javascript) och är MD5 krypterat.
    return $pw;
}

function saltaPw($pw){
    //Dela pw i 3 delar med vardera 11, 7, och 14 tecken
    $pw1 = substr($pw,0,11);
    $pw2 = substr($pw,11,7);
    $pw3 = substr($pw,18,14);

    //Generera en 96 bitars string i delar av 23, 19, 13, 41
    $chars  = 'qazxswed_cvfrtgbnhy!ujmkiolp0192837465PLOIKMJUYHNBGTRFVCDEWSXZAQ';
    $new_pw = '';
    $size   = strlen($chars);

    // Del 1 23 tkn
    $str    = '';
    for ($i = 0; $i < 23; ++$i){
        $str .= $chars[rand(0, $size - 1)];
    }
    $new_pw = $str . $pw1;

    // Del 2 19 tkn
    $str    = '';
    for ($i = 0; $i < 19; ++$i){
        $str .= $chars[rand(0, $size - 1)];
    }
    $new_pw .= $str . $pw2;

    // Del 3 13 tkn
    $str    = '';
    for ($i = 0; $i < 13; ++$i){
        $str .= $chars[rand(0, $size - 1)];
    }
    $new_pw .= $str . $pw3;

    // Del 4 41 tkn
    $str    = '';
    for ($i = 0; $i < 41; ++$i){
        $str .= $chars[rand(0, $size - 1)];
    }
    $new_pw .= $str;

    return $new_pw;
}

?>
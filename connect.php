<?php

function Connect(){
    $dbhost = "assignment1db.cghulbrks8jh.us-east-2.rds.amazonaws.com";
    $dbadmin = "admin";
    $dbpassword = "svdden+=479";
    $db = "DiscussionBoard";
    $connect = new mysqli($dbhost,$dbadmin,$dbpassword,$db, 3306);
    //$connect = new PDO("mysql:host=$dbhost;dbname=$db", $dbadmin, $dbpassword);
    //$connect->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $connect;
}

function CloseConnect($connect){
    $connect -> close();
}

?>
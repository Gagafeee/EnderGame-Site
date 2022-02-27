<?php
    define('HOST','localhost');
    define('DB_NAME','endergame');
    define('USER','root_user');
    define('PASS','');

    try {
        $db = new PDO("mysql:host=" . HOST . ";dbname=" . DB_NAME, USER, PASS); 
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch (PDOException $er) {
        $err = $er;
        $err_status = 3;
    }

?>
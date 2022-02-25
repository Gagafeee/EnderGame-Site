<?php
    define('HOST','localhost');
    define('DB_NAME','endergame');
    define('USER','root_user');
    define('PASS','');

    try {
        $db = new PDO("mysql:host=" . HOST . ";dbname=" . DB_NAME, USER, PASS); 
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        echo "DataBase > Connected";
    } catch (PDOException $e) {
        echo $e;
    }


?>
<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]>      <html class="no-js"> <!--<![endif]-->
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="dephault.css"></link>
        <link rel="stylesheet" href="register.css"></link>
    </head>
    <body class="theme-dark">
        <!--[if lt IE 7]>
            <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="#">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->
    <header>
        <!--Nav-->
        <?php include 'menu.php'; ?>
    </header>
        
<section id="page">
    
        <form method="post" id="register">
        <p>Créer un compte</p>
            <input class="input" type="text" name="pseudo" id="pseudo" placeholder="Votre Identifiant" required><br/>
            <input class="input" type="text" name="email" placeholder="Votre Email" required><br>
            <input class="input" type="password" name="password" placeholder="Mots de passe" required>
            <input class="button" type="submit" name="formsend" id="formsend" value="Créer">
        
        
        <section class="return_panel<?php include("register#.php"); global $err; echo ""; if($err == 1) {echo "_valid";} if($err == 2) {echo "_unvalid";} if($err == 0) {echo "";}  ?>">
            <p>
                <?php 

                include("register#.php");

                global $err_status;
                global $err;
                echo $err_status."<br>";

                if ($err_status == 1) {echo "Runned";} 
                if ($err_status == 2) {
                    
                    $err_code = $err->getCode();
                    switch ($err_code) {
                        case 23000:
                            echo "Un compte avec ce nom existe déjà [". $err->getFile()." at ". $err->getLine()."]<br>".$err->getMessage();
                            break;
                        
                        default:
                            echo "Error was occured : ". $err;
                            break;
                    }
                    
                }
                
                
                
            
                 ?>
                
            </p>
        </section>
    </form>
</section>
</body>
</html>
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
        <script type="module" src="../database.js"></script>
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
        
        
        
                <?php 
                
                    $err_status = 0;
                    $err = new Exception;

                        if(isset($_POST['formsend'])){
                            $pseudo = $_POST['pseudo'];
                            $email = $_POST['email'];
                            $password = $_POST['password'];
                            $user_id = 0;
                            $permission_level = 0;
                            $tags = null;
                        
                            if(!empty($pseudo) && !empty($email) && !empty($password)){
                            
                                include 'database.php';
                                global $db;
                                global $err;
                                global $err_status;
                            
                                //hachage du password
                            
                                $hash_opt = ['cost' => 12,];
                                $password = password_hash($password, PASSWORD_BCRYPT, $hash_opt);

                                $q = $db->prepare("INSERT INTO users(name,email,password) VALUES(:name,:email,:password)");
                                $err_status = 1;
                                try {
                                    $q->execute([
                                        'name' => $pseudo,
                                        'email' => $email,
                                        'password' => $password
                                    ]);
                                } catch (PDOException $e) {      
                                   $err_status = 2;
                                   $err = $e;
                                
                                }
                            }

                        }

                    ?>

                
           
        
    </form>
    <section class="return_panel" id="return_panel">
            <p id="err_text"> </p>
            <script>
                    var err_code = "<?=$err->getCode()?>";
                    var err_status = "<?=$err_status?>";
                    var err = "<?=$err->getMessage()?>";
                        console.log(err_code);
                        if(err_status != 0){
                        text = document.getElementById("err_text");
                        panel = document.getElementById("return_panel");

                        text.innerHTML = "Unable to display error [InternalError]";
                        panel.className = "return_panel_unvalid";

                        if(err_status == 1){
                            text.innerHTML = "Accound Created Successfully";
                            panel.className = "return_panel_valid";
                        }
                        if(err_status == 3){
                            text.innerHTML = "[Internal Error] Cannot connect to database";
                            panel.className = "return_panel_unvalid";
                        }
                        if(err_status == 2){
                            panel.className = "return_panel_unvalid";
                            text.innerHTML = "[Internal ERROR]]";
                            
                            switch (err_code) {
                                case "23000":
                                        text.innerHTML = "An account whith this name/email already exists";
                                        break;  
                                default:
                                text.innerHTML = "An error occurred";
                                    console.log(err);
                                    break;
                            }


                        }
                        
                        panel.style.display = "flex";}
                    
                </script>
    </section>
</section>
</body>
</html>
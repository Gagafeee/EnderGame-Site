
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


                echo "var err = '$err'";
                echo "var err_status = '$err_status'";
                
                
            }
            
        }
        
        
        
        
        ?>


<script>
    var err = '<?=$err?>';
    var err_status = '<?=$err_status?>';
    console.log(err + "  " + err_status);
</script>



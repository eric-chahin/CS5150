<?php
  //Start session
  session_start();  
  //Unset the variables stored in session
  unset($_SESSION['SESS_MEMBER_ID']);
  unset($_SESSION['SESS_FIRST_NAME']);
  unset($_SESSION['SESS_LAST_NAME']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Checklist Interactive Login</title>
  <meta name="description" content="">
  <meta name="author" content="">

  <link href="css/mybootstrap.css" rel="stylesheet">
  <link href="css/style.css" rel="stylesheet">

  <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
  <!--[if lt IE 9]>
    <script src="js/html5shiv.js"></script>
  <![endif]-->

  <!-- Fav and touch icons -->
  <link rel="apple-touch-icon-precomposed" sizes="144x144" href="img/apple-touch-icon-144-precomposed.png">
  <link rel="apple-touch-icon-precomposed" sizes="114x114" href="img/apple-touch-icon-114-precomposed.png">
  <link rel="apple-touch-icon-precomposed" sizes="72x72" href="img/apple-touch-icon-72-precomposed.png">
  <link rel="apple-touch-icon-precomposed" href="img/apple-touch-icon-57-precomposed.png">
  <link rel="shortcut icon" href="img/favicon.png">
  
    <script type="text/javascript" src="js/jquery.min.js"></script>
    <script type="text/javascript" src="js/bootstrap.min.js"></script>
    <script type="text/javascript" src="js/scripts.js"></script>
    <script type="text/javascript">
    function validateSignupForm()
    {
    var a=document.getElementById('signup-email').value;
    var b=document.getElementById('signup-username').value;
    var c=document.getElementById('signup-password').value;
    var d=document.getElementById('signup-password2').value;
    
    if ((a==null || a=="") && (b==null || b=="") && (c==null || c=="") && (d==null || d==""))
    {
        alert("All Field must be filled out");
        return false;
    }
    if (a==null || a=="")
    {
        alert("Email must be filled out");
        return false;
    }
    if (b==null || b=="")
    {
        alert("Username must be filled out");
        return false;
    }
    if (c==null || c=="")
    {
        alert("Password must be filled out");
        return false;
    }
    if (d==null || d=="")
    {
        alert("Must confirm password");
        return false;
    }
    if (c!=d) {
        alert("Passwords do not match");
        return false;
    }
}
</script>

<script type="text/javascript">
function validateLoginForm()
{
    var a=document.getElementById('login-username').value;
    var b=document.getElementById('login-password').value;

    if (a==null || a=="")
    {
        alert("Username must be filled out");
        return false;
    }
    if (b==null || b=="")
    {
        alert("Password must be filled out");
        return false;
    }
}
</script>

</head>

<body>

<div class="titlebanner">
</div>

    <div class="container">
     <div class="row clearfix">
      <div class="col-md-12">
        <div class="login_box">
        <div id="loginbox" style="margin-top:40px;" class="mainbox col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
            <div class="panel panel-info" >
                    <div class="panel-heading">
                        <div class="panel-title">Sign In</div>
                        <div style="float:right; font-size: 80%; position: relative; top:-10px"><a href="#">Forgot password?</a></div>
                    </div>     

                    <div style="padding-top:25px" class="panel-body" >

                        <div style="display:none" id="login-alert" class="alert alert-danger col-sm-12"></div>
                            
                        <form id="loginform" class="form-horizontal" role="form" action="login_exec.php" method="post" onsubmit="return validateLoginForm()">
                                    
                            <div style="margin-bottom: 25px" class="input-group">
                                        <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
                                        <input id="login-username" type="text" class="form-control" name="login-username" value="" placeholder="username">
                                    </div>
                                
                            <div style="margin-bottom: 25px" class="input-group">
                                        <span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span>
                                        <input id="login-password" type="password" class="form-control" name="login-password" placeholder="password">
                                    </div>
                                    

                                
                            <div class="input-group">
                                      <div class="checkbox">
                                        <label>
                                          <input id="login-remember" type="checkbox" name="login-remember" value="1"> Remember me
                                        </label>
                                      </div>
                                    </div>


                                <div style="margin-top:10px" class="form-group">
                                    <!-- Button -->

                                    <div class="col-sm-12 controls">
                                       <button id="btn-signup" type="submit" class="btn btn-info"><i class="icon-hand-right"></i> &nbsp Login</button>

                                    </div>
                                </div>


                                <div class="form-group">
                                    <div class="col-md-12 control">
                                        <div style="border-top: 1px solid#888; padding-top:15px; font-size:85%" >
                                            Don't have an account! 
                                        <a href="#" onClick="$('#loginbox').hide(); $('#signupbox').show()">
                                            Sign Up Here
                                        </a>
                                        </div>
                                    </div>
                                </div>    
                            </form>     



                        </div>                     
                    </div>  
        </div>
        <div id="signupbox" style="display:none; margin-top:5px" class="mainbox col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
                    <div class="panel panel-info">
                        <div class="panel-heading">
                            <div class="panel-title">Sign Up</div>
                            <div style="float:right; font-size: 85%; position: relative; top:-10px"><a id="signinlink" href="#" onclick="$('#signupbox').hide(); $('#loginbox').show()">Sign In</a></div>
                        </div>  
                        <div class="panel-body" >
                            <form id="signupform" class="form-horizontal" role="form" action="code_exec.php" method="post" onsubmit="return validateSignupForm()">
                                
                                <div id="signupalert" style="display:none" class="alert alert-danger">
                                    <p>Error:</p>
                                    <span></span>
                                </div>
                                    
                                
                                  
                                <div class="form-group">
                                    <label for="email" class="col-md-3 control-label">Email</label>
                                    <div class="col-md-9">
                                        <input type="text" class="form-control" name="signup-email" id="signup-email"placeholder="Email Address">
                                    </div>
                                </div>
                                    
                                <div class="form-group">
                                    <label for="username" class="col-md-3 control-label">Username</label>
                                    <div class="col-md-9">
                                        <input type="text" class="form-control" name="signup-username" id="signup-username" placeholder="Username">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="password" class="col-md-3 control-label">Password</label>
                                    <div class="col-md-9">
                                        <input type="password" class="form-control" name="signup-password" id="signup-password" placeholder="Password">
                                    </div>
                                </div>
                                    
                                <div class="form-group">
                                    <label for="icode" class="col-md-3 control-label">Confirm Password</label>
                                    <div class="col-md-9">
                                        <input type="password" class="form-control" name="signup-password2" id="signup-password2" placeholder="Password">
                                    </div>
                                </div>

                                <div class="form-group">
                                    <!-- Button -->                                        
                                    <div class="col-md-offset-3 col-md-9">
                                        <button id="btn-signup" type="submit" class="btn btn-info"><i class="icon-hand-right"></i> &nbsp Sign Up</button>
                                    </div>
                                </div>
                                
                            </form>
                         </div>
                    </div>

               
               </div>
               </div> 
         </div> 
    </div>
  </div>


<!-- <div class="container"> 
  <div class="row clearfix">
    <div class="col-md-12">
      <div class="login_box">
        <div class='login_title'>
        </div>
        <form class='login_field' name= "login" action= "login_exec.php">
          username: <input type="text" placeholder="username" 
        </form>
        <div class='register_title'>
        </div>
      </div>
    </div>
  </div>
</div>
</body>
</html> -->


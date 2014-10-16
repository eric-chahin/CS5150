f<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Checklist Interactive Login</title>
  <meta name="description" content="">
  <meta name="author" content="">

    <link rel="stylesheet/less" href="less/bootstrap.less" type="text/css">
    <link rel="stylesheet/less" href="less/responsive.less" type="text/css">
    <link rel="stylesheet" type="text/css" href="bootstrap.min.css">
    <script src="js/less-1.3.3.min.js"></script>

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
function validateForm()
{
var a=document.getElementById('fname').value;
var b=document.getElementById('lname').value;
var c=document.getElementById('mname').value;
var d=document.getElementById('address').value;
var e=document.getElementById('contact').value;
var g=document.getElementById('username').value;
var h=document.getElementById('password').value;
if ((a==null || a=="") && (b==null || b=="") && (c==null || c=="") && (d==null || d=="") && (e==null || e==""))
  {
  alert("All Field must be filled out");
  return false;
  }
if (a==null || a=="")
  {
  alert("First name must be filled out");
  return false;
  }
if (b==null || b=="")
  {
  alert("Last name must be filled out");
  return false;
  }
if (c==null || c=="")
  {
  alert("Gender name must be filled out");
  return false;
  }
if (d==null || d=="")
  {
  alert("address must be filled out");
  return false;
  }
if (e==null || e=="")
  {
  alert("contact must be filled out");
  return false;
  }
if (g==null || g=="")
  {
  alert("username must be filled out");
  return false;
  }
if (h==null || h=="")
  {
  alert("password must be filled out");
  return false;
  }
}
</script>
</head>

<body>

<form name="reg" action="code_exec.php" onsubmit="return validateForm()" method="post">
<table width="274" border="0" align="center" cellpadding="2" cellspacing="0">
  <tr>
    <td colspan="2">
		<div align="center">
		<?php 
		$remarks=$_GET['remarks'];
		if ($remarks==null and $remarks=="")
		{
		echo 'Register Here';
		}
		if ($remarks=='success')
		{
		echo 'Registration Success';
		}
		?>	
	    </div></td>
  </tr>
  <tr>
    <td width="95"><div align="right">First Name:</div></td>
    <td width="171"><input type="text" name="fname" id="fname"/></td>
  </tr>
  <tr>
    <td><div align="right">Last Name:</div></td>
    <td><input type="text" name="lname" id="lname"/></td>
  </tr>
  <tr>
    <td><div align="right">Gender:</div></td>
    <td><input type="text" name="mname" id="mname"/></td>
  </tr>
  <tr>
    <td><div align="right">Address:</div></td>
    <td><input type="text" name="address" id="address"/></td>
  </tr>
  <tr>
    <td><div align="right">Contact No.:</div></td>
    <td><input type="text" name="contact" id="contact"/></td>
  </tr>
 <tr>
    <td><div align="right">Username:</div></td>
    <td><input type="text" name="username" id="username"/></td>
  </tr>
 <tr>
    <td><div align="right">Password:</div></td>
    <td><input type="text" name="password" id="password"/></td>
  </tr>
  <tr>
    <td><div align="right"></div></td>
    <td><input name="submit" type="submit" value="Submit" /></td>
  </tr>
</table>
</form>
</body>
</html>
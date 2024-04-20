<?php
	//session_start();
	//include 'sessao.php';
	include_once("../conexao.php"); 
	$result = "SELECT * FROM empresa";
	$resultado = mysqli_query($conn, $result);
	$row_emp = mysqli_fetch_assoc($resultado);
?>
<!DOCTYPE html>
<html lang="pt">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="description" content="">
		<meta name="author" content="">
		<title><?php echo $row_emp['emp_nome']; ?></title>
		<link href="css/bootstrap.min.css" rel="stylesheet">
		<link href="css/font-awesome.min.css" rel="stylesheet">
		<link href="css/prettyPhoto.css" rel="stylesheet">
		<link href="css/price-range.css" rel="stylesheet">
		<link href="css/animate.css" rel="stylesheet">
		<link href="css/main.css" rel="stylesheet">
		<link href="css/responsive.css" rel="stylesheet">
		<link rel="stylesheet" href="style.css">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css">
		<link rel="shortcut icon" href="img/ico/favicon.ico">
		<link rel="apple-touch-icon-precomposed" sizes="144x144" href="images/ico/apple-touch-icon-144-precomposed.png">
		<link rel="apple-touch-icon-precomposed" sizes="114x114" href="images/ico/apple-touch-icon-114-precomposed.png">
		<link rel="apple-touch-icon-precomposed" sizes="72x72" href="images/ico/apple-touch-icon-72-precomposed.png">
		<link rel="apple-touch-icon-precomposed" href="images/ico/apple-touch-icon-57-precomposed.png">
		<link rel="stylesheet" href="css/janelaModal.css">
	</head>
	<body>
		<div class="form-group col-md-12">
			<table border="0" >
				<tr>
					<td rowspan="7" align="center" width="200px"><img src="img/logo.png"/></td>
				</tr>
				<tr>
					<td><b>Razão Social:</b> <?php echo $row_emp['emp_nome']; ?></td>
				</tr>
				<tr>
					<td><b>CNPJ:</b> <?php echo $row_emp['emp_cnpj']; ?></td>
				</tr>
				<tr>
					<td><b>Endereço:</b> <?php echo $row_emp['emp_endereco']; ?>, <?php echo $row_emp['emp_numero']; ?></td>
				</tr>
				<tr>
					<td><b>Bairro:</b> <?php echo $row_emp['emp_bairro']; ?> <b>Município:</b> <?php echo $row_emp['emp_cidade']; ?> / <?php echo $row_emp['emp_estado']; ?></td>
				</tr>
				<tr>
					<td><b>Fone:</b> <?php echo $row_emp['emp_telefone']; ?> <b>- Celular:</b> <?php echo $row_emp['emp_celular']; ?></td>
				</tr>
				<tr>
					<td><b>E-mail:</b> <?php echo $row_emp['emp_email']; ?></td>
				</tr>
			</table>
			<br>
			<div class="form-group col-md-12">
				<h2 class="title text-center"><?php echo $row_emp['emp_nome'];?></h2>
			</div>
		</div>	
	</body>
</html>
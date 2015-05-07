<!DOCTYPE html>
<html>

	<head>
		<meta http-equiv="content-type" content="text/html;charset=UTF-8" />
		<meta charset="utf-8" />
		<title>登录</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
		<meta content="" name="description" />
		<meta content="" name="author" />

		<link href="${ctx}/static/lib/uui/css/u.min.css" rel="stylesheet">
		<link href="${ctx}/static/css/login.css" rel="stylesheet">
	</head>

	<body>
		<div class="container">
			<div class="row">
				<div class="col-md-offset-4 col-md-4 col-sm-offset-4 col-sm-4">
					<form id="login-form" class="login-form" action="${ctx}/login" method="post">
						<div class="row">
							<div class="input-group">
								<div class="input-group-addon glyphicon glyphicon-user"></div>
								<input class="form-control" name="username" id="username" placeholder="用户名">
							</div>
						</div>
						<div class="row">
							<div class="input-group">
								<div class="input-group-addon glyphicon glyphicon-lock"></div>
								<input class="form-control" type="password" id="password" name="password" placeholder="密码">
							</div>
						</div>
						<div class="row">
							<div>
								<button class="btn btn-primary btn-cons pull-right login-btn" type="submit">登陆</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
		<script src="${ctx}/static/lib/jquery/jquery-1.11.2.js"></script>
	</body>

</html>
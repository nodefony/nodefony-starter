

nodefony.registerCommand("mailer", function(){
	
	var mailer = function(container, command, options){
		
		var arg = command[0].split(":");
		this.mailerService = this.container.get("mailer");
		this.ormService = this.container.get("ORM2");
		this.mailerService.notificationsCenter.listen(this, 'EMAIL_SENDED', function(){
			process.exit();
		});
		
		this.ormService.listen(this, 'onOrmReady', function(kernel){
			
			switch ( arg[1] ){
			
				case 'send':
					
					var needed = [];
					
					process.stdout.write('Email (To): \n');
					
					process.stdin.resume();
					process.stdin.setEncoding('utf8');
					
					process.stdin.on('data', function(chunk) {
						
						needed.push(chunk.replace(/\n|\r/gi, ''));
						
						switch(needed.length){
							case 1:
								process.stdout.write('Subject: \n');
								break;
							case 2:
								process.stdout.write('Content: \n');
								break;
							case 3:
								//process.stdin.end();
								var email = new nodefony.mailerMessage()
								.setTo(needed[0])
								.setSubject(needed[1])
								.setText(needed[2])
								this.mailerService.send(email);
								//process.exit();
								break;
						}
					}.bind(this));
	
					
					break;
			}
		}.bind(this));
		
	};
	
	return {
		name:"mailer",
		commands:{
			sendTest:["mailer:send" ,"Send an test email"]
		},
		worker:mailer
	}
	
});

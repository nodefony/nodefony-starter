
nodefony.registerController("mailer", function(){
	
	
	var mailerController = function(container, context){
		this.mother = this.$super;
		this.mother.constructor(container, context);
		
	};
	
	mailerController.prototype.emailAction = function(){
		//console.log('PASSAGE');
		var mailerService = this.get('mailer');
		
		var data = {
			title: "Mr",
			name: "Couscous",
			firstname:	"Boulette",
			demoLink: "http://localhost:5151/login",
			emailtitle: "Présentation du système WEF"
		};
		
		var settings = this.container.getParameters('bundles.mailer').mailer;
		
		var email = new nodefony.mailerMessage();
		data['img'] = email.embed(nodefony.mailerAttachment.fromPath('http://www.nodefony.com/images/pied_page.gif'));
		
		email
		.setTo('benoit.gimmig@nodefony.com')
		.setSubject('Framework WEF')
		.setText(this.renderView("mailerBundle:mails:test.txt.twig", data))
		.setHtml(this.renderView("mailerBundle:mails:test.html.twig", data))
		//.attach(nodefony.mailerAttachment.fromPath('http://www.hadopi.fr/sites/default/files/page/pdf/Rapport_streaming_2013.pdf'))
		.attach(nodefony.mailerAttachment.newInstance('couscous le pingouin', 'bob.txt', 'text/plain'));
		
		mailerService.send(email);

		return this.render('mailerBundle:default:index.html.twig',{name:"bgg"});
	};
	
	return mailerController;
	
});

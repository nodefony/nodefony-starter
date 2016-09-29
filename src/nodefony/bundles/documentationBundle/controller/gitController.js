var Git = require( 'nodegit' );
var Promise = require('promise');

nodefony.registerController("git", function(){


	var gitController = function(container, context){
		this.mother = this.$super;
		this.mother.constructor(container, context);
	};

	gitController.prototype.getStatusAction = function(){
	
		var tab = [] ;
		Git.Repository.open(this.get("kernel").rootDir).then(function(repo) {

			repo.getStatus().then(function(statuses){
				statuses.forEach(function(file){ 
					var obj = {
						path:file.path(),
						type:file.status()
					};
					tab.push(obj)
				});
				this.renderJsonAsync(tab);
			}.bind(this))

		}.bind(this))
		.catch(function (err) {
			this.renderJsonAsync(tab);
		}.bind(this)).done(function () {
  			//console.log('Finished');
		});

	}
	
	gitController.prototype.getMostRecentCommitAction = function(){

		var tab = [] ;
		Git.Repository.open(this.get("kernel").rootDir).then(function(repo) {
  			/* Get the current branch. */
  			return repo.getCurrentBranch().then(function(ref) {
    				/* Get the commit that the branch points at. */
    				return repo.getBranchCommit(ref.shorthand());
  			}).then(function (commit) {
    				/* Set up the event emitter and a promise to resolve when it finishes up. */
    				var hist = commit.history();
        			var p = new Promise(function(resolve, reject) {
            				hist.on("end", resolve);
            				hist.on("error", reject);
        			});
				hist.start();
				return p;
  			}).then(function (commits) {
    				/* Iterate through the last 10 commits of the history. */
    				for (var i = 0; i < 10; i++) {
					tab.push({
						sha:commits[i].sha(),
						msg:commits[i].message(),
						author:commits[i].author().name(),
						date:commits[i].date()
					})
    				}
				this.renderJsonAsync(tab);
  			}.bind(this));
		}.bind(this))
		.catch(function (err) {
			this.renderJsonAsync(tab);
		}.bind(this)).done(function () {
  			//console.log('Finished');
		});

	}

	return gitController;
});




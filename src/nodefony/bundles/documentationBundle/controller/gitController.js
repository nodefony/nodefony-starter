try {
	var Git = require("nodegit");
}catch(e){
	console.trace(e);
}
var Promise = require('promise');

nodefony.registerController("git", function(){


	var gitController = class gitController  extends nodefony.controller {

		constructor(container, context){
			super(container, context);
		};

		getStatusAction (){
		
			var tab = [] ;
			Git.Repository.open(this.get("kernel").rootDir).then((repo)  => {

				repo.getStatus().then( (statuses) => {
					statuses.forEach( (file) => { 
						var obj = {
							path:file.path(),
							type:file.status()
						};
						tab.push(obj)
					});
					this.renderJsonAsync(tab);
				})

			})
			.catch( (err) =>  {
				this.renderJsonAsync(tab);
			}).done(function () {
  				//console.log('Finished');
			});

		}

		getCurrentBranchAction (){
			Git.Repository.open(this.get("kernel").rootDir).then( (repo) => {
				return repo.getCurrentBranch().then( (ref) => {
    					/* Get the commit that the branch points at. */
					return this.renderJsonAsync({
						branch:ref.shorthand()
					});
				})
			})
  			.catch( (err) => {
				this.renderJsonAsync({error:err.getMessage()});
			}).done(function () {
  				//console.log('Finished');
			});
		

		}
		
		getMostRecentCommitAction (){

			var tab = [] ;
			Git.Repository.open(this.get("kernel").rootDir).then( (repo) => {
  				/* Get the current branch. */
  				return repo.getCurrentBranch().then( (ref) => {
    					/* Get the commit that the branch points at. */
    					return repo.getBranchCommit(ref.shorthand());
  				}).then( (commit) => {
    					/* Set up the event emitter and a promise to resolve when it finishes up. */
    					var hist = commit.history();
        				var p = new Promise((resolve, reject) => {
            					hist.on("end", resolve);
            					hist.on("error", reject);
        				});
					hist.start();
					return p;
  				}).then( (commits) => {
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
  				});
			})
			.catch( (err) => {
				this.renderJsonAsync(tab);
			}).done(function () {
  				//console.log('Finished');
			});
		};
	};

	return gitController;
});




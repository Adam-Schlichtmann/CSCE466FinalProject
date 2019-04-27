var app = angular.module('expenseApp', ['ngResource','ngRoute']);


app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/login', {
            templateUrl: 'partials/login-form.html',
            controller: 'loginCtrl'
        })
        .when('/register', {
            templateUrl: 'partials/register-form.html',
            controller: 'registerCtrl'
        })
        .when('/home', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        })
        .when('/add-transaction/:id', {
            templateUrl: 'partials/newTransaction-form.html',
            controller: 'addTranCtrl'
        })
        .when('/transaction/:id', {
            templateUrl: 'partials/update-form.html',
            controller: 'editTranCtrl'
        })
        .when('/transaction/delete/:id', {
            templateUrl: 'partials/post-delete.html',
            controller: 'DeleteTranCtrl'
        })
        .when('/newGroup/:id', {
            templateUrl: 'partials/newGroup-form.html',
            controller: 'newGroupCtrl'
        })
        .otherwise({
            redirectTo: '/login'
        });
}]);

app.controller('HomeCtrl', ['$scope', '$resource', '$location', '$routeParams', '$window', '$timeout',
    function($scope, $resource, $location, $routeParams, $window, $timeout){
        var x = document.getElementById("newChirp");
        x.style.display="block";
        $scope.selectedGroup = "Not Ready";
        //Get single user by ID
        var User = $resource('api/users/:id', {id: '@_id'});
        User.get({id: localStorage['id']}, function(user){
            console.log(user);
            $scope.user = user;
        });
        var UserAll = $resource('api/users/');
        var allUsers=[];
        UserAll.query(function (allUsersTemp){
        	console.log('all users are :');
        	
        	allUsers = allUsersTemp;
        	console.log(allUsers);
        });
        var Transactions = $resource('api/transactions');
        Transactions.query(function(trans){
            console.log(trans);
            var userTrans = []
            for(var k = 0; k < trans.length; k++){
                for(var l = 0; l < $scope.user.groups.length; l++){
                    if(trans[k].group == $scope.user.groups[l]){
                    	var nameHolder = 'Unknown';
                    	
                    	for(var p =0; p<allUsers.length; p++ ){
                    		if(trans[k].from == allUsers[p]._id){
                    			
                    			nameHolder = allUsers[p].name;
                    		}
                    	}
                    	
                        userTrans.push({
                        	trans: trans[k],
                        	authorName: nameHolder

                        });

                    }
                }
            }
            console.log('found');
        	console.log(userTrans);
            $scope.userTrans = userTrans;
        });

        var Group = $resource('api/groups');
        var g = [];
        ng = [];

        setTimeout(function(){
            Group.query( function(group){
            console.log(group);
            
            for(var i = 0; i < group.length; i++){
                var added = false;
                for(var j = 0; j < $scope.user.groups.length; j++){
                    if(group[i]._id == $scope.user.groups[j]){
                        g.push(group[i]);
                        added = true;
                    } 
                }
                if(!added){
                    ng.push(group[i]);
                }
            }
            // groups the user is not in
            $scope.newGroups = ng;
            // groups the user is in
            $scope.groups = g;
            });
        },50);
        

        $scope.addGroup = function(groupID){
            // add group to user
            var User = $resource('/api/users/group/:id', { id:  groupID}, {
                update: { method: 'PUT' }
            });

            User.update({id: groupID}, $scope.user, function(){

            });
            for(var i = 0; i < $scope.newGroups.length; i++){
                if($scope.newGroups[i]._id == groupID){
                    var currentGroup = $scope.newGroups[i];
                }
            }
            // add user to group
            var Group = $resource('/api/groups/:id', { id:  localStorage['id']}, {
                update: { method: 'PUT' }
            });

            Group.update({id: localStorage['id']}, currentGroup, function(){
            });
            $location.path('/home');

        };


        // var modal = document.getElementById('replyBox');
        // var deleteChirpModal = document.getElementById('deleteChirp');
        // window.onclick = function(event) {
        //     if (event.target == modal ||event.target == deleteChirpModal) {
        //         modal.style.display = "none";
        //         deleteChirpModal.style.display="none";
        //     }
        // }

        $scope.deleteChirpBox = function(deleteTransID,from,to){
            var x = document.getElementById("deleteChirp");
            x.style.display="block";
            var Trans = $resource('/api/transactions/:id');
            var transObject ={
            	from: from,
            	to: to
            };
            Trans.get({ id: deleteTransID }, function(trans){
            	transObject.trans = trans;
                $scope.deleteTrans = transObject;
            });
            console.log(transObject);
        }

        $scope.deleteChirp = function(deleteTrans){
            var x = document.getElementById("deleteChirp");
            x.style.display="none";
            //delete from transaction database
            var TransDelete = $resource('/api/transactions/'+deleteTrans.trans._id);
            TransDelete.delete({ id: deleteTrans.trans._id }, function(posts){
                
                $window.location.reload();
            });
            //update user's transaction to user database
            var User = $resource('api/users/:id/:transID', {id: deleteTrans.trans.from, transID: deleteTrans.trans._id }, {
                update: { method: 'PUT' }
            });

	        console.log("new transactions :"+UserToDeleteTrans.transactions);
        }

        // $scope.closeDeleteChirpBox = function(){
        //     var x = document.getElementById("deleteChirp");
        //     x.style.display="none";
        // }

    }]
);


app.controller('newGroupCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){
        $scope.newGroup = function(){
            var Groups = $resource('/api/groups/:userID', {userID: $routeParams.id});
            Groups.save($scope.group, function(group){
                console.log(group);
                $scope.group = group;
            });

            var User = $resource('api/users/:id', {id: '@_id'});
            User.get({id: localStorage['id']}, function(user){
                console.log(user);
                $scope.user = user;
            });

            // put group to user
            setTimeout(function (){
                var Post = $resource('/api/users/group/:id', { id:  $scope.group._id}, {
                    update: { method: 'PUT' }
                });

                // Has to wait so that the post can be gotten and passed in
                Post.update({id: $scope.group._id}, $scope.user, function(){
                    $location.path('/home');
                });
            }, 50);
        };
}]);


app.controller('registerCtrl', ['$scope', '$resource', '$location',
    function($scope, $resource, $location){
        $scope.save = function(){
            var Chirp = $resource('/api/users');
            Chirp.save($scope.users, function(){
                $location.path('/login');
            });
        };
}]);

app.controller('loginCtrl', ['$scope', '$location', '$resource',
    function($scope, $location, $resource){
        var User = $resource('/api/users/:userName',  { userName: '@userName' });
        $scope.save = function(userName,password){
            User.query( function(user){
                var verified = false;
                for (var i = 0; i < user.length; i++){
                    if (user[i].userName == userName){
                        localStorage['id'] = user[i]._id;
                        console.log('User has been saved in the cache');
                        verified = true;
                    }
                }
                if(verified){
                    $location.path('/home');
                } else {
                    $location.path('/');
                }                
            });
        };
    }
]);



app.controller('addTranCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){
        var User = $resource('/api/users');
        User.query(function(users){
            console.log(users);
            var u = [];
            for(var i = 0; i < users.length; i++){
                for(var j = 0; j < users[i].groups.length; j++){
                    if(users[i].groups[j] == $routeParams.id){
                        console.log(users[i]);
                        u.push(users[i]);
                    }
                }
            }
            $scope.users = u;
        });

        $scope.addTran = function (){
            var checked = {
                    to:{userID: null, userName:null},
                    author: localStorage['id'],
                    amount: $scope.amount,
                    group: $routeParams.id
                };
            for(var i = 0; i< $scope.users.length; i++){
                if(document.getElementById($scope.users[i]._id).checked){
                    checked.to.userID = $scope.users[i]._id;
                    checked.to.userName = $scope.users[i].userName;
                }
            }
            var Tran = $resource('/api/transactions/' + $routeParams.id);
            Tran.save(checked, function(trans){
                console.log(trans);
                $scope.trans = trans;
            });

            var User = $resource('api/users/:id', {id: '@_id'},{
                update: { method: 'PUT' }}
            );
            //Get single user by ID
            User.get({id: localStorage['id']}, function(user){
                console.log(user);
                $scope.user = user;
            });
             
            setTimeout(function(){
                User.update({id: $scope.trans._id}, $scope.user, function(){
                    $location.path('/home');
                });
            }, 50);



        }
}]);


// app.controller('DeleteTranCtrl', ['$scope', '$resource', '$location', '$routeParams',
//     function($scope, $resource, $location, $routeParams){
//         var Chirp = $resource('/api/posts/:id');
//         Chirp.get({ id: $routeParams.id }, function(post){
//             $scope.post = post;
//         })
    
//         $scope.delete = function(){
//             Chirp.delete({ id: $routeParams.id }, function(posts){
//                 $location.path('/home');
//             });
//         }
// }]);

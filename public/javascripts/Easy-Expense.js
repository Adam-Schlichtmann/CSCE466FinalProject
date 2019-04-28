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
        .when('/monthReview/:id', {
            templateUrl: 'partials/monthReview.html',
            controller: 'monthReviewCtrl'
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
            $scope.user = user;
        });
        var UserAll = $resource('api/users/');
        var allUsers=[];
        UserAll.query(function (allUsersTemp){
        	
        	allUsers = allUsersTemp;
            var Transactions = $resource('api/transactions');
            Transactions.query(function(trans){
                var userTrans = []
                for(var k = 0; k < trans.length; k++){
                    for(var l = 0; l < $scope.user.groups.length; l++){
                        if(trans[k].group == $scope.user.groups[l]){
                            var nameHolder = 'Unknown';
                            var toholder = "";
                            for(var p =0; p<allUsers.length; p++ ){
                                if(trans[k].from == allUsers[p]._id){
                                    nameHolder = allUsers[p].name;
                                }
                            }
                            for(var h = 0; h <trans[k].to.length; h++){
                                for(var g =0; g<allUsers.length; g++ ){
                                    if(trans[k].to[h].userID == allUsers[g]._id){
                                        toholder += allUsers[g].name + ", "
                                    }
                                }
                            }
                            
                            userTrans.push({
                                trans: trans[k],
                                authorName: nameHolder,
                                to: toholder.substring(0, toholder.length -2)
    
                            });
    
                        }
                    }
                }
                $scope.userTrans = userTrans;
            });
        });
       

        var Group = $resource('api/groups');
        var g = [];
        ng = [];

        setTimeout(function(){
            Group.query( function(group){
            
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
        var deleteChirpModal = document.getElementById('deleteChirp');
        window.onclick = function(event) {
            if (event.target == deleteChirpModal) {
                modal.style.display = "none";
                deleteChirpModal.style.display="none";
            }
        }

        $scope.deleteChirpBox = function(deleteTransID,from,to,amount,authorID){
            var x = document.getElementById("deleteChirp");
            x.style.display="block";
            var transObject = {
                _id: deleteTransID,
                authorID: authorID,
            	from: from,
                to: to,
                amount: amount
            };
            $scope.deleteTrans = transObject;
            console.log($scope.deleteTrans);
        }

        $scope.deleteChirp = function(deleteTrans){
            var x = document.getElementById("deleteChirp");
            x.style.display="none";
            
            //delete from transaction database
            var TransDelete = $resource('/api/transactions/'+deleteTrans._id);
            TransDelete.delete({ id: deleteTrans._id }, function(){
                
               
            });
            //update user's transaction to user database
            var User = $resource('api/users/:id', {id: '@_id'});
            User.get({id: localStorage['id']}, function(user){
                var Us = $resource('api/users/remove/:id', {id: deleteTrans._id}, {
                    update: { method: 'PUT' }
                });
    
                Us.update({id: deleteTrans._id}, user, function(){
                    $window.location.reload();
                });
            });
        }

        $scope.closeDeleteChirpBox = function(){
            var x = document.getElementById("deleteChirp");
            x.style.display="none";
        }

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



// ++++++++++++++++++++++++++++++MONTH REVIEW+++++++++++++++++++++++++++++++++++

app.controller('monthReviewCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){
        var User = $resource('api/transactions/:id', {id: '@group'});
        User.query({id: $routeParams.id}, function(transactions){
            $scope.transactions = transactions;
        });

        var User = $resource('api/groups/:id', {id: '@_id'});
        User.get({id: $routeParams.id}, function(group){
            $scope.group = group;
            var User = $resource('api/users/group/:id');
            User.query({id: $scope.group.members}, function(users){
                $scope.users = users;

                // =====================Calculate end of month=================
                
                var result = [];

                for (var i = 0; i<$scope.users.length; i++){
                    result[i] = [];
                    for(var j = 0; j<$scope.users.length; j++){
                        result[i].push({user: $scope.users[j]._id, amount: 0});
                    }
                }
                
                for (var i = 0; i<$scope.transactions.length; i++){
                    for(var j = 0; j<$scope.transactions[i].to.length; j++){
                        for(var k = 0; k<$scope.users.length; k++){
                            // user k is being charged amount/to.length
                            if($scope.transactions[i].to[j] == $scope.users[k]._id){
                                for (var l = 0; l<result[k].length; l++){
                                    if(k!=l){
                                        if(result[k][l].user == $scope.transactions[i].from){
                                            result[k][l].amount += $scope.transactions[i].amount/$scope.transactions[i].to.length;
                                            break;
                                        }
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
                var formatted = []
                for(var i = 0; i< result.length; i++){
                    for(var j = i; j< result.length; j++){
                        if(i!=j){
                            if(result[i][j].amount > result[j][i].amount){
                                formatted.push({
                                    amount: result[i][j].amount - result[j][i].amount,
                                    from: result[i][j].user,
                                    to: result[j][i].user
                                })
                            } else if (result[i][j].amount < result[j][i].amount){
                                formatted.push({
                                    amount: result[j][i].amount - result[i][j].amount,
                                    from: result[j][i].user,
                                    to: result[i][j].user
                                })
                            }
                        }
                    }
                }
                for(var i = 0; i < formatted.length;i ++){
                    for(var j = 0; j < $scope.users.length; j++){
                        if(formatted[i].to == $scope.users[j]._id){
                            formatted[i].to = $scope.users[j].name;
                        } else if (formatted[i].from == $scope.users[j]._id){
                            formatted[i].from = $scope.users[j].name;
                        }  
                    }
                }
                $scope.results = formatted;
                // =====================Calculate end of month=================
            });
            
        });
    }]
);

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
            console.log($scope.users);
        });

        $scope.addTran = function (){
                var to = [];
            for(var i = 0; i< $scope.users.length; i++){
                console.log($scope.users[i]._id);
                console.log(document.getElementById($scope.users[i]._id).checked);
                if(document.getElementById($scope.users[i]._id).checked){
                    var holder = {};
                    holder.userID = $scope.users[i]._id;
                    holder.name = $scope.users[i].name;
                    console.log(holder);
                    to.push(holder);
                    console.log(to)
                }
            }
            var checked = {
                to: to,
                author: localStorage['id'],
                amount: $scope.amount,
                group: $routeParams.id
            };

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

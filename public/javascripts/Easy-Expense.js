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
        .when('/add-trans', {
            templateUrl: 'partials/post-form.html',
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
        .otherwise({
            redirectTo: '/login'
        });
}]);

app.controller('HomeCtrl', ['$scope', '$resource', '$location', '$routeParams', '$window', '$timeout',
    function($scope, $resource, $location, $routeParams, $window, $timeout){
        var x = document.getElementById("newChirp");
        x.style.display="block";
        var User = $resource('/api/users');
        User.query( function(userl){
            for (var i = 0; i < userl.length; i++){
                if (userl[i]._id == localStorage['id']){
                    var user = userl[i];
                    $scope.profileName = user.userName;
                    $scope.profileID= user._id;
                    $scope.followers = user.following.length;
                    $scope.favs = user.favorites;
                    userl.splice(i,1);
                }
            }
            $scope.user = user;
            for (var j = 0; j < user.following.length; j++){
                for (var k = 0; k < userl.length; k++){
                    if (user.following[j] == userl[k]._id){
                        userl.splice(k,1);
                    }
                }
            }
            while (userl.length > 3){
                var x = Math.floor(Math.random() * userl.length);
                userl.splice(x,1);
            }
            $scope.newUsers = userl;
        });
        
        // // modify the posts to get correct posts for user
        var Post = $resource('/api/posts');

        Post.query(function(po){
            $scope.temp = po;
            var posts = []
            for (var i = 0; i < $scope.temp.length; i++){
                for(var l = 0; l < 1; l++){
                    var added = false;
                    if ( $scope.temp[i].replyHead != undefined){
                        break;
                    }
                    if ( $scope.temp[i].author == localStorage['id']){
                        posts.push($scope.temp[i]);
                        added = true;
                        break;
                    } 
                    
                    for ( var j = 0; j < $scope.user.favorites.length; j++){
                        if ($scope.user.favorites[j] == $scope.temp[i].id){
                            posts.push($scope.temp[i]);
                            added = true;
                            break;
                        }
                    }
                    if(added){
                        break;
                    }
                    for(var k = 0; k < $scope.user.following.length; k++){
                        if($scope.temp[i].author == $scope.user.following[k]){
                            posts.push($scope.temp[i]);
                            added = true;
                            break
                        }
                    }
                }
            }
            User.query( function(allUsers){
                $scope.allUsers = allUsers;
            });
            // sort by date
            posts.sort(function(a,b){
                a = new Date(a.date);
                b = new Date(b.date);
                return a>b ? -1 : a<b ? 1 : 0;
            });

            // check admin permissions
            if ($scope.user.admin){
                $scope.tempPost = $scope.temp;
            } else {
                $scope.tempPost = posts;
            }
            setTimeout(function(){
                var tempP = $scope.tempPost;
                for(var i = 0; i < tempP.length; i++){
                    for(var j = 0; j < $scope.allUsers.length; j++){
                        if (tempP[i].author == $scope.allUsers[j]._id){
                            tempP[i]['userName'] = $scope.allUsers[j].userName;
                            break;
                        }
                    }
                }
                $scope.posts = tempP;
                console.log($scope.posts)
            }, 50);
            $timeout(function() {}, 100);
           
        });


        $scope.newPost = function(){
            console.log("creating new post");
            console.log($scope.newPost.content);
            var n = {content: $scope.newPost.content};
            var Chirp = $resource('/api/posts/' + localStorage['id']);
            Chirp.save(n, function(){
                $window.location.reload();
            });
        };


        var modal = document.getElementById('replyBox');
        var deleteChirpModal = document.getElementById('deleteChirp');
        window.onclick = function(event) {
            if (event.target == modal ||event.target == deleteChirpModal) {
                modal.style.display = "none";
                deleteChirpModal.style.display="none";
            }
        }

        $scope.deleteChirpBox = function(deleteChirpID){
            var x = document.getElementById("deleteChirp");
            x.style.display="block";
            console.log($scope.newReply);
            var Chirp = $resource('/api/posts/:id');
            Chirp.get({ id: deleteChirpID }, function(post){
                $scope.deletePost = post;
            });
        }

        $scope.deleteChirp = function(deleteChirpID){
            var x = document.getElementById("deleteChirp");
            x.style.display="none";
            var ChirpDelete = $resource('/api/posts/'+deleteChirpID);
            ChirpDelete.delete({ id: deleteChirpID }, function(posts){
                
                $window.location.reload();
            });
        }

        $scope.closeDeleteChirpBox = function(){
            var x = document.getElementById("deleteChirp");
            x.style.display="none";
        }

    }]
);


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
}]);

app.controller('editTranCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){
        
        var Chirp = $resource('/api/posts/:id', { id: '@_id' }, {
            update: { method: 'PUT' }
        });

        Chirp.get({ id: $routeParams.id }, function(posts){
            $scope.posts = posts;
        });
        
        $scope.save = function(){
            Chirp.update($scope.posts, function(){
                $location.path('/home');
            });
        }
    }]
);

app.controller('DeleteTranCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){
        var Chirp = $resource('/api/posts/:id');
        Chirp.get({ id: $routeParams.id }, function(post){
            $scope.post = post;
        })
    
        $scope.delete = function(){
            Chirp.delete({ id: $routeParams.id }, function(posts){
                $location.path('/home');
            });
        }
}]);

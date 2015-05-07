var db = null;

angular.module('starter.controllers', ['ionic'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})


.controller("ConfigController", function($scope, $ionicPlatform, $ionicLoading, $location, $ionicHistory, $cordovaSQLite) {
    $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
    });
    $ionicPlatform.ready(function() {
        $ionicLoading.show({ template: 'Loading...' });
        if(window.cordova) {
            window.plugins.sqlDB.copy("populated.db", function() {
                db = $cordovaSQLite.openDB("populated.db");
                $location.path("/categories");
                $ionicLoading.hide();
            }, function(error) {
                console.error("There was an error copying the database: " + error);
                db = $cordovaSQLite.openDB("populated.db");
                $location.path("/categories");
                $ionicLoading.hide();
            });
        } else {
            db = openDatabase("websql.db", '1.0', "My WebSQL Database", 2 * 1024 * 1024);
            db.transaction(function (tx) {
                tx.executeSql("DROP TABLE IF EXISTS tblCategories");
                tx.executeSql("CREATE TABLE IF NOT EXISTS tblCategories (id integer primary key, category_name text)");
                tx.executeSql("CREATE TABLE IF NOT EXISTS tblTodoLists (id integer primary key, category_id integer, todo_list_name text)");
                tx.executeSql("CREATE TABLE IF NOT EXISTS tblTodoListItems (id integer primary key, todo_list_id integer, todo_list_item_name text)");
                tx.executeSql("INSERT INTO tblCategories (category_name) VALUES (?)", ["Shoppinglists"]);
           });
            $location.path("/categories");
            $ionicLoading.hide();
        }
    });
})

.controller("CategoriesController", function($scope, $ionicPlatform, $cordovaSQLite) {
 $scope.categories = [];
 
    $ionicPlatform.ready(function() {
        var query = "SELECT id, category_name FROM tblCategories";
        $cordovaSQLite.execute(db, query, []).then(function(res) {
            if(res.rows.length > 0) {
                for(var i = 0; i < res.rows.length; i++) {
                    $scope.categories.push({id: res.rows.item(i).id, category_name: res.rows.item(i).category_name});
                }
            }
        }, function (error) {
            console.error(error);
        });
    });

})

.controller("ListsController", function($scope, $ionicPlatform, $ionicPopup, $cordovaSQLite, $stateParams) {
  $scope.lists = [];
 
    $ionicPlatform.ready(function() {
        var query = "SELECT id, category_id, todo_list_name FROM tblTodoLists where category_id = ?";
        $cordovaSQLite.execute(db, query, [$stateParams.categoryId]).then(function(res) {
            if(res.rows.length > 0) {
                for(var i = 0; i < res.rows.length; i++) {
                    $scope.lists.push({id: res.rows.item(i).id, category_id: res.rows.item(i).category_id, todo_list_name: res.rows.item(i).todo_list_name});
                }
            }
        }, function (err) {
            console.error(err);
        });
    });
 
    $scope.insert = function() {
        $ionicPopup.prompt({
            title: 'Add a new Shoppinglist',
            inputType: 'text'
        })
        .then(function(result) {
            if(result !== undefined) {
                var query = "INSERT INTO tblTodoLists (category_id, todo_list_name) VALUES (?,?)";
                $cordovaSQLite.execute(db, query, [$stateParams.categoryId, result]).then(function(res) {
                    $scope.lists.push({id: res.insertId, category_id: $stateParams.categoryId, todo_list_name: result});
                }, function (err) {
                    console.error(err);
                });
            } else {
                console.log("Action not completed");
            }
        });
    }
    $scope.delete = function(item) {
      var outerquery = "DELETE FROM tblTodoListItems where todo_list_id = ?";
      var innerquery = "DELETE FROM tblTodoLists where id = ?";
      $cordovaSQLite.execute(db, outerquery, [item.id]).then(function(res) {
          $cordovaSQLite.execute(db, innerquery, [item.id]).then(function(res) {
              $scope.lists.splice($scope.lists.indexOf(item), 1);
          });
      }, function (err) {
          console.error(err);
      });
    }
})
.controller("ItemsController", function($scope, $ionicPlatform, $ionicPopup, $cordovaSQLite, $stateParams) {
   $scope.items = [];
 
    $ionicPlatform.ready(function() {
        var query = "SELECT id, todo_list_id, todo_list_item_name FROM tblTodoListItems where todo_list_id = ?";
        $cordovaSQLite.execute(db, query, [$stateParams.listId]).then(function(res) {
            if(res.rows.length > 0) {
                for(var i = 0; i < res.rows.length; i++) {
                    $scope.items.push({id: res.rows.item(i).id, todo_list_id: res.rows.item(i).todo_list_id, todo_list_item_name: res.rows.item(i).todo_list_item_name});
                }
            }
        }, function (err) {
            console.error(err);
        });
    });
 
    $scope.insert = function() {
        $ionicPopup.prompt({
            title: 'Add an item to this list',
            inputType: 'text'
        })
        .then(function(result) {
            if(result !== undefined) {
                var query = "INSERT INTO tblTodoListItems (todo_list_id, todo_list_item_name) VALUES (?,?)";
                $cordovaSQLite.execute(db, query, [$stateParams.listId, result]).then(function(res) {
                    $scope.items.push({id: res.insertId, todo_list_id: $stateParams.listId, todo_list_item_name: result});
                }, function (err) {
                    console.error(err);
                });
            } else {
                console.log("Action not completed");
            }
        });
    }
    $scope.delete = function(item) {
        var query = "DELETE FROM tblTodoListItems where id = ?";
        $cordovaSQLite.execute(db, query, [item.id]).then(function(res) {
            $scope.items.splice($scope.items.indexOf(item), 1);
    },    function (err) {
            console.error(err);
    });
  }
});
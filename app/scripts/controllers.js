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

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})
.controller('ListCtrl', function($scope, $ionicPopup){
 $scope.showPopup = function() {
  $scope.data = {}
  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    template: '<input type="text" ng-model="data.name">',
    title: 'New Shopping List',
    subTitle: 'Please enter a name for your list',
    scope: $scope,
    buttons: [      
      {
        text: 'Add',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.data.name) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
            return $scope.data.name;
          }
        }
      }
    ,{ text: 'Cancel',
    type: 'button-assertive' }]
  });
  myPopup.then(function(res) {
    console.log('Tapped!', res);
  });
}
})
.controller('ItemCtrl', function($scope, $ionicPopup, $stateParams) {
  $scope.items = [];
  $scope.updateItems = function(items) {
  /*cList = storage.get('cList');
  storage.set(cList.name+'items', items);  */
   var alertPopup = $ionicPopup.alert({
     /*title: 'Update',*/
     template: 'Your current list has been updated'
   });
   alertPopup.then(function(res) {
     console.log('Update Successfull');
   });
 };
   $scope.showPopup = function() {
  $scope.data = {}
  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    template: '<input type="text" ng-model="data.name">',
      title: 'Enter name for item',
      scope: $scope,
      buttons: [{
        text: '<b>Add</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.data.name) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
            return $scope.data.name;
          }
        }
      }
    ,{ text: 'Cancel',
    type: 'button-assertive' }]
  });
  myPopup.then(function(res) {
    console.log('Tapped!', res);
  });
}
})
.controller('PlaylistCtrl', function($scope, $stateParams) {
})
.controller("ExampleController", function($scope, $cordovaSQLite) {
 
    $scope.insert = function(firstname, lastname) {
        var query = "INSERT INTO people (firstname, lastname) VALUES (?,?)";
        $cordovaSQLite.execute(db, query, [firstname, lastname]).then(function(res) {
            console.log("INSERT ID -> " + res.insertId);
        }, function (err) {
            console.error(err);
        });
    }
 
    $scope.select = function(lastname) {
        var query = "SELECT firstname, lastname FROM people WHERE lastname = ?";
        $cordovaSQLite.execute(db, query, [lastname]).then(function(res) {
            if(res.rows.length > 0) {
                console.log("SELECTED -> " + res.rows.item(0).firstname + " " + res.rows.item(0).lastname);
            } else {
                console.log("No results found");
            }
        }, function (err) {
            console.error(err);
        });
    }
 
});
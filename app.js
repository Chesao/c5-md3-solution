(function () {
'use strict';

angular.module("NarrowItDownApp",[])
.controller("NarrowItDownController",NarrowItDownController)
.service("MenuSearchService", MenuSearchService)
.directive("foundItems", FoundItemsDirective)
;


function FoundItemsDirective() {
    var ddo = {
      templateUrl: 'foundItems.html',
      scope: {
        found: '<',
        onRemove: '&'
      }
    };
  
    return ddo;
}


NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(service) {
    var ctrl = this;

    ctrl.found = [null];
    ctrl.found.length = 1;
    
    ctrl.searchMenu = function (searchTerm) {

        if (searchTerm=="") {
            ctrl.found = [];
            return;
        }

        var promise = service.getMatchedMenuItems();

        promise
        .then(function (response) {
            console.log("Response: ", response);
            var menu_items = response.data.menu_items;
            ctrl.found = [];
            for (var i = 0; i < menu_items.length; i++) {
                if (menu_items[i].description.indexOf(searchTerm) == -1) {
                    //console.log("skipped: ", menu_items[i].name);
                    continue;
                }
                else {
                    // console.log("found and add: ", menu_items[i].name);
                    ctrl.found.push(menu_items[i]);
                }
            }
        })
        .catch(function (error) {
            console.log("HTTP Error: ", error);
        });

    };

    ctrl.removeItem = function (index) {
        console.log("remove item from ctrl", index);
        ctrl.found.splice(index,1);
    };
}

MenuSearchService.$inject = ['$http'];
function MenuSearchService($http) {
    var service = this;

    // get menu items from the server
    service.getMatchedMenuItems = function () {
        var response =  $http({
            url: 'https://davids-restaurant.herokuapp.com/menu_items.json'
        });
        return response;
    };
}

})();

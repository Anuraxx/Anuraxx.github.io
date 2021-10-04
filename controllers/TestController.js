var app = angular.module("test", []);

app.controller('testc', function($scope){
    console.log("test controller working");
    let count=0;
    $scope.refresh = function(){
        let searchResults;
        if(count==0){
            searchResults = ["anurag","boby","lily","zeneith","cryzal"];
            count++;
        }else{
            searchResults = ["1","2","3","4","5"];
        }

        $scope.searchResults=searchResults;

    }
});
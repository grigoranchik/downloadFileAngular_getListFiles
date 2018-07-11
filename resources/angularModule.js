var myApp = angular.module("mainModule", [])
    .controller("mainController", ['$scope', '$http', function ($scope, $http) {


        $scope.modelPassword;
        $scope.password;
        $scope.submitResult;

        var bar;

        $scope.$watch(function () {
            return  $scope.modelPassword;
        }, function (new_, old_) {
            $scope.password = new_;
        })

        $scope.getFile = function (event) {
            bar = event.files[0];
            //debugger;
        };

        $scope.submitData = function () {
            if ($scope.password == undefined || bar == undefined) {
                return;
            }
            var formData = new FormData();

            if($scope.password == undefined){
                $scope.password = prompt('Введите пароль');
            }
            formData.append("password", $scope.password);
            formData.append("myFile", bar);

            $http.post('/index/sendFile', formData, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(function (data, status, headers, config) {
                alert(data);
            }).error(function (data, status, headers, config) {
                //debugger;
                console.log("SUBMIT ERROR " + data);
            });

        };

        $scope.getListFiles = function () {
            if($scope.password == undefined){
                $scope.password = prompt('Введите пароль');
            }

            $http.get('/index/listOfFiles/' + $scope.password.toString()).success(function (response) {
                $scope.submitResult = response.massOfFiles;
                //debugger;
            }).error(function (data, status, headers, config) {
                alert(data);
            });

        }
    }]);
myApp.directive('fileRead', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    scope.fileread = changeEvent.target.files[0];
                    debugger;
                    // changeEvent.target.files[0] is an HTML5 file object which contains ALL
                    // information about the file including fileName, contents,...
                    // scope.fileread is now assigned the selected file
                });
            });
        }
    };
}]);
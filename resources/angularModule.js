var myApp = angular.module("mainModule", [])
    .controller("mainController", ['$scope', '$http', function ($scope, $http) {


        $scope.modelPassword;
        $scope.submitResult;

        var bar;
        $scope.getFile = function (event) {
            bar = event.files[0];
            //debugger;
        };

        $scope.submitData = function () {
            if ($scope.modelPassword == undefined || bar == undefined) {
                return;
            }
            var formData = new FormData();
            formData.append("password", $scope.modelPassword);
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
            var pass = prompt('Введите пароль?');
            if (pass== ''){pass="_"};

            $http.get('/index/listOfFiles/' + pass.toString()).success(function (response) {
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
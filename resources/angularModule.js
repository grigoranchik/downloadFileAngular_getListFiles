angular.module("mainModule", [])
    .controller("mainController",
        function ($scope, $http) {
            $scope.person1 = {};
            $scope.person2 = {};
            $scope.person3 = {};


            $scope.submitData = function (person, resultVarName) {
                //debugger;
                var config = {
                    params: {
                        person: person
                    }
                };

                $http.post("/index/sendFile/", null, config)
                    .success(function (data, status, headers, config) {
                        //debugger
                        $scope[resultVarName] = data;
                    })
                    .error(function (data, status, headers, config) {
                        $scope[resultVarName] = "SUBMIT ERROR";
                    });
            };
        });
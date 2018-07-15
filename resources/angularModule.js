var myApp = angular.module("mainModule", [])
    .controller("mainController", ['$scope', '$http', '$q', function ($scope, $http, $q) {

        $scope.modelPassword;
        $scope.password;
        $scope.submitResult = [];
        $scope.inputFilesToSend;
        $scope.onprogress = 0;
        
        $scope.delFile = function (val) {
            $scope.submitResult.splice($scope.submitResult.indexOf(val), 1);
        }

        $scope.$watch(function () {
            return  $scope.modelPassword;
        }, function (new_, old_) {
            $scope.password = new_;
        })

        $scope.submitData = function () {
            //debugger;

            if ($scope.inputFilesToSend == undefined) {
                alert('Выберите файл для отправки');
                return;
            }
            if($scope.password == undefined){
                $scope.password = prompt('Введите пароль');
            }

            var formData = new FormData();
            formData.append("password", $scope.password);
            for(var key = 0; key < $scope.inputFilesToSend.length; key++){
                var it = $scope.inputFilesToSend[key].name;
                formData.append(it, $scope.inputFilesToSend[key]);
                //debugger;
            }
            $scope.ajaxGo(formData);
        };

        $scope.ajaxGo = function (formData) {
            $.ajax({
                url: '/index/sendFile',
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    console.log(response);
                    $scope.$emit('switchOffProgressBar');
                    $scope.inputFilesToSend = undefined;
                    //debugger;
                },
                xhr: function () {
                    var xhr = $.ajaxSettings.xhr();

                    if (xhr.upload) {
                        console.log('xhr upload');

                        xhr.upload.onprogress = function (e) {
                            file.progressDone = e.position || e.loaded;
                            file.progressTotal = e.totalSize || e.total;
                            $scope.$apply(function() {
                                $scope.onprogress= Math.floor(file.progressDone / file.progressTotal * 1000) / 10;
                            });

                        };
                    }
                    return xhr;
                }
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

myApp.directive('fileRead', ['$parse', '$timeout', function ($parse, $timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.onprogress = 0;
                //debugger;
                if(changeEvent.target.files.length != 0){
                    $('.container').show("slow");
                }else{
                    $('.container').hide(300);
                }
                scope.$apply(function () {
                    if(changeEvent.target.files.length != 0){
                        scope.inputFilesToSend = changeEvent.target.files;
                    }
                });
                scope.$on('switchOffProgressBar', function (event, data) {
                    $timeout(function(){
                        return $('.container').hide(500)}, 2000);
                });
            });
        }
    };
}]);


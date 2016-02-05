app.controller('ProductsCtrl', function ($scope, Product, $modal, ngProgress, toaster) {

    $scope.product = new Product();

    var refresh = function () {
        $scope.products = Product.query();
        $scope.product = "";
    }
    refresh();

    $scope.add = function (product) {
        Product.save(product, function (product) {
            refresh();
        });
    };

    $scope.update = function (product) {
        product.$update(function () {
            refresh();
        });
    };

    $scope.remove = function (product) {
        product.$delete(function () {
            refresh();
        });
    };

    $scope.edit = function (id) {
        $scope.product = Product.get({id: id});
    };

    $scope.deselect = function () {
        $scope.product = "";
    }

    //$scope.animationsEnabled = true;

    $scope.animationsEnabled = true;

    $scope.open = function (size) {

        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                products: function () {
                    return Product;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };
});

app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, products) {

    $scope.products = products;
    /*$scope.selected = {
        item: $scope.items[0]
    };*/

    $scope.ok = function (product) {
        products.save(product, function (product) {
            refresh();
        });
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
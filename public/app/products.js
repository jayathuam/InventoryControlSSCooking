app.controller('ProductsCtrl', function ($scope, Product, $modal, $sce, ngProgress, toaster) {

    $scope.product = new Product();

    var refresh = function () {
        $scope.products = Product.query();
        $scope.product = "";
    };
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
        return Product.get({id: id});
    };

    $scope.deselect = function () {
        $scope.product = "";
    };

    //$scope.animationsEnabled = true;

    $scope.animationsEnabled = true;

    //$scope.searchText = false;

    $scope.getAllInactiveItem = function () {
        $scope.products =Product.query({'status': 'false'});
        $scope.product = "";
    };

    $scope.getAllActiveItem = function () {
        $scope.products =Product.query({'status': 'true'});
        $scope.product = "";
    };

    $scope.getAll = function(){
      refresh();
    };

    $scope.outOfStock = function(){
        $scope.products =Product.query({'stock': '0'});
        $scope.product = "";
    };

    $scope.getMinStock = function(){
        $scope.products = [];
        Product.query("",function(data,err){
            for(var i=0;i<data.length;i++){
                if(data[i].stock < data[i].minStock){
                    $scope.products.push(data[i]);
                }
            }
        });
        $scope.product = "";
    };

    $scope.backupDB = function (){
        var array = [];
        Product.query("",function(data,err){
            for(var i=0;i<data.length;i++){
                var jsonObject = {};
                jsonObject.itemID = (data[i].itemID == undefined) ? "" : data[i].itemID;
                jsonObject.name = (data[i].name == undefined) ? "" : data[i].name;
                jsonObject.stock = (data[i].stock == undefined) ? "" : data[i].stock;
                jsonObject.country = (data[i].country == undefined) ? "" : data[i].country;
                jsonObject.minStock = (data[i].minStock == undefined) ? "" : data[i].minStock;
                jsonObject.weight = (data[i].weight == undefined) ? "" : data[i].weight;
                jsonObject.supName = (data[i].supName == undefined) ? "" : data[i].supName;
                jsonObject.purchasingPrice = (data[i].purchasingPrice == undefined) ? "" : data[i].purchasingPrice;
                jsonObject.sellingPrice = (data[i].sellingPrice == undefined) ? "" : data[i].sellingPrice;
                jsonObject.status = (data[i].status == undefined) ? "" : data[i].status;
                jsonObject.description = (data[i].description == undefined) ? "" : data[i].description;
                jsonObject.insertDate = (data[i].insertDate == undefined) ? "" : data[i].insertDate;
                array.push(jsonObject);
            }
            JSONToCSVConvertor(array, "SSD Inventory", true);
        });

    };

    $scope.open = function (size) {
        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                products: function () {
                    return Product;
                },
                parentScope: function () {
                    return $scope;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    //delete model instance
    $scope.openDeleteModel = function (produ) {
        var deleteModalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'DeleteItem.html',
            controller: 'ModalDeleteCtrl',
            size: 'sm',
            resolve: {
                product: function () {
                    return produ;
                },
                parentScope: function () {
                    return $scope;
                }
            }
        });

        deleteModalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    //info model
    $scope.openInfoModel = function (produ) {
        var deleteModalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'itemInformationModel.html',
            controller: 'ModalItemInfoCtrl',
            resolve: {
                product: function () {
                    return produ;
                },
                parentScope: function () {
                    return $scope;
                }
            }
        });

        deleteModalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };


//update Model

    $scope.openUpdateModel = function (produ) {
        var deleteModalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'itemUpdateModel.html',
            controller: 'ModelItemUpdateControl',
            resolve: {
                id: function () {
                    return produ;
                },
                parentScope: function () {
                    return $scope;
                }
            }
        });

        deleteModalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };

});
app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, products, parentScope) {

    $scope.products = products;
    /* $scope.selected = {
     item: $scope.items[0]
     };*/
    var refresh = function () {
        parentScope.products = products.query();
        $scope.product = "";
    };
    $scope.ok = function (product) {
        product.insertDate = $scope.dt;
        products.save(product, function (product) {
            refresh();
        });
        $modalInstance.close();
    };

    $scope.cancel = function () {
        console.log("close");
        $modalInstance.dismiss('cancel');
    };

    //------
    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function (date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function () {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();
    $scope.maxDate = new Date(2020, 5, 22);

    $scope.open = function ($event) {
        $scope.status.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    $scope.status = {
        opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 2);
    $scope.events =
        [
            {
                date: tomorrow,
                status: 'full'
            },
            {
                date: afterTomorrow,
                status: 'partially'
            }
        ];

    $scope.getDayClass = function (date, mode) {
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }
        return '';
    };
});

app.controller('ModalDeleteCtrl', function ($scope, $modalInstance, product, parentScope) {

    $scope.remove = function () {
        console.log(product);
        parentScope.remove(product);
        $modalInstance.close();
    };

    $scope.cancel = function () {
        console.log("close");
        $modalInstance.dismiss('cancel');
    };

});

app.controller('ModalItemInfoCtrl', function ($scope, $modalInstance, product, parentScope) {
    var date = new Date(product.insertDate);
    var dateString = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
    product.setDate = dateString;
    $scope.product = product;
    $scope.cancel = function () {
        console.log("close");
        $modalInstance.dismiss('cancel');
    };

});

app.controller('ModelItemUpdateControl', function ($scope, $modalInstance, id, parentScope) {
    $scope.product = parentScope.edit(id);
    $scope.cancel = function () {
        console.log("close");
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        $scope.product.insertDate = $scope.dt;
        parentScope.update($scope.product);
        /*product.insertDate = $scope.dt;
         parentScope.update($scope.product);*/
        $modalInstance.close();
    };
//-----------------
    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function (date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function () {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();
    $scope.maxDate = new Date(2020, 5, 22);

    $scope.open = function ($event) {
        $scope.status.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    $scope.status = {
        opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 2);
    $scope.events =
        [
            {
                date: tomorrow,
                status: 'full'
            },
            {
                date: afterTomorrow,
                status: 'partially'
            }
        ];

    $scope.getDayClass = function (date, mode) {
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }
        return '';
    };

});
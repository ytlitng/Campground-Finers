(function() {
    'use strict';

    angular
        .module('app')
        .controller('CampController', CampController);

    CampController.$inject = ['$http', 'toastr'];

    /* @ngInject */
    function CampController($http, toastr) {
        var vm = this;
        vm.history = [];


        vm.fetch = function(searchTerm) {
            $http.get('http://api.openweathermap.org/data/2.5/weather?q=' + searchTerm +
                '&units=imperial&apiKey=6b9616f97977b35c30ee173d78c879e6').then(function(response) {
                vm.data = response.data;
                vm.searchTerm = '';

            })
            // below function take return from weather API (lat and long) of entered city
            // and send this to Active API to then return list of campgrounds in that area.
            vm.LatLon = function(data) {
                    $http.get('https://www.reserveamerica.com/campgroundSearch.do?' + data.coord.lat.lon +
                            '&v=JSON&expwith=1&amenity=4005&pets=3010&xml=true&expwith=1&expfits=1')
                        .then(function(response) {
                            vm.campGround = response.data;
                            vm.searchTerm = '';
                            vm.history.push({
                                name: response.agencyName,


                            })
                        })

                    toastr.success('Congrats you picked a great city!')
                },
                function(error) {
                    toastr.error('you have an error')
                }
        }
    }
});

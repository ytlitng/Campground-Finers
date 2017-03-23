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
        // we are storing a 2D array of sites with their codes for Active API.
        vm.sites = [
            ['RV Sites', 2001],
            ['Cabins or Lodgings', 10001],
            ['Tent', 2003],
            ['Trailer', 2002],
            ['Group Site', 9002],
            ['Day Use', 9001],
            ['Horse Site', 3001],
            ['Boat Site', 2004]
        ];

        vm.fetch = fetch;
        vm.LatLon = LatLon;

        function fetch(searchTerm) {
            $http
                .get('http://api.openweathermap.org/data/2.5/weather?q=' + searchTerm + '&units=imperial&apiKey=6b9616f97977b35c30ee173d78c879e6')
                .then(onSuccess) // <-- onSuccess is defined on line 24
                .then(LatLon)
                .catch(onError); // <-- onError is defined on line 48

            function onSuccess(response) {
                return response.data;
            }
        };

        function LatLon(data) {
            // below function take return from weather API (lat and long) of entered city
            // and send this to Active API to then return list of campgrounds in that area.

            var url = 'https://www.reserveamerica.com/campgroundSearch.do?landmarkLat=' + data.coord.lat + '&landmarkLong=' + data.coord.lon + '&v=JSON&expwith=1&amenity=4005&pets=3010&xml=true&expwith=1&expfits=1&api_key=2chxq68efd4azrpygt5hh2qu';
            $http
                .get(url, {
                    transformResponse: function(xmlData) {
                        var x2js = new X2JS();
                        var json = x2js.xml_str2json(xmlData);
                        return json;
                    }
                })
                .then(onSuccess) // <-- onSuccess is defined on line 38
                .catch(onError); // <-- onError is defined on line 48

            function onSuccess(response) {
                vm.campGround = response.data;
                console.log(vm.campGround)
                vm.searchTerm = '';
                vm.history.push({
                    name: response.facilityName
                });

                toastr.success('Congrats you picked a great city!')

            }

            function onError(error) {
                toastr.error('you have an error')
            }
        }
    }
})();

// f5ec34f58a46762629beb284f27259921f6e507f93021231ed2fc6d45b1fbcbd

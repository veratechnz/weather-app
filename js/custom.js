(function(){
    console.log(this);
  // v-if="weather" on line 13 will conditionally render the entire
  // application after the ajax response, as it will change 'weather: false'
  // to true (as data is seen as true by the computer logic).

   var app = new Vue({
      el: '#app',
      data: {
        // Start the vue app with weather assigned as false
        weather: false,
        // This eventually has the date creation result
        dates: '*** here!',
        daysOf: ['Monday', 'Tuesday'],
        newTitle: 'This is a sunny icon/day',
        // Some logic points for switching classes on the html above
        isActive: true,
        isDark: false,
        iconsRef: false
      },
      // This is special function that vue.js provides, it allows users to make 
      // a function call when the vue instance is created. Kind of like document.ready()
      created: function () {
        this.createDates();
      },
      methods: {
        doAnAlert: function () {
          // alert('this is vue')
          // This refers to the vue.instance
          console.log(this)
        },
        // This function will return various days of the week
        // It references from the number '1' for TODAY. Then 7 for the final day of the week (from the current day).
        // You can feed it any number, it will loop over the days infinitely no matter the day of the week that it is used.
        getDayOfTheWeek: function (indexAddition) {
          // Ref to the date object
          var date = new Date();
          // Got an array of days which are strings
          var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
          // The current day reference which returns a number 0 - 6
          // var currentDay = date.getDay();
          var currentDay = date.getDay();

          // Updated algorithm for potential infinite loop through the seven days array above
          function loop(n) {
            var foundDay;
            for (var i=0; i<n; i++) {
              var pointer = (i + currentDay) % days.length;
              foundDay = days[pointer]
            }
            // returns last day found result
            return foundDay
          }
          // Returns the day result
          return loop(indexAddition)
        }, // Function ENDS
        // A  vue method that uses the moment.js library to easily create dynamic dates
        createDates: function () {
          // The datesCreated 'catch' array
          var datesCreated = [];
          var daysRequired = 7
          // Loop to seven and push all days from today to the array in a useful string format
          for (var i = 0; i <= daysRequired; i++) {
            datesCreated.push( moment().add(i, 'days').format('dddd, Do MMMM YYYY') )
          }
          // We assign the array data to the vue data object, with 'this'
          this.dates = datesCreated;
        }// createDates ENDS

      }, // methods END

    });

  /*========================================================================
  =            These function exist outside of the Vue Instance            =
  ========================================================================*/
  
   function makeAjaxRequest (lat, lng) {
      // getUrl will either be a **1. live geolocation based request or...
      // a **2. predetermined hardcoded position
      var getUrl;
      // If the arguments/parameters above are true or false...
      if (lat === false) {
        // **1. if no longitude or latitude....go to Bali
        getUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=-8.366033&lon=114.997182&units=metric&exclude=hourly,minute&appid=66ce6f7e945db003aaa343f0bc010dc8';
      } else {
        // **2. add to api url string 
        getUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lng + '&units=metric&exclude=hourly,minute&appid=66ce6f7e945db003aaa343f0bc010dc8';
      }

      axios({
        method: 'get',
        url: getUrl
      }).then(function (response) {
        // Here we assign the the data response to the app/vue weather property.
        // We do not need to use 'data.weather' because vue always provides data
        // as a property by default.
        app.weather = response

        function getIcons(response) {
          var icons = [];
          for (var i = 0; i < 8; i++) {
            console.log(i)
            var iconCode = response.data.daily[i].weather[0].icon;
            var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
            icons.push(iconUrl)
          }
          app.iconsRef = icons;
          console.log(app.iconsRef)
        } // getIcons ENDS


        // Call and assign Icons
        getIcons(response)
      });
    } // makeAjaxRequest ENDS

    // A function that runs after the ajax response
    function checkGeoLocation () {
      // Check for browser geolocation functionality
      if (navigator.geolocation) {
        // If true call next function as part of the geolocation api method
        navigator.geolocation.getCurrentPosition(showPosition);
      } else {
        makeAjaxRequest(false, false);
        console.log("Geolocation is not supported by this browser.");
      }

      function showPosition(position) {
        // Get longitude and latitude then pass to the makeAjaxRequest method
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        console.log(position.coords.latitude)
        console.log(position.coords.longitude)
        // We have a function pre-written that makes an ajax request
        makeAjaxRequest(lat, lng);
      }

    } // checkGeoLocation ENDS

    checkGeoLocation();

  }()); // iffe function ENDS
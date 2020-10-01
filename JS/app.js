  // Initialize and add the map
  var map, infoWindow;
  function initMap() {
  // The location of greece
  var greece = {lat: 39.0742, lng:21.8243};
  // The map, centered at greece
   map = new google.maps.Map(
      document.getElementById('map'), {zoom: 6, center: greece});
  // The marker, positioned at greece
  infoWindow = new google.maps.InfoWindow;
  
     // Try HTML5 geolocation.
     if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var myPos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // infoWindow.setPosition(pos);
      // infoWindow.setContent('Location found.');
      // infoWindow.open(map);
      map.setCenter(myPos);
      var marker = new google.maps.Marker({
          position: myPos, 
          map: map,
          title: "Click to zoom"
      });
      marker.addListener("click", () => {
          map.setZoom(8);
          map.setCenter(marker.getPosition());
      });

    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, myPos) {
  infoWindow.setMymyPosition(myPos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
  }
  
  
  $(function() {
      // add input listeners
      google.maps.event.addDomListener(window, 'load', function () {
          var from_places = new google.maps.places.Autocomplete(document.getElementById('from_places'));
          var to_places = new google.maps.places.Autocomplete(document.getElementById('to_places'));

          google.maps.event.addListener(from_places, 'place_changed', function () {
              var from_place = from_places.getPlace();
              var from_address = from_place.formatted_address;
              $('#origin').val(from_address);
          });

          google.maps.event.addListener(to_places, 'place_changed', function (){
              var to_place = to_places.getPlace();
              var to_address = to_place.formatted_address;
              $('#destination').val(to_address);
          });
      });
      // calculate distance
      function calculateDistance() {
          var origin = $('#origin').val();
          var destination = $('#destination').val();
          var mode = $("input[type='radio'][name='transport-mode']:checked").val();
          //if mode = $("input[type='radio'][name='transport-mode']:unchecked") display msg: "Sorry no teleporting mode yet..:0.Please check/choose a mode of transportation"
          //vs if $('input[name=Choose]').attr('checked',false);
              
          console.log(mode);
          var service = new google.maps.DistanceMatrixService();
          service.getDistanceMatrix(
              {
                  origins: [origin],
                  destinations: [destination],
                  //travelMode: google.maps.TravelMode.DRIVING,
                  travelMode: [mode],
                  unitSystem: google.maps.UnitSystem.IMPERIAL, // miles and feet.
                  // unitSystem: google.maps.UnitSystem.metric, // kilometers and meters.
                  avoidHighways: false,
                  avoidTolls: false
              }, callback);
      }
      // get distance results
      function callback(response, status) {
          if (status != google.maps.DistanceMatrixStatus.OK) {
              $('#result').html(err);
          }
          else {
              var origin = response.originAddresses[0];
              var destination = response.destinationAddresses[0];
              if (response.rows[0].elements[0].status === "ZERO_RESULTS") {
                  $('#result').html("Better get on a plane. There are no roads between "  + origin + " and " + destination);
              } 
              else {
                  var distance = response.rows[0].elements[0].distance;
                  var duration = response.rows[0].elements[0].duration;
                  console.log(response.rows[0].elements[0].distance);
                  console.log(duration);
                  var distance_in_kilo = distance.value / 1000; // the kilom
                  var distance_in_mile = distance.value/ 1609.34; // the mile
                  var duration_text = duration.text; //duration in text
                  var duration_value = duration.value;
                  $('#in_mile').text(distance_in_mile.toFixed(2));
                  $('#in_kilo').text(distance_in_kilo.toFixed(2));
                  $('#duration_text').text(duration_text);
                  $('#duration_value').text(duration_value);
                  $('#from').text(origin);
                  $('#to').text(destination);
                  
                  Timer(duration_value);
                  
                  
              }
          }
      }  
      
              
      
              

              function Timer(duration){
              console.log(duration)
              var nowD = new Date(); // for now
              
              var h = document.getElementById("arrival-hour");
              var hValue = h.options[h.selectedIndex].value;
              console.log("Selected hour:", hValue);
              hValue = hValue*60*60*1000;                  //if...am-pm...hValue+=12
              var m = document.getElementById("arrival-minute");
              var mValue = m.options[m.selectedIndex].value;
              console.log("Selected minutes:", mValue);
              mValue = mValue*60*1000;
              var p = document.getElementById("arrival-period");
              var pValue = p.options[p.selectedIndex].value;
              
              

              
              //what time to be there
              var arrivalTime = hValue + mValue;
              console.log("Selected arrival time:", arrivalTime);
              if (nowD.getHours() > 12){
                  arrivalTime = arrivalTime + 12*60*60*1000;
              };
              console.log("Calculated arrival time", arrivalTime);
              // time to leave 
              var durationM = duration*1000;
              console.log("Trip duration", durationM);
              var leaveTime = arrivalTime - durationM; 
              console.log("leave time:", leaveTime);
              
              //Find the distance between now and the count down date
      
      
              // Update the count down every 1 second
              var x = setInterval(function() {

              //Get today's date and time
              var nowD = new Date(); // for now
              nowHours = nowD.getHours(); 
              console.log("Hours:", nowHours);
              nowMinutes = nowD.getMinutes(); 
              console.log("Minutes:", nowMinutes);
              nowSeconds = nowD.getSeconds(); 
              console.log("Secods:", nowSeconds);
              
              now = ((nowHours*60 + nowMinutes)*60 + nowSeconds)*1000
              console.log("The time is:", now);
              
              var countDownTime = leaveTime - now;
              console.log("Leave in:", countDownTime);
                  
              // Time calculations for days, hours, minutes and seconds
              var days = Math.floor(countDownTime / (1000 * 60 * 60 * 24));
              var hours = Math.floor((countDownTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              var minutes = Math.floor((countDownTime % (1000 * 60 * 60)) / (1000 * 60));
              var seconds = Math.floor((countDownTime % (1000 * 60)) / 1000);
                  
              // Output the result in an element with id="demo"
              document.getElementById("demo").innerHTML = days + "d " + hours + "h "
              + minutes + "m " + seconds + "s ";
                  
              // If the count down is over, write some text 
              if (countDownTime < 0) {
                  
                  window.alert("Go!");
                  
                  clearInterval(x);
                  
                  document.getElementById("demo").innerHTML = "EXPIRED";
              }
              }, 1000);
          }

              

      // print results on submit the form
      $('#distance_form').submit(function(e){
          e.preventDefault();
          calculateDistance();
          //Timer();
      });

  });
  
  //reset forms & timer
  function resetFunction() {
      var myWindow = window.open("http://127.0.0.1:5500/index.html", "_self");
  }

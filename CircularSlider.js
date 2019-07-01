  document.addEventListener('DOMContentLoaded', function () {

      var container = document.getElementById("canvas");

      var context = container.getContext("2d");

      var circle1 = new CircularSlider({
          container: container,
          color: "#990099",
          min: 0,
          max: 500,
          step: 10,
          radius: 120,
          value: 400,
          onValue: function (value) {
              var div = document.getElementById("infoValue1");
              div.innerText = "$" + parseInt(value);
              var labelText = document.getElementById("box1");
              labelText.style.backgroundColor = this.color;
          },
      });

      var circle2 = new CircularSlider({
          container: container,
          color: "#0066CC",
          min: 0,
          max: 800,
          step: 50,
          radius: 100,
          value: 700,
          onValue: function (value) {
              var div = document.getElementById("infoValue2");
              div.innerText = "$" + parseInt(value);
              var labelText = document.getElementById("box2");
              labelText.style.backgroundColor = this.color;
          }
      });

      var circle3 = new CircularSlider({
          container: container,
          color: "#009900",
          min: 0,
          max: 100,
          step: 10,
          radius: 80,
          value: 50,
          onValue: function (value) {
              var div = document.getElementById("infoValue3");
              div.innerText = "$" + parseInt(value);
              var labelText = document.getElementById("box3");
              labelText.style.backgroundColor = this.color;
          }
      });


      var circle4 = new CircularSlider({
          container: container,
          color: "#FF7519",
          min: 0,
          max: 300,
          step: 10,
          radius: 60,
          value: 250,
          onValue: function (value) {
              var div = document.getElementById("infoValue4");
              div.innerText = "$" + parseInt(value);
              var labelText = document.getElementById("box4");
              labelText.style.backgroundColor = this.color;
          }
      });

      var circle5 = new CircularSlider({
          container: container,
          color: "#FF0000",
          min: 0,
          max: 300,
          step: 20,
          radius: 40,
          value: 50,
          onValue: function (value) {
              var div = document.getElementById("infoValue5");
              div.innerText = "$" + parseInt(value);
              var labelText = document.getElementById("box5");
              labelText.style.backgroundColor = this.color;
          }
      });

      context.font = "italic bold 10px Arial";
      context.textAlign = "center";
      context.fillStyle = "black";
      context.fillText("ADJUST DIAL TO ENTER EXPENSES", container.width / 2, container.height);

  });

  (function () {
      console.log("IN");

      function CircularSlider(options) {
          options = options || {};
          this.container = options.container;
          this.color = options.color;
          this.min = options.min;
          this.max = options.max;
          this.step = options.step;
          this.radius = options.radius;
          this.value = options.value || 0;
          this.onValue = options.onValue;

          this.centerX = this.container.width / 2;
          this.centerY = this.container.height / 2;

          this.circleWidth = 14;

          this.context = this.container.getContext("2d");

          //this.context.imageSmoothingEnabled = true;

          this.sliderButton = createSliderButton();

          addButtonEvents(this, this.context, this.sliderButton, this.centerX, this.centerY, this.radius, this.color);

          this.draw();

          this.setValue(this.value);

      }

      function createSliderButton() {
          var sliderButton = document.createElement("div");
          sliderButton.id = "sliderButton";
          document.getElementById("content").appendChild(sliderButton);
          return sliderButton;
      }
      CircularSlider.prototype.draw = function () {

          //circle je sedaj this
          var circle = this;
          var context = circle.context;
          var centerX = circle.centerX;
          var centerY = circle.centerY;
          var circleWidth = circle.circleWidth;


          /********** READ VARIABLES ***********/
          var container = circle.container;
          var color = circle.color;
          var min = circle.min;
          var max = circle.max;
          var step = circle.step;
          var radius = circle.radius;
          var initValue = circle.value;
          var sliderButton = circle.sliderButton;

          var nSteps = (max - min) / step;

          context.save();


          // cut donut hole
          context.beginPath();
          context.rect(0, 0, this.container.width, this.container.height);
          context.arc(centerX, centerY, radius - 14, 0, Math.PI * 2, true);
          context.clip();

          context.globalCompositeOperation = "source-over";

          fillCircle(context, centerX, centerY, color, radius);

          cropCircle(context, centerX, centerY, radius);

          drawLines(context, nSteps, centerX, centerY, radius);

          drawArc(context, centerX, centerY, radius, min, max, initValue, color, circleWidth);

          updateSliderButton(context, sliderButton, centerX, centerY, radius, initValue, min, max, circleWidth, color);

          context.restore();
      }


      CircularSlider.prototype.setValue = function (newValue) {

          newValue = Math.round(newValue / this.step) * this.step;

          if (newValue < this.min) {
              newValue = this.min;
          }
          if (newValue > this.max) {
              newValue = this.max;
          }

          this.value = newValue;
          this.draw();
          this.onValue(newValue);
      }

      CircularSlider.prototype.setValueFromAngle = function (angle) {
          var valueFromAngle = (angle * (this.max - this.min)) / (2 * Math.PI) + this.min;
          this.setValue(valueFromAngle);
      }

      function calculateDistance(startX, startY, centerX, centerY) {
          var distX = Math.sqrt(startX - centerX);
          var distY = Math.sqrt(startY - centerY);

          return Math.sqrt(distX + distY);
      }

      function addButtonEvents(circle, context, sliderButton, centerX, centerY, radius, color) {


          function setValueFromPointXY(pointX, pointY) {
              var rectObject = circle.container.getBoundingClientRect();

              var centerPaddingX = rectObject.left + centerX;
              var centerPaddingY = rectObject.top + centerY;

              //console.log("centerPadding X, Y: "+centerPaddingX, centerPaddingY);

              var angle = Math.atan2((centerPaddingY - pointY), centerPaddingX - pointX);

              //console.log("ANGLE "+angle+", angle: "+(angle*(180/Math.PI)+180)+", ");

              var endPointX = radius * Math.cos(angle + Math.PI) + centerPaddingX;
              var endPointY = radius * Math.sin(angle + Math.PI) + centerPaddingY;

              /*console.log("++++++++++++ TOUCHEND ++++++++++++++++");
              console.log("CENTER "+centerPaddingX, centerPaddingY);
              console.log("ENDPOINT - X,Y: "+pointX, pointY);
              console.log("ENDPOINT - in circle: "+endPointX, endPointY);
               */

              circle.setValueFromAngle((angle + 1.5 * Math.PI) % (2 * Math.PI));
          }

          sliderButton.addEventListener('touchstart', function (e) {
              var touchobj = e.changedTouches[0]; // reference first touch point (ie: first finger)
              var startX = parseInt(touchobj.clientX); // get x position of touch point relative to left edge of browser
              var startY = parseInt(touchobj.clientY); // get x position of touch point relative to left edge of browser

              e.preventDefault();
          }, false);

          sliderButton.addEventListener('touchmove', function (e) {
              var touchobj = e.changedTouches[0];

              var pointX = touchobj.clientX;
              var pointY = touchobj.clientY;
              setValueFromPointXY(pointX, pointY);

              e.preventDefault();

          }, false);

          sliderButton.addEventListener('touchend', function (e) {
              var touchobj = e.changedTouches[0];
              var pointX = touchobj.clientX;
              var pointY = touchobj.clientY;

              setValueFromPointXY(pointX, pointY);

              e.preventDefault();
          }, false);



          var dragging = false;

          sliderButton.addEventListener("mousedown", function (e) {
              dragging = true;
              e.preventDefault();
          }, false);

          document.addEventListener("mousemove", function (e) {

              if (dragging) {
                  var pointX = e.clientX;
                  var pointY = e.clientY;

                  setValueFromPointXY(pointX, pointY);
              }

              e.preventDefault();
          }, false);


          document.addEventListener("mouseup", function (e) {
              dragging = false;
              e.preventDefault();
          }, false);
      }


      function updateSliderButton(context, sliderButton, centerX, centerY, radius, initVal, minVal, maxVal, circleWidth, color) {

          var angle = ((initVal - minVal) / (maxVal - minVal)) * 2 * Math.PI + 1.5 * Math.PI;

          var top = centerY + ((radius - circleWidth / 2) * Math.sin(angle));
          var left = centerX + ((radius - circleWidth / 2) * Math.cos(angle));

          sliderButton.setAttribute("style", "top: " + top + "px; left: " + left + "px");

      }

      function drawArc(context, centerX, centerY, radius, minVal, maxVal, initVal, color, circleWidth) {


          var arc = ((initVal - minVal) / (maxVal - minVal)) * 2 * Math.PI;


          var extent = 2 * Math.PI;
          // blank space between circles
          var circleMargin = 20;
          //console.log("+++++ARC: "+arc+", initVal:"+initVal+", maxVal: "+maxVal+", minVal: "+minVal+", X: "+centerX+", Y:"+centerY+", R: "+radius);

          context.globalCompositeOperation = "source-atop";

          context.beginPath();
          context.rect(0, 0, context.width, context.height);
          context.moveTo(centerX, centerY);
          context.arc(centerX, centerY, radius, 1.5 * Math.PI, arc + 1.5 * Math.PI, false);
          context.moveTo(centerX, centerY);
          context.arc(centerX, centerY, radius - circleWidth, 1.5 * Math.PI, arc + 1.5 * Math.PI, false);
          context.closePath();
          //context.clip();
          var grd = context.createLinearGradient(0, 0, centerX * 2, centerY * 2);
          grd.addColorStop(0, color);
          grd.addColorStop(1, color);
          context.fillStyle = color;
          context.fill();

      }

      function fillCircle(context, centerX, centerY, color, radius) {
          var silverColor = "#E3E3E3";
          // width of the circle border
          var circleWidth = 14;
          var extent = 2 * Math.PI;

          context.beginPath();
          context.arc(centerX, centerY, radius - circleWidth, 0, extent, false);
          context.arc(centerX, centerY, radius, 0, extent, true);


          context.fillStyle = silverColor;
          context.fill();
          context.closePath();
      }

      function cropCircle(context, centerX, centerY, radius) {
          var extent = 2 * Math.PI;
          context.fillStyle = 'transparent';
          context.globalCompositeOperation = 'destination-out';
          context.beginPath();
          context.arc(centerX, centerY, radius, 0, extent, false);
          context.closePath();
      }

      function drawLines(context, numLines, centerX, centerY, radius) {

          var extent = 2 * Math.PI;

          var angle = 0;
          context.lineWidth = 0.9;
          var arcSize = extent / numLines;
          var x, y;

          for (var i = 0; i < numLines; i++) {
              angle = arcSize * i + 1.5 * Math.PI;
              x = radius * Math.cos(angle) + centerX;
              y = radius * Math.sin(angle) + centerY;
              context.beginPath();
              context.moveTo(centerX, centerY);
              context.lineTo(x, y);
              context.stroke();
          }
      }

      window.CircularSlider = CircularSlider;

  })();

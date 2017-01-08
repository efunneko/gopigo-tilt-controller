// use strict;

(function($, undefined) {

    // percentage from -100% to 100% of the speed 
    var speed = 0;

    // percentage of turn amount from -100% (left) to 100% (right)
    var turn  = 0;

    // Gauge objects
    var leftGauge, rightGauge;

    // Determine the desired speed from the touch event
    function getSpeedPercent(div, event) {
        var yPos = event.originalEvent.touches[0].pageY - div.offset().top;
        var height = div.height();
        var percent = 100 * (height/2 - yPos)/(height/2);
        return percent;
    }

    function drawScreen() {

        var main = $("#main");

        var gaugeDiv = main.$div({id: "gauge"});
        var speedDiv = main.$div({id: "speed"});

        var speedInner = speedDiv.$div({id: "speedInner"});

        speedInner.$img({src: "img/chevron_up.png", class: "chevron-up"});
        speedInner.$img({src: "img/chevron_up.png", class: "chevron-up"});
        speedInner.$img({src: "img/chevron_up.png", class: "chevron-down"});
        speedInner.$img({src: "img/chevron_up.png", class: "chevron-down"});

        var leftDiv  = gaugeDiv.$canvas({id: "leftGauge"});
        var rightDiv = gaugeDiv.$canvas({id: "rightGauge"});

        var gaugeWidth  = $("#gauge").width()/2;
        var gaugeHeight = $("#gauge").height();

        var gaugeOptions = {
            renderTo: "leftGauge",
            width: gaugeWidth,
            height: gaugeHeight,
            title: "Left Speed",
            value: 0,
            minValue: 0,
            maxValue: 260,
            majorTicks: [0,20,40,60,80,100,120,140,160,180,200,220,240,260],
            minorTicks: 2,
            strokeTicks: false,
            highlights: [
                { "from": 0, "to": 200, "color": "rgba(0,0,0,.15)" },
                { "from": 220, "to": 260, "color": "rgba(255,0,0,.25)" }
            ],
            colorPlate: "#222",
            colorMajorTicks: "#f5f5f5",
            colorMinorTicks: "#ddd",
            colorTitle: "#fff",
            colorUnits: "#ccc",
            colorNumbers: "#eee",
            colorNeedleStart: "rgba(240, 128, 128, 1)",
            colorNeedleEnd: "rgba(255, 160, 122, .9)",
            valueBox: true,
            animationRule: "linear",
            animationDuration: 300,
            fontValue: "Led",
        };
        
        leftGauge = new RadialGauge(gaugeOptions);

        gaugeOptions.title    = "Right Speed";
        gaugeOptions.renderTo = "rightGauge";

        rightGauge = new RadialGauge(gaugeOptions);

        leftGauge.draw();
        rightGauge.draw();

    }

    // Correct the speed a bit and return it
    function getSpeed(container, event) {
        var speed = getSpeedPercent(container, event);
        if (Math.abs(speed) < 15) {
            speed = 0;
        }
        if (Math.abs(speed) > 100) {
            speed = 100 * Math.sign(speed);
        }
        return speed;
    }

    // Run when document is fully loaded
    $(document).ready(function() {

        // Initialize the jquery createHtml plugin
        $.createHtml("configure", {installParentFunctions: true});

        // Attempt to lock the screen orientation to landscape (YMMV)
        var lockOrientation = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;
        if (lockOrientation) {
            lockOrientation("landscape-primary");
        }

        // Draw all the stuff
        drawScreen();

        // Set up the touch inputs on the speed slider
        var speedInner = $("#speedInner");
        
        speedInner.on('touchmove', function(e) {
            e.preventDefault();
            speed = getSpeed(speedInner, e);
            return false;
        });
        
        speedInner.on('touchstart', function(e) {
            e.preventDefault();
            speed = getSpeed(speedInner, e);
            return false;
        });
        
        speedInner.on('touchend', function(e) {
            e.preventDefault();
            speed = 0;
            return false;
        });
        
        // Detect an process tilt changes
        window.ondevicemotion = function(event) {
            if (event.accelerationIncludingGravity && event.accelerationIncludingGravity.x) {
	        var accY = event.accelerationIncludingGravity.y.toFixed(1);

                turn = ((accY/9.8)*100).toFixed(0);

                if (Math.abs(turn) < 10) {
                    turn = 0;
                } 
                if (Math.abs(turn) > 100) {
                    turn = 100 * Math.sign(turn);
                } 

            }
        };

        var inflight = 0, skipped = 0;
        setInterval(function() {

            var left  = (speed/100 * 250).toFixed(0);
            var right = (speed/100 * 250).toFixed(0);

            // Adjust for the tilt
            if (turn > 0) {
                left = ((100-turn)/100*left).toFixed(0);
            }
            if (turn < 0) {
                right = ((100-(-1*turn))/100*right).toFixed(0);
            }

            // Set the gauge values
            rightGauge.value = Math.abs(right);
            leftGauge.value  = Math.abs(left);

            // Not needed
            //rightGauge.draw();
            //leftGauge.draw();

            // Wrap the ajax stuff with some protection to avoid too many requests
            // in flight at the same time. This may kick in if your network is poor
            // Without this, you might get very stale events being processed on the gopigo
            if (inflight < 3) {
                inflight++;

                $.ajax({ type: "GET",
                         data: "",
                         url:  "/speed?left=" + left + "&right=" + right, 
                         success: function (res) {
                             inflight--;
                             console.log("res", res);
                         },
                         error:  function (res, e) {
                             inflight--;
                         },
                         dataType: "json"
                       });
                skipped = 0;
            }
            else {
                skipped++;
                if (skipped > 50) {
                    inflight = 0;
                }
            }
            
        }, 100);

    });

})(jQuery);

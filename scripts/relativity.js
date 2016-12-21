function Ship(leftClock, rightClock, leftSpacer, rod, name) {
    this.leftClock = leftClock;
    this.rightClock = rightClock;
    this.spacer = leftSpacer;
    this.rod = rod;
    this.leftTime = 0;
    this.rightTime = 0;
    this.clockWidth = 60;
    this.clockHeight = 60;
    this.rodHeight = 10;
    this.rodLength = 160;
    this.leftPosition = 0;
    this.rightPosition = 0;
    this.clockRate = 1;
    this.name = name;
    this.setSize = function(x) {
        this.rodLength = x;
        this.rod.style.width = x + "px";
    };
    
    this.positionLeft = function(x) {
        if (x*2 < this.clockWidth) {
            x = Math.floor((this.clockWidth + 1)/2);
        }
        this.leftPosition = x;
        var margin = x - Math.floor((this.clockWidth + 1)/2);
        this.spacer.style.marginLeft = margin + "px";
        this.rightPosition = x + this.clockWidth + this.rodLength;
    };
    
    this.positionRight = function(x) {
        var y = x - this.clockWidth - this.rodLength;
        this.positionLeft(y);
    };
    
    this.renderClocks = function() {
        this.leftClock.textContent = this.renderTime(this.leftTime);
        this.rightClock.textContent = this.renderTime(this.rightTime);
    }
    
    this.updateClocks = function() {
        this.leftTime += this.clockRate;
        this.rightTime += this.clockRate;
        this.renderClocks();
        this.ticks++;
        if (this.ticks % 400 == 0) {
            //alert("ticks: " + this.ticks + "time: " + this.leftClock.textContent);
        }
    };
    
    this.renderTime = function(t) {
        t = Math.floor(t);
        var retval = ""
        var minutes = t;
        var hour = 12;
        while (minutes >= 60) {
            minutes -= 60;
            hour += 1;
        }
        while (minutes < 0) {
            minutes += 60;
            hour -= 1;
        }
        while (hour > 12) {
            hour -= 12;
        }
        while (hour < 0) {
            hour += 12;
        }
        if (hour < 10) {
            retval += "0";
            retval += hour;
        } else {
            retval += hour;
        }
        retval += ":";
        if (minutes < 10) {
            retval += "0";
            retval += minutes;
        } else {
            retval += minutes;
        }
        return retval; 
    };   

}

var ships = [];

var shortLength = 70;
var longLength = 200;
var startPosition = 400;
var shortRate = 0.115;
var longRate = 0.230;
var pos_delta = 500;
var red_move = false;
var pos_max = 450;
var pos = 0;

window.onload = function() {
    var spacer = document.getElementById("spacer2");
    var leftClock = document.getElementById("one");
    var rightClock = document.getElementById("two");
    var rod = document.getElementById("three");
    var ship1 = new Ship(leftClock, rightClock, spacer, rod, "red clock");
    ships.push(ship1);
    
    var spacer = document.getElementById("spacer");
    var leftClock = document.getElementById("four");
    var rightClock = document.getElementById("six");
    var rod = document.getElementById("five");
    var ship2 = new Ship(leftClock, rightClock, spacer, rod, "green clock");
    ships.push(ship2);

    initGreen();
}

function stopMove() {
    if (id >= 0) {
        clearInterval(id);
    }
}

function initGreen() {
    pos_delta = 100;
    ships[0].setSize(shortLength);
    ships[0].clockRate = shortRate;
    ships[0].leftTime = 45;
    ships[0].rightTime = 0;
    ships[0].renderClocks();
    var position = startPosition + pos_delta;
    ships[0].ticks = 0;
    ships[0].positionRight(position);
    ships[1].setSize(longLength);
    ships[1].clockRate = longRate;
    ships[1].leftTime = 0;
    ships[1].rightTime = 0;
    ships[1].positionLeft(startPosition + pos_delta);
    ships[1].renderClocks();
    ships[1].ticks = 0;
    red_move = true;
    pos = 0;
}

function initRed() {
    pos_delta = 100;
    ships[0].setSize(longLength);
    ships[0].clockRate = longRate;
    ships[0].positionRight(startPosition + pos_delta);
    ships[1].setSize(shortLength);
    ships[1].clockRate = shortRate;
    ships[1].positionLeft(startPosition + pos_delta);
    ships[0].leftTime = 0;
    ships[0].rightTime = 0;
    ships[1].leftTime = 0;
    ships[1].rightTime = 45;
    ships[0].renderClocks();
    ships[1].renderClocks();
    red_move = false;
    pos = 0;
}

function myMove() {
    var done = false;
    id = setInterval(move, 50);
    function move() {
        if (pos == pos_max) {
            clearInterval(id)
        } else {
            pos++;
            if (red_move) {
                var position = pos + startPosition + pos_delta;
                if (! done) {
                }
                ships[0].positionRight(position);
                if (! done) {
                    //alert("hey");
                }
                done = true;
            } else {
                
                ships[1].positionLeft(startPosition + pos_delta - pos );

            }
            ships[0].updateClocks();
            ships[1].updateClocks();
        }
        
    }
}
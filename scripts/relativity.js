var ships = []; // Will hold the two ships

var shortLength = 70; // the length of the length-contracted ship's rod
var longLength = 200; // the length of the uncontracted ship's rod
var startPosition = 400; // the starting position (in px) of the left clock of the green ship and right clock o red ship
var shortRate = 0.115; // the clock rate of the time-dilated clock
var longRate = 0.230; // the clock rate of the undilated clock
var pos_delta = 100; // extra padding on left, in px
var red_move = false; // if true, then red ship is moving, green ship is stationary. If false, red ship is stationary, green ship is moving
var pos_max = 450; // maximum number of "ticks" to run simulation
var pos = 0; // current number of ticks
var time_offset = 45; // offset of left clock of red ship when it is moving, or right clock of green ship when it is moving

function Ship(leftClock, rightClock, leftSpacer, rod, name) {
    this.leftClock = leftClock; // a div representing the clock on the left end of the ship
    this.rightClock = rightClock; // a div representing the clock on the right end of the ship
    this.spacer = leftSpacer; // a div to the left of the ship; its left margin determines the position of the ship
    this.rod = rod; // a div representing a rod connecting the left and right clocks
    this.leftTime = 0; // the current time on the left clock, in minutes past 12:00
    this.rightTime = 0; // the current time on the right clock, in minutes past 12:00
    this.clockWidth = 60; // the size of each clock, in px
    this.clockHeight = 70; // the height of each clock in px
    this.rodHeight = 10; // the height of the rod in px
    this.rodLength = 160; // the length of the rod in px
    this.leftPosition = 0; // the position (from the left of the window) of the center of the left clock
    this.rightPosition = 0; // the position (from the left of the window) of the center of the right clock
    this.clockRate = 1.0; // the clock rate (minutes per "tick")
    this.name = name; // the name of the ship either "red" or "green"
    this.moving = false;
    this.left_offset = 0;
    this.right_offset = 0;
        
    this.setMoving = function (moving) {
        if (moving) {
            this.moving = true;
            this.setSize(shortLength);
            this.clockRate = shortRate;
            if (name == "red") {
                this.left_offset = time_offset;
                this.right_offset = 0;
            } else if (name == "green") {
                this.right_offset = time_offset;
                this.left_offset = 0;
            }
        } else {
            this.moving = false;
            this.left_offset = 0;
            this.right_offset = 0;
            this.setSize(longLength);
        }
    }
    
    this.setPosition = function(x) {
        if (name == "red") {
            this.positionRight(x);
        } else if (name == "green") {
            this.positionLeft(x);
        }
    }
    
    this.setTime = function(t) {
        this.leftTime = t + this.left_offset;
        this.rightTime = t + this.right_offset;
        this.renderClocks();
    }
    
    this.setSize = function(x) { // sets the length of the rod
        this.rodLength = x;
        this.rod.style.width = x + "px";
    };
    
    this.positionLeft = function(x) { // sets the value of this.leftPosition (and calculates this.rightPosition) 
                                      // by adjusting the margin of the spacer
        if (x*2 < this.clockWidth) {
            x = Math.floor((this.clockWidth + 1)/2);
        }
        this.leftPosition = x;
        var margin = x - Math.floor((this.clockWidth + 1)/2);
        this.spacer.style.marginLeft = margin + "px";
        this.rightPosition = x + this.clockWidth + this.rodLength;
    };
    
    this.positionRight = function(x) { // sets the value of this.rightPosition (and calculates this.leftPosition) 
                                      // by adjusting the margin of the spacer
        var y = x - this.clockWidth - this.rodLength;
        this.positionLeft(y);
    };
    
    this.renderClocks = function() { // converts times on clocks to the format "hh:mm" and displays result in the corresponding divs
        this.leftClock.textContent = this.renderTime(this.leftTime);
        this.rightClock.textContent = this.renderTime(this.rightTime);
    }
    
    this.renderTime = function(t) { // converts times in minutes past 12:00 to "hh:mm" format
        t = Math.floor(t + 0.5);
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

window.onload = function() { // create ships, initialize their lengths, positions, clocks, etc.
    var spacer = document.getElementById("spacer2");
    var leftClock = document.getElementById("one");
    var rightClock = document.getElementById("two");
    var rod = document.getElementById("three");
    var ship1 = new Ship(leftClock, rightClock, spacer, rod, "red");
    ships.push(ship1);
    
    var spacer = document.getElementById("spacer");
    var leftClock = document.getElementById("four");
    var rightClock = document.getElementById("six");
    var rod = document.getElementById("five");
    var ship2 = new Ship(leftClock, rightClock, spacer, rod, "green");
    ships.push(ship2);

    initGreen();
}

function setUpShips(ticks, red_move1) { // calculate ship parameters for given number of ticks; red_move1 specifies whether the red ship is moving
    if (ticks === undefined || ticks < 0) {
        if (red_move1 != red_move) {
            ticks = Math.floor((ships[0].ticks / longRate) * shortRate + 0.5);
        } else {
            ticks = ships[0].ticks;
        }
    }
    
    red_move = red_move1;

    if (red_move) {
        ships[0].setMoving(true);
        //ships[0].setSize(shortLength);
        //ships[0].clockRate = shortRate;
        ships[0].rightTime = ticks * shortRate;
        ships[0].leftTime = ticks * shortRate + time_offset;
        ships[0].renderClocks();
        var position = startPosition + pos_delta + ticks;
        ships[0].ticks = ticks;
        ships[0].setPosition(position);
        
        ships[1].setMoving(false);
        //ships[1].setSize(longLength);
        //ships[1].clockRate = longRate;
        ships[1].leftTime = ticks * longRate;
        ships[1].rightTime = ticks * longRate;
        ships[1].setPosition(startPosition + pos_delta);
        ships[1].renderClocks();
        ships[1].ticks = ticks;
        pos = ticks;
    } else {
        pos_delta = 100;
        //ships[0].setSize(longLength);
        //ships[0].clockRate = longRate;
        ships[0].setMoving(false);
        ships[0].rightTime = ticks * longRate;
        ships[0].leftTime = ticks * longRate;
        ships[0].renderClocks();
        var position = startPosition + pos_delta;
        ships[0].ticks = ticks;
        ships[0].setPosition(position);
        
        //ships[1].setSize(shortLength);
        //ships[1].clockRate = shortRate;
        ships[1].setMoving(true);
        ships[1].leftTime = ticks * shortRate;
        ships[1].rightTime = ticks * shortRate + time_offset;
        var position = startPosition + pos_delta - ticks;
        ships[1].setPosition(position);
        ships[1].renderClocks();
        ships[1].ticks = ticks;
        pos = ticks;
    }
}

function stopMove() { // stops animation
    if (id >= 0) {
        clearInterval(id);
    }
}

function initGreen() { // sets up simulation for green frame (red ship moving)
    ships[0].setMoving(true);

    var position = startPosition + pos_delta;
    ships[0].ticks = 0;
    ships[0].setPosition(position);
    ships[0].setTime(0.0);

    ships[1].setMoving(false);

    ships[1].setPosition(startPosition + pos_delta);
    ships[1].ticks = 0;
    ships[1].setTime(0);
    red_move = true;
    pos = 0;
}

function initRed() { // sets up simulation for green frame (red ship moving)
    ships[0].setMoving(false);

    var position = startPosition + pos_delta;
    ships[0].ticks = 0;
    ships[0].setPosition(position);
    ships[0].setTime(0.0);

    ships[1].setMoving(true);

    ships[1].setPosition(startPosition + pos_delta);
    ships[1].ticks = 0;
    ships[1].setTime(0);
    red_move = false;
    pos = 0;
}

function switchToGreen() { // switches to green frame, keeping the time on the left green clock unchanged
    setUpShips(-1, true);
}

function switchToRed() { // switches to red frame, keeping time on the right red clock unchanged
    setUpShips(-1, false);
}



function myMove() {
    var done = false;
    id = setInterval(move, 50);
    function move() {
        if (pos == pos_max) {
            clearInterval(id)
        } else {
            pos++;
            setUpShips(pos, red_move);
        }
        
    }
}
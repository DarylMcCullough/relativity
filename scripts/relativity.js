var ships = []; // Will hold the two ships

var shortLength = 70; // the length of the length-contracted ship's rod
var longLength = 200; // the length of the uncontracted ship's rod
var startPosition = 400; // the starting position (in px) of the left clock of the green ship and right clock o red ship
var shortRate = 0.115; // the clock rate of the time-dilated clock
var longRate = 0.230; // the clock rate of the undilated clock
var pos_delta = 100; // extra padding on left, in px
var mover = "red"; // which ship is moving
var pos_max = 450; // maximum number of "ticks" to run simulation
var pos = 0; // current number of ticks
var time_offset = 45; // offset of left clock of red ship when it is moving, or right clock of green ship when it is moving

function switchTo(shipName, side) {
    var ship;
    for (var i=0; i<ships.length; i++) {
        if (shipName == ships[i].name) {
            ship = ships[i];
            break;
        }
    }
    
    if (! ship.moving) {
        return;
    }
    
    var newName = ship.getOtherName();
    var ticks = ship.ticks + Math.floor(ship.getOffset(side) * (1.0/shortRate) + 0.5);
    ticks = Math.floor((ticks / longRate) * shortRate + 0.5);
    
    startPosition = ship.getPosition() + ship.getPosShift(side) - pos_delta;
    
    setupShipsAux(ticks, newName);

}

function setupShipsAux(ticks, mover1) {
    mover = mover1;
    for (var i = 0; i < ships.length; i++) {
        var ship = ships[i];
        ship.setMover(mover);
        ship.setTicks(ticks);
        ship.setPosition(startPosition + pos_delta, ticks);
    }
    pos = ticks;
}

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
    
    this.getOffset = function(side) {
        if (side == "left") {
            return this.left_offset;
        }
        
        if (side == "right") {
            return this.right_offset;
        }
    }
    
    this.getPosShift = function(side) {
        if (side == "left") {
            if (this.name == "red") {
                return longLength - shortLength;
            }
            return 0;
        }
        
        if (side == "right") {
            if (this.name == "green") {
                return shortLength - longLength;
            }
            return 0;
        }
    }
    
    this.setMover = function(name) {
        if (name == this.name) {
            this.setMoving(true);
        } else {
            this.setMoving(false);
        }
    }
    
    this.getOtherName = function() {
        if (this.name == "red") {
            return "green";
        }
        
        if (this.name == "green") {
            return "red";
        }
    }
        
    this.setMoving = function (moving) {
        if (moving) {
            this.moving = true;
            this.setSize(shortLength);
            this.clockRate = shortRate;
            if (this.name == "red") {
                this.left_offset = time_offset;
                this.right_offset = 0;
            } else if (this.name == "green") {
                this.right_offset = time_offset;
                this.left_offset = 0;
            }
        } else {
            this.clockRate = longRate;
            this.moving = false;
            this.left_offset = 0;
            this.right_offset = 0;
            this.setSize(longLength);
        }
    }
    
    this.getPosition = function() {
        if (this.name == "red") {
            return this.rightPosition;
        }
        if (this.name == "green") {
            return this.leftPosition;
        }
    }
    
    this.setPosition = function(start, increment) {
        if (this.name == "green") {
            increment = -increment; // move to left
        }
        if (! this.moving) {
            increment = 0; // don't move
        }
        
        var x = start + increment;
        if (this.name == "red") {
            this.positionRight(x);
        } else if (this.name == "green") {
            this.positionLeft(x);
        }
    }
    
    this.setTicks = function(ticks) {
        this.ticks = ticks;
        this.setTime(ticks * this.clockRate);
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

function setupShips(ticks, mover1) { // calculate ship parameters for given number of ticks; mover1 specifies which ship is moving
    if (ticks === undefined || ticks < 0) {
        if (mover1 != mover) {
            ticks = Math.floor((ships[0].ticks / longRate) * shortRate + 0.5);
        } else {
            ticks = ships[0].ticks;
        }
    }
    
    setupShipsAux(ticks, mover1);
    
    //mover = mover1;
    //
    //for (var i = 0; i < ships.length; i++) {
    //    var ship = ships[i];
    //    ship.setMover(mover);
    //    ship.setTicks(ticks);
    //    ship.setPosition(startPosition + pos_delta, ticks);
    //}

    //pos = ticks;
    
    
}

function stopMove() { // stops animation
    if (id >= 0) {
        clearInterval(id);
    }
}

function initGreen() { // sets up simulation for green frame (red ship moving)
    setupShips(0, "red");
    stopMove();
}

function initRed() { // sets up simulation for green frame (red ship moving)
    setupShips(0, "green");
    stopMove();
}

function switchToGreen() { // switches to green frame, keeping the time on the left green clock unchanged
    switchTo("green", "left");
    //setupShips(-1, "red");
}

function switchToRed() { // switches to red frame, keeping time on the right red clock unchanged
    //setupShips(-1, "green");
    switchTo("red", "right");
}



function myMove() {
    id = setInterval(move, 50);
    function move() {
        if (pos == pos_max) {
            clearInterval(id)
        } else {
            pos++;
            setupShips(pos, mover);
        }
        
    }
}
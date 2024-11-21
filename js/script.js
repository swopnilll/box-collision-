var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth ;
canvas.height = window.innerHeight;
var c = canvas.getContext('2d');


let mouse = { 
    x: 10,
    y: 10
};

addEventListener("mousemove", function(event){
    mouse.x = event.clientX;
    mouse.y = event.clientY;
})

addEventListener("resize", function(){
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
});

function randomIntFromRange(min,max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor (colors) { 
        return colors[Math.floor(Math.random() * colors.length)];
}

function distance (x1, y1, x2, y2) {
    let xDistance = x2 - x1;
    let yDistance = y2 - y1;
    return Math.sqrt((Math.pow(xDistance,2) + Math.pow(yDistance,2))); 

}

// get the angle of collision between two bubbles.
function getAngleofCollision(own, other) {
    let angle = -Math.atan2(own.y - other.y, own.x - other.x)
    return angle;
}

// rotate the vector by certain angle to horizontally align the axis of collision.
function rotateVector(velocity, angle) {
    rotatedX = velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle);
    rotatedY = velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle);
    return rotatedVelocity = {
        x : rotatedX,
        y: rotatedY
    }
}

// resolve collision.
function collisionSolver(own, other) {
    const xVelocityDiff = own.velocity.x - other.velocity.x;
    const yVelocityDiff = own.velocity.y - other.velocity.y;

    const xDist = other.x - own.x;
    const yDist = other.y - own.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
        // get angle of collision.
        let angle = getAngleofCollision(own, other);
        // rotate the initial vectors.
        let u1 = rotateVector(own.velocity, angle);
        let u2 = rotateVector(other.velocity, angle);
        // set masses of the bubbles.
        let m1 = own.mass;
        let m2 = other.mass;
        // applying one-dimensional elastic collisions.
        let rotated_v1 = {x: ((m1 - m2) / (m1 + m2)) * u1.x + ((2 * m2) / (m1 + m2)) * u2.x, y: u1.y};
        let rotated_v2 = {x: ((2 * m1) / (m1 + m2)) * u1.x + ((m2 - m1) / (m1 + m2)) * u2.x, y: u2.y};
        // rotate the vectors back to original axis.
        let v1 = rotateVector(rotated_v1, -angle);
        let v2 = rotateVector(rotated_v2, -angle);
        // reset the velocitites.
        own.velocity.x = v1.x;
        own.velocity.y = v1.y;

        other.velocity.x = v2.x;
        other.velocity.y = v2.y;
    }

}


function Particle (x ,y ,radius ,color) {
    this.x = x;
    this.y = y;
    this.velocity = { 
        x: Math.random() - 0.5,
        y:Math.random() - 0.5
    };
    this.radius = radius;
    this.color = color;
    this.mass = 1;

    this.update = particles => {
        this.draw();

        for (let i = 0; i < particles.length; i++){
            if (this === particles[i]) continue;
            if ( distance(this.x, this.y, particles[i].x , particles[i].y) - this.radius * 2 < 0 ) {
                console.log("has colided");
                collisionSolver(this, particles[i]); 
            }
        }

        if (this.x - this.radius  <= 0 || this.x + this.radius >= innerWidth) {
                this.velocity.x = -this.velocity.x;

        }

        if (this.y - this.radius  <= 0 || this.y + this.radius >= innerHeight) {
            this.velocity.y = -this.velocity.y;

    }


        this.x += this.velocity.x;
        this.y += this.velocity.y;

    };

    this.draw = function() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false );
        c.strokeStyle = this.color;
        c.stroke();
        c.closePath();
    };
}


// Implementation 

let particles;
function init() {
    particles = [];
    for (let i = 0; i < 100 ; i++){
        const radius = 10;
        let x = randomIntFromRange(radius,canvas.width-radius);
        let y = randomIntFromRange(radius,canvas.height-radius);
        const color = "red";
        if ( i !== 0){
            for(let j = 0; j < particles.length; j++){
                if ( distance(x, y, particles[j].x , particles[j].y) - radius * 2 < 0 ) {
                     x = randomIntFromRange(radius,canvas.width-radius);
                     y = randomIntFromRange(radius,canvas.height-radius);
                     j = -1;
                }
            }
        }
        particles.push(new Particle(x, y, radius, color));
    }
}
// Animation loop 
function animate () {
    requestAnimationFrame (animate);
        c.clearRect (0, 0, canvas.width, canvas.height);       
        particles.forEach( particle => {
            particle.update(particles);
        })
}
init();
animate();

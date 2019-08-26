const prefs = {
    height: 400,
    width: 600,
    background: "#084c61",
    FPS: 30,
};

const COLOR = {
    red: "#db504a",
    yellow: "#e3b505",
    lightblue: "#56a3a6",
    darkblue: "#084c61"
}

const MousePos =  {
    x: 0,
    y: 0
};

const canvas = document.querySelector("#cvs");
const ctx = canvas.getContext("2d");
const circles = [];

// Hoisted functions

function setUp(){
    canvas.width = prefs.width;
    canvas.height = prefs.height;

    background();
    draw();
}

function background(){
    ctx.fillStyle = prefs.background;
    ctx.fillRect(0,0, canvas.width, canvas.height);
}

function translateRelativeTo(pos, element){
    return {
        x: pos.x - element.offset().left,
        y: pos.y - element.offset().top
    };
}

// Redraw canvas every frame
function draw(){
    ctx.clearRect(0,0, canvas.width, canvas.height);
    background();

    let mPos = translateRelativeTo(MousePos, $(canvas));
    circles.forEach(c => c.draw());
}

$(window).on("mousemove", (e) => {
    MousePos.x = e.originalEvent.x;
    MousePos.y = e.originalEvent.y;
});

// Define objects

class Circle{
    constructor(x, y, radius, width, rotationSpeed, opening, color){
        this.x = x;
        this.y = y;
        this.r = radius;
        this.w = width;
        this.rotationSpeed = rotationSpeed;
        this.color = color;

        this.startAngle = opening/2;
        this.endAngle = (2*Math.PI) - (opening/2);
    }

    draw(){
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.w;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, this.startAngle, this.endAngle);
        ctx.stroke();
        this.startAngle = (this.startAngle + this.rotationSpeed) % (2*Math.PI);
        this.endAngle = (this.endAngle + this.rotationSpeed) % (2*Math.PI);
    }

    isOnStroke(x, y){
        const withinOuter = Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2) < Math.pow(this.r + this.w/2, 2);
        const outsideInner = Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2) > Math.pow(this.r - this.w/2, 2);
        return withinOuter && outsideInner;
    }

}

// Create instances

circles.push(
    new Circle(prefs.width/2, prefs.height/2, 50, 10, 0.01, Math.PI/6, COLOR.red),
    new Circle(prefs.width/2, prefs.height/2, 100, 12, 0.012, Math.PI/6, COLOR.yellow),
    new Circle(prefs.width/2, prefs.height/2, 150, 14, 0.014, Math.PI/6, COLOR.lightblue)
);

setUp();
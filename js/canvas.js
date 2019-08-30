const prefs = {
    height: 400,
    width: 600,
    background: "#084c61",
    background_2: "#0c5369",
    background_3: "#126078",
    FPS: 30,
};

const COLOR = {
    red: "#db504a",
    yellow: "#e3b505",
    lightblue: "#56a3a6",
    darkblue: "#084c61"
};

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
    ctx.fillStyle = prefs.background_2;
    ctx.fillRect(canvas.width/2 - 200, 0, 400, canvas.height);
    ctx.fillStyle = prefs.background_3;
    ctx.fillRect(canvas.width/2 - 100, 0, 200 , canvas.height);
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

$(canvas).click((e) => {
    let mPos = translateRelativeTo(MousePos, $(canvas));
    circles.forEach(c => {
        if(c.isOnStroke(mPos.x, mPos.y)){
            c.rotationSpeed *= -1;
        }
    });
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
        const withinOuter = Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2) <= Math.pow(this.r + this.w/2, 2); // Stroke grows from center, so check half from each side
        const outsideInner = Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2) >= Math.pow(this.r - this.w/2, 2);
        return withinOuter && outsideInner;
    }

}

// Create instances

circles.push(
    new Circle(prefs.width/2, prefs.height/2, 30, 7, 0.01, Math.PI/6, "#84b082"),
    new Circle(prefs.width/2, prefs.height/2, 50, 9, 0.012, Math.PI/6, COLOR.red),
    new Circle(prefs.width/2, prefs.height/2, 70, 11, 0.014, Math.PI/6, "#beb8eb"),
    new Circle(prefs.width/2, prefs.height/2, 100, 13, 0.016, Math.PI/6, COLOR.yellow),
    new Circle(prefs.width/2, prefs.height/2, 150, 15, 0.018, Math.PI/6, COLOR.lightblue));

setUp();
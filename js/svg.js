const svg = document.querySelector("#svg_element");

const circle_1 = svg.querySelector("#circle1");
const circle_2 = svg.querySelector("#circle2");
const circle_3 = svg.querySelector("#circle3");
const svg_circles = [];

// Objects 
class SvgCircle{
    constructor(element, rotationSpeed){
        this.element = element;
        this.rotation = 0;
        this.rotationSpeed = rotationSpeed;

        $(this.element).click( e => {
            const mp = translateRelativeTo(MousePos, $(svg)); // Get mouse position relative to the svg element
            if(this.isOnStroke(mp.x, mp.y)){ // Only reverse rotation direction if the click is on the stroke
                let multiplier = $(this.element).attr("data-rotation-m") - 0; // Subtract 0 to convert string to number. Isn't JS fun!?
                $(this.element).attr("data-rotation-m", multiplier * -1);
            }
        });

    }

    isOnStroke(x, y){
        const bbox = this.element.getBBox();

        const cx = bbox.x + bbox.width/2;
        const cy = bbox.y + bbox.height/2;

        const radius = this.getRadius();
        const dist = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
        const diff = dist - radius;

        return Math.abs(diff) <= this.getWidth();
        
    }

    getRadius(){
        // Find data attribute of path and parse into list of operations: https://devdocs.io/svg/attribute/d
        const data = $(this.element)
            .attr("d")
            .trim()
            .replace(/\s{2,}/gm," ")
            .split(/([a-z][^a-z]+)/gmi)
            .filter(e => e != "");
         const arc = data.find(e => e.toLowerCase().startsWith("a")); // Find first (and hopefully only) arc operation
         const radius = arc.substr(1).trim().split(/\s+/)[0] - 0; // Chop off first character (operation identifier) and select first value; the x radius
        
         return radius;
    }

    getWidth(){
        const strokeWidth = $(this.element).css("stroke-width");
        return strokeWidth.substr(0, strokeWidth.length - 2) - 0;
    }

    getRotationMultiplier(){
        return $(this.element).attr("data-rotation-m") - 0;
    }

    update(){
        $(this.element).css("transform", "rotate(" + this.rotation + "rad)");
        this.rotation += this.rotationSpeed * this.getRotationMultiplier();
    }
}

function updateSVG(){
    svg_circles.forEach(c => c.update());
}

svg_circles.push(
    new SvgCircle(circle_1, 0.01),
    new SvgCircle(circle_2, 0.012),
    new SvgCircle(circle_3, 0.014));

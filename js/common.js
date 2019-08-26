function animate(){
    window.requestAnimationFrame(animate);
    draw();
    updateSVG();
}

window.requestAnimationFrame(animate);
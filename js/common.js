function animate(){
    window.requestAnimationFrame(animate);
    draw();
    updateSVG();
}


// Handle dropdown
$("#dropdown_activate").click(function(e){
    $(this).toggleClass("active");
    $(".documentation-content").toggle();
});

// Start animations
window.requestAnimationFrame(animate);
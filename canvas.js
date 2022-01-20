// DEFINE CONSTANTS
const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");
const toolbar = document.getElementById("toolbar");

// EVENT 1) CLEAR BUTTON -> CLEAR CANVAS
toolbar.addEventListener('click', e => {
    if (e.target.id === 'clear') {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

});

// EVENT 2) CHANGE STROKE COLOR AND SIZE
toolbar.addEventListener('change', e => {
    if (e.target.id === 'stroke') {
        context.strokeStyle= e.target.value;
    }

    if (e.target.id === 'lineWidth') {
        context.lineWidth = e.target.value;
    }

});

// EVENT 3) UPDATE DRAWING ON CANVAS (MOUSE AND TOUCH DRAWINGS)
window.addEventListener('load', ()  =>{ 
    var leftOffset = 210;
    var width = 2;
    var size = 2;
    var lastX, lastY;
    var touchX,touchY;  //variables to keep track of touch positions

    //Resize
    canvas.height = window.innerHeight-10;
    canvas.width = window.innerWidth-210;

    // Initialize to drawing hasn't started
    let painting = false;

    // DRAWING WITH MOUSE
    function startPosition(e){
        painting = true;
        draw(e);
        console.log("drawing")
    }
    function finishedPosition(){
        painting = false;
        context.beginPath();
    }
    function draw(e){
        if (!painting)
            return;
        context.lineWidth = width;
        context.lineCap = "round";
        context.lineTo(e.clientX-leftOffset, e.clientY);
        context.stroke();
    }

    
    // DRAWS LINE BASED ON TOUCH
    function drawLine(ctx,x,y,size) {
        if (lastX!=-1 && lastY!=-1 && (x !== lastX || y !== lastY)) {
            ctx.fillStyle = "#000000";
            ctx.lineWidth = 2 * size;
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
         
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
        lastX = x;
        lastY = y;
    }

   
    // Get the coordinates when screen is touched
    function sketchpad_touchStart() {
        getTouchPos();
        drawLine(context,touchX,touchY,size);
        preventDefault();
    }

    // Get the movement of the touch
    function sketchpad_touchMove(e) { 
        getTouchPos(e);
        drawLine(context,touchX,touchY,size); 
        event.preventDefault();
    }

    // Stop the stroke when touch stops
    function sketchpad_touchStop() {
        lastX = -1;
        lastY = -1;
        preventDefault();
    }

    // Get the touch position relative to the top-left of the canvas
    // When we get the raw values of pageX and pageY below, they take into account the scrolling on the page
    // but not the position relative to our target div. We'll adjust them using "target.offsetLeft" and
    // "target.offsetTop" to get the correct values in relation to the top left of the canvas.
    function getTouchPos(e) {
        if (!e)
            var e = event;

        if (e.touches) {
            if (e.touches.length == 1) { // Only deal with one finger
                var touch = e.touches[0]; // Get the information for finger #1
                touchX=touch.pageX-touch.target.offsetLeft;
                touchY=touch.pageY-touch.target.offsetTop;
            }
        }
    }
    
    //Event Listeners
    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("mouseup", finishedPosition);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("touchstart", sketchpad_touchStart, false);
    canvas.addEventListener("touchmove", sketchpad_touchMove, false);
    canvas.addEventListener("touchend", sketchpad_touchStop, false);
});



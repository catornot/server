function randomNumber(min, max) { 
    return Math.random() * (max - min) + min;
}

var a = 0;
var ctx;

window.addEventListener( "load", () => {
    const canvas = document.querySelector( "canvas" );
    ctx = canvas.getContext( "2d" );

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    ctx.fillStyle = "black";
    ctx.strokeStyle = "purple";
    ctx.lineWidth = 2

    ctx.beginPath();

    setTimeout( handle_draw, 500 );
} )

function handle_draw() {

    if ( a > 10 ) {
        ctx.closePath();
        ctx.clearRect( 0, 0, window.innerWidth, window.innerHeight );
        a = 0
        ctx.beginPath();
    }
    
    let x = randomNumber( 0, window.innerWidth );
    let y = randomNumber( 0, window.innerHeight );
    
    ctx.strokeStyle = '#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6);
    ctx.lineTo( x, y );
    ctx.stroke();

    a += 1

    setTimeout( handle_draw, 500 );
}
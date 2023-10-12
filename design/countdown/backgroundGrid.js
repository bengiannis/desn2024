


const canvas = document.getElementById('backgroundGrid');
const ctx = canvas.getContext('2d');
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

let centerX = canvasWidth * 0.5;
let centerY = canvasHeight * 0.5;

const xWrap = 12;
const yWrap = 12;
const zWrap = 12;

const darknessPoint = 0.66;

const lineWidth = 0.5;


function updateCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
    if (1 && window.devicePixelRatio > 1) {
        canvas.width = canvasWidth * window.devicePixelRatio;
        canvas.height = canvasHeight * window.devicePixelRatio;
        canvas.style.width = canvasWidth + "px";
        canvas.style.height = canvasHeight + "px";
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    console.log(window.innerWidth);
}

updateCanvasSize()

function scaleToCenter([x, y], scaleFactor) {
    return [Math.round((1-scaleFactor)*x + scaleFactor*(centerX)), Math.round((1-scaleFactor)*y + scaleFactor*(centerY))];
}

function brightnessCurve(depth) {
    return (depth-1+darknessPoint)*(1/(darknessPoint));
}

function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let z = 0; z <= zWrap; z++) {
        const rectanglePoints = [
            [0, 0],
            [canvasWidth, 0],
            [canvasWidth, canvasHeight],
            [0, canvasHeight]
        ]
        const scaledRectanglePoints = rectanglePoints.map(point => scaleToCenter(point, z/zWrap));
        ctx.strokeStyle = `rgba(255, 255, 255, ${brightnessCurve(1-(z/zWrap))})`;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(scaledRectanglePoints[0][0], scaledRectanglePoints[0][1]);
        ctx.lineTo(scaledRectanglePoints[1][0], scaledRectanglePoints[1][1]);
        ctx.lineTo(scaledRectanglePoints[2][0], scaledRectanglePoints[2][1]);
        ctx.lineTo(scaledRectanglePoints[3][0], scaledRectanglePoints[3][1]);
        ctx.closePath();
        ctx.stroke();
    }
    for (let x = 0; x <= xWrap; x++) {
        let gradient = ctx.createLinearGradient((x/xWrap) * canvasWidth, 0, centerX, centerY);
        gradient.addColorStop(0, "white");
        gradient.addColorStop(darknessPoint, "black");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo((x/xWrap) * canvasWidth, 0);
        ctx.lineTo(centerX, centerY);
        ctx.stroke();
        gradient = ctx.createLinearGradient((1-(x/xWrap)) * canvasWidth, canvasHeight, centerX, centerY);
        gradient.addColorStop(0, "white");
        gradient.addColorStop(darknessPoint, "black");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo((1-(x/xWrap)) * canvasWidth, canvasHeight);
        ctx.lineTo(centerX, centerY);
        ctx.stroke();
    }
    for (let y = 0; y <= yWrap; y++) {
        let gradient = ctx.createLinearGradient(0, (y/yWrap) * canvasHeight, centerX, centerY);
        gradient.addColorStop(0, "white");
        gradient.addColorStop(darknessPoint, "black");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(0, (y/yWrap) * canvasHeight);
        ctx.lineTo(centerX, centerY);
        ctx.stroke();
        gradient = ctx.createLinearGradient(canvasWidth, (1-(y/yWrap)) * canvasHeight, centerX, centerY);
        gradient.addColorStop(0, "white");
        gradient.addColorStop(darknessPoint, "black");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(canvasWidth, (1-(y/yWrap)) * canvasHeight);
        ctx.lineTo(centerX, centerY);
        ctx.stroke();
    }
    requestAnimationFrame(drawCanvas);
}

document.addEventListener('mousemove', (e) => {
    centerX = e.clientX;
    centerY = e.clientY;
});

window.addEventListener('resize', updateCanvasSize);
document.addEventListener('DOMContentLoaded', updateCanvasSize);


drawCanvas();

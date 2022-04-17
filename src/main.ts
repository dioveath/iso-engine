// window.onload = () => {

    let canvas = <HTMLCanvasElement> document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight;

    window.onresize = () => {
	width = canvas.width = window.innerWidth;
	height = canvas.height = window.innerHeight;	
	context.translate(width/2, height/2);
    }

    context.translate(width/2, height/2);    

    interface Box {
	x: number,
	y: number,
	width: number,
	height: number,
	color: string
    };


	let b: Box = {
		x: 0,
		y: 0,
		width: 40,
	    height: 20,
	    color: getRandomColor()
	};

    interface Point {
	x: number,
	y: number
    };

    function update(){
	context.clearRect(-width/2, -height/2, width, height);
	context.fillStyle = "black";
	context.fillRect(-width/2, -height/2, width, height);


	context.strokeStyle = "blue";
	context.beginPath();
	context.moveTo(-canvas.width/2, 0);
	context.lineTo(canvas.width/2, 0);
	context.stroke();

	context.strokeStyle = "green";	
	context.beginPath();	
	context.moveTo(0, -canvas.height/2);
	context.lineTo(0, canvas.height/2);
	context.stroke();

	// context.strokeStyle = "yellow";	
	// context.beginPath();	
	// context.moveTo(0, -canvas.height/2);
	// context.lineTo(0, canvas.height/2);
	// context.stroke();	

	context.fillStyle = "red";
	context.beginPath();
	context.arc(0, 0, 2, 0, Math.PI * 2, true);
	context.fill();

	context.fillStyle = "white";
	for(let i = 0; i < 11; i++){
	    for(let j = 0; j < 11; j++){
		context.strokeStyle = 'grey';
		let x =  -(11/2) * b.width + j * b.width;
		let y =  -(11/2) * b.height + i * b.height;		
		context.strokeRect(x, y, b.width, b.height);
	    }
	}



	for(let i = 0; i < 11; i++){
	    for(let j = 0; j < 11; j++){
		context.strokeStyle = i == 0 ? 'yellow' : 'red';
		context.save();
		context.translate((j - i) * b.width/2, (j + i) * b.height/2);
		context.beginPath();
		context.moveTo(0, 0);
		context.lineTo(b.width/2, b.height/2);
		context.lineTo(0, b.height);
		context.lineTo(-b.width/2, b.height/2);
		context.lineTo(0, 0);
		context.stroke();
		context.restore();
	    }
	}	

	requestAnimationFrame(update);
    }
    
    update();

    function getIsoPoint(point : Point) {
	return {
	    x: point.x * 1 + point.x * 0.5,
	    y: point.y * 1 + point.y * -0.5
	};
    }

    function getRandomColor(){
	return `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}`;
    }

    document.addEventListener('mousemove', (e) => {
	let click : Point = {
	    x: e.clientX - canvas.width/2,
	    y: e.clientY - canvas.height/2
	};

	let point = getIsoPoint(click);

	console.log(point);
    });

// };

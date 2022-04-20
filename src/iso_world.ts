import Scene from './game/scene';
import Game from './game/game';
import Utils from './libs/utils';

interface Point {
    x: number,
    y: number
};

interface Tile {
    x: number,
    y: number,
    z: number,
    width: number,
    height: number,
    color: string
}


export default class IsoWorld extends Scene {

    private _game: Game;

    tiles: Tile[][] = [];
    readonly TILE_WIDTH = 32;
    readonly TILE_HEIGHT = 32;
    readonly Z_LAYER = 0.5;

    mousePointer : Point = {x: 0, y: 0};
    activeTile : Tile = undefined;
    hoverTile : Tile = undefined;

    //inputs
    boundMouseMoveHandler: any;
    boundMouseClickHandler: any;

    constructor(game: Game, sceneName: string, width: number, height: number){
	super();
	this.id = sceneName;
	this.width = width;
	this.height = height;
	this._game = game;
	this.init();
    }

    override init(){
	this.loadTiles();

	this.boundMouseMoveHandler = this.handleMouseMove.bind(this);
	this.boundMouseClickHandler = this.handleMouseClick.bind(this);

	document.addEventListener('mousemove', this.boundMouseMoveHandler);
	document.addEventListener('click', this.boundMouseClickHandler);

    }

    loadTiles(): void {
	for (let i = 0; i < this.height; i++) {
	    this.tiles[i] = [];
	    for (let j = 0; j < this.width; j++) {

		let color : string = '';
		
		if(i == 0 || j == 0 || j == this.width - 1 || i == this.height - 1) {
		    color = Utils.getColor(80, 200, 80, 1);
		} else {
		    let thresold = Math.min(this.height * 11, 255);
		    let g = thresold - (Math.abs((-(Math.floor(this.height / 2)) + i)) * 255 / 10) + thresold - (Math.abs((-(Math.floor(this.width / 2)) + j)) * 255 / 10);
		    color = Utils.getColor(g-255, g , g-255, 1);
		    // color = Utils.getRandomColor();
		}

		this.tiles[i][j] = {
		    x: j,
		    y: i,
		    z: this.Z_LAYER,
		    width: this.TILE_WIDTH,
		    height: this.TILE_HEIGHT,
		    color: color
		};
	    }
	}
    }    


    // @ts-ignore
    override update(deltaTime: number): void {
	// console.log(deltaTime);
    }

    // @ts-ignore
    override render(context: CanvasRenderingContext2D, deltaTime: number): void {
	context.save();
	context.translate(this._game.width/2, this._game.height/2);

	context.clearRect(-this._game.width/2, -this._game.height/2, this._game.width, this._game.height);
	context.fillStyle = "#111111";
	context.fillRect(-this._game.width/2, -this._game.height/2, this._game.width, this._game.height);

	if(this.hoverTile != undefined){
	    if(this.hoverTile.z < (this.Z_LAYER + 0.1)) {
		this.hoverTile.z += deltaTime * 0.001;
	    }
	}

	this.renderTiles(context);
	this.renderCursor(context);

	this.renderDebugText(context, "Scene: " + this.id, 0);
	this.renderDebugText(context, "No. of Tiles: " + this.tiles.length * this.tiles[0].length, 1);
	this.renderDebugText(context, "FPS: " + (1/deltaTime).toFixed(2), 2);

	this.renderInfoText(context, "You can hover over tiles, and select a tile with 'left' click!.", 0);
	this.renderInfoText(context, "You cannot select the border tiles.", 1);	

	context.restore();
    }


    renderDebugText(context: CanvasRenderingContext2D, text: string, index: number): void {
	let padding = 100;
	context.font = "normal 18px consolas"
	let textSize = context.measureText(text);
	context.fillStyle = "red";
	context.fillText(text, this._game.width/2 - textSize.width - padding, -this._game.height/2 + 50 + index * 20);
    }

    renderInfoText(context: CanvasRenderingContext2D, text: string, index: number): void {
	let padding = 50;
	let gap = 30;
	context.font = "normal 18px consolas"
	let textSize = context.measureText(text);
	context.fillStyle = "white";
	context.fillText(text, -textSize.width/2, this._game.height/4 + padding + gap * index);
    }

    renderTiles(context: CanvasRenderingContext2D): void{
	for(let i = 0; i < this.tiles.length; i++){
	    for(let j = 0; j < this.tiles[i].length; j++){

		this.drawIsoTile(context, this.tiles[i][j],
				 {x: -(Math.floor(this.tiles[i].length/2)) + this.tiles[i][j].x,
				  y: -(Math.floor(this.tiles.length/2)) + this.tiles[i][j].y
				 });
		if(this.activeTile != undefined
		    && this.activeTile.x == this.tiles[i][j].x
		    && this.activeTile.y == this.tiles[i][j].y) {

		    this.drawIsoTile(context, this.activeTile,
				     { x: -(Math.floor(this.tiles[i].length/2)) + this.tiles[i][j].x,
				       y: -(Math.floor(this.tiles.length/2)) + this.tiles[i][j].y
				     });
		}

		if(this.hoverTile != undefined
		    && this.hoverTile.x == this.tiles[i][j].x
		    && this.hoverTile.y == this.tiles[i][j].y){

		    this.drawIsoTile(context, this.hoverTile,
				     {
			x: -(Math.floor(this.tiles[i].length / 2)) + this.tiles[i][j].x,
			y: -(Math.floor(this.tiles.length / 2)) + this.tiles[i][j].y
				     });
		}



	    }
	}	
    }

    renderCursor(context: CanvasRenderingContext2D): void{
	context.strokeStyle = 'yellow';
	context.beginPath();
	context.arc(this.mousePointer.x, this.mousePointer.y, 10, 0, Math.PI * 2);
	context.stroke();
	context.closePath();

	context.fillStyle="yellow";
	context.beginPath();
	context.arc(this.mousePointer.x, this.mousePointer.y, 2, 0, Math.PI * 2);
	context.closePath();
	context.fill();

	let isoMousePointer = this.getScreenFromIsoPoint({x: 0, y: 0});
	context.fillStyle="red";
	context.beginPath();
	context.arc(isoMousePointer.x, isoMousePointer.y, 2, 0, Math.PI * 2);
	context.closePath();
	context.fill();		
    }    


    drawTile(context : CanvasRenderingContext2D, tile : Tile, pos : Point) {
	context.strokeStyle = tile.color;
	context.fillStyle = tile.color;    
	let screenPos = {
	    x: pos.x * tile.width,
	    y: pos.y * tile.height
	};

	context.strokeRect(screenPos.x, screenPos.y, tile.width, tile.height);
	context.fillRect(screenPos.x, screenPos.y, tile.width, tile.height);    
    }

    drawIsoTile(context : CanvasRenderingContext2D, tile : Tile, pos : Point) : void {
	context.save();
	let screenPos = this.getScreenFromIsoPoint({ x: pos.x, y: pos.y});
	context.translate(screenPos.x, screenPos.y);

	//top
	context.beginPath();
	context.setLineDash([2, 4]);
	context.moveTo(0, -tile.z * tile.height);
	context.lineTo(tile.width, tile.height/2 - tile.z * tile.height);
	context.lineTo(0, tile.height - tile.z * tile.height);
	context.lineTo(-tile.width, tile.height/2 - tile.z * tile.height);
	context.closePath();
	context.strokeStyle = "black";
	context.fillStyle = tile.color;
	context.stroke();
	context.fill();	

	//right
	context.beginPath();
	context.setLineDash([2, 4]);
	context.moveTo(tile.width, tile.height/2 - tile.z * tile.height);
	context.lineTo(tile.width, tile.height/2);
	context.lineTo(0, tile.height);
	context.lineTo(0, tile.height - tile.z * tile.height);
	context.closePath();
	context.fillStyle = Utils.shadeColor(tile.color, -20);
	// context.fillStyle = "#222222";
	context.stroke();
	context.fill();

	// left
	context.beginPath();
	context.setLineDash([2, 4]);
	context.moveTo(-tile.width, tile.height/2 - tile.z * tile.height);
	context.lineTo(-tile.width, tile.height/2);
	context.lineTo(0, tile.height);
	context.lineTo(0, tile.height - tile.z * tile.height);
	context.closePath();
	context.fillStyle = Utils.shadeColor(tile.color, -50);	
	context.strokeStyle = "black";
	context.stroke();
	context.fill();


	context.restore();
    }

    getScreenFromIsoPoint(point : Point) : Point{
	return {
	    x: (point.x - point.y) * this.TILE_WIDTH,
	    y: (point.x + point.y) * this.TILE_HEIGHT/2
	};
    }

    // getScreenFromIsoPointWithOffset(point : Point) : Point{
    // 	return {
    // 	    x: (point.x - point.y) * TILE_WIDTH/2,
    // 	    y: (point.x + point.y) * TILE_HEIGHT/4
    // 	};
    // }

    getIsoFromScreenPoint(point : Point) : Point{
	return {
	    x: ((0.5 * point.x) / this.TILE_WIDTH) + point.y / this.TILE_HEIGHT,
	    y: ((-0.5 * point.x) / this.TILE_WIDTH) + point.y / this.TILE_HEIGHT
	};
    }

    getIsoFromScreenPointWithZ(point : Point, zIndex: number) : Point{
	return {
	    x: ((0.5 * point.x) / this.TILE_WIDTH) + (point.y + zIndex * this.TILE_HEIGHT) / this.TILE_HEIGHT,
	    y: (((-0.5 * point.x) / this.TILE_WIDTH) + (point.y + zIndex * this.TILE_HEIGHT) / this.TILE_HEIGHT)
	};
    }    

    handleMouseMove(e: MouseEvent): void {
	let click: Point = {
	    x: e.clientX - this._game.width / 2,
	    y: e.clientY - this._game.height / 2
	};
 
	this.mousePointer = click;

	let isoPoint : Point = this.getIsoFromScreenPointWithZ(click, this.Z_LAYER);

	let i = Math.floor(this.tiles.length/2) + Math.floor(isoPoint.y);
	if(i > this.tiles.length - 1 || i < 0) {
	    this.hoverTile = undefined;
	    return;	
	}

	let j = Math.floor(this.tiles[i].length/2) + Math.floor(isoPoint.x);
	if(j > this.tiles[i].length - 1 || j < 0){
	    this.hoverTile = undefined;
	    return;
	}


	this.hoverTile = { ...this.tiles[i][j] };
	this.hoverTile.z = this.Z_LAYER + 0.1;
	this.hoverTile.color = "rgba(255, 255, 0, 0.7)";

    }

    handleMouseClick(e: MouseEvent): void {
	e.preventDefault();
	let click: Point = {
	    x: e.clientX - this._game.width / 2,
	    y: e.clientY - this._game.height / 2
	};

	this.mousePointer = click;

	let isoPoint : Point = this.getIsoFromScreenPointWithZ(click, this.Z_LAYER);

	let i = Math.floor(this.tiles.length/2) + Math.floor(isoPoint.y);
	if(i > this.tiles.length - 2 || i < 1)
	    return;

	let j = Math.floor(this.tiles[i].length/2) + Math.floor(isoPoint.x);
	if(j > this.tiles[i].length - 2 || j < 1)
	    return;
	

	if(this.activeTile !== undefined
	    && this.activeTile.x == this.tiles[i][j].x
	    && this.activeTile.y == this.tiles[i][j].y) {

	    if(this.activeTile.color == this.tiles[i][j].color) {
		this.activeTile.color = 'rgba(200, 50, 50, 0.8)';
		this.activeTile.z = this.Z_LAYER + 0.1
	    }
	    else {
		this.activeTile.color = this.tiles[i][j].color;
		this.activeTile.z = this.Z_LAYER
	    }

	} else {
	    this.activeTile = { ...this.tiles[i][j] };
	    this.activeTile.color = 'rgba(200, 50, 50, 0.8)';
	    this.activeTile.z = this.Z_LAYER + 0.1;
	}
    }    
    
    destroy(): void {
	document.removeEventListener("mousemove", this.boundMouseMoveHandler);
	document.removeEventListener("click", this.boundMouseClickHandler);
    }
    
    
}

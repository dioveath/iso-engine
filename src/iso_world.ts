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
    width: number,
    height: number,
    color: string
}


export default class IsoWorld extends Scene {

    private _game: Game;

    tiles: Tile[][] = [];
    readonly TILE_WIDTH = 32;
    readonly TILE_HEIGHT = 32;

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
		let color : string =  (i == 0 || j == 0 || j == this.width - 1 || i == this.height - 1)
		    ? 'grey'
		    : Utils.getColor(0,
				     Math.min(this.height * 10, 255) - (Math.abs((-(Math.floor(this.height / 2)) + i)) * 255 / 10) + Math.min(this.width * 10, 255) - (Math.abs((-(Math.floor(this.width / 2)) + j)) * 255 / 10),
				     0,
				     255);

		this.tiles[i][j] = {
		    x: j,
		    y: i,
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

	for(let i = 0; i < this.tiles.length; i++){
	    for(let j = 0; j < this.tiles[i].length; j++){
		// this.drawTile(context, this.tiles[i][j], {x: -(this.tiles[i].length/2) + j, y: -(this.tiles.length/2) + i});
		this.drawIsoTile(context, this.tiles[i][j], {x: -(this.tiles[i].length/2) + this.tiles[i][j].x, y: -(this.tiles.length/2) + this.tiles[i][j].y});
	    }
	}	

	if(this.activeTile != undefined) {
	    this.drawIsoTile(context, this.activeTile, {x: -(this.tiles[this.activeTile.y].length/2) + this.activeTile.x, y: -(this.tiles.length/2) + this.activeTile.y});
	}

	if(this.hoverTile != undefined) {
	    this.drawIsoTile(context, this.hoverTile, {x: -(this.tiles[this.hoverTile.y].length/2) + this.hoverTile.x, y: -(this.tiles.length/2) + this.hoverTile.y});
	}    	


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

	context.restore();
    }

    renderMouseCursor(): void {
	
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

	context.beginPath();
	context.setLineDash([2, 5]);
	context.moveTo(0, 0);
	context.lineTo(tile.width, tile.height/2);
	context.lineTo(0, tile.height);
	context.lineTo(-tile.width, tile.height/2);
	context.lineTo(0, 0);
	context.closePath();

	context.strokeStyle = "black";
	context.fillStyle = tile.color;
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
	    x: (0.5 * point.x / this.TILE_WIDTH) + point.y / this.TILE_HEIGHT,
	    y: (-0.5 * point.x / this.TILE_WIDTH) + point.y / this.TILE_HEIGHT
	};
    }

    handleMouseMove(e: MouseEvent): void {
	let click: Point = {
	    x: e.clientX - this._game.width / 2,
	    y: e.clientY - this._game.height / 2
	};

	this.mousePointer = click;

	let isoPoint : Point = this.getIsoFromScreenPoint(click);

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
	this.hoverTile.color = "#ffff00bb";	
    }

    handleMouseClick(e: MouseEvent): void {
	let click: Point = {
	    x: e.clientX - this._game.width / 2,
	    y: e.clientY - this._game.height / 2
	};

	this.mousePointer = click;

	let isoPoint : Point = this.getIsoFromScreenPoint(click);

	let i = Math.floor(this.tiles.length/2) + Math.floor(isoPoint.y);
	if(i > this.tiles.length - 2 || i < 1)
	    return;

	let j = Math.floor(this.tiles[i].length/2) + Math.floor(isoPoint.x);
	if(j > this.tiles[i].length - 2 || j < 1)
	    return;
	

	if(this.activeTile !== undefined && this.activeTile.x == this.tiles[i][j].x && this.activeTile.y == this.tiles[i][j].y) {
	    this.activeTile.color = this.tiles[i][j].color;
	} else {
	    this.activeTile = { ...this.tiles[i][j] };
	    this.activeTile.color = 'red';	
	}
    }    
    
    destroy(): void {
	console.log("destroying scene: " + this.id);
	document.removeEventListener("mousemove", this.boundMouseMoveHandler);
	document.removeEventListener("click", this.boundMouseClickHandler);
    }
    
    
}

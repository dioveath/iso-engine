import Graphics from '../core/graphics';
import Scene from './scene';


export default class Game {
    private _loopId: number;
    private _gameName: string;
    private _scenes: Scene[];
    private _graphics: Graphics;

    private _width: number;
    private _height: number;

    get width () {
	return this._width;
    }

    get height () {
	return this._height;
    }    

    constructor(gameName: string, width: number, height: number){
	this._gameName = gameName;
	this._width = width;
	this._height = height;
	this.init();
    }

    private init(): void {
	document.title = this._gameName;
	this._graphics = new Graphics("canvas", this._width, this._height);
	this._scenes = [];
    }

    public startGame(): void {
	this.gameLoop();
    }

    public addScene(scene: Scene): void {
	this._scenes.push(scene);
    }

    public removeScene(id: string): void {
	this._scenes.filter((s) => {
	    if(s.id == id) {
		s.destroy();
		return true;
	    }
	    return false;
	});
    }

    private _previousTime: number = 0;

    public gameLoop(): void {
	let deltaTime : number = Date.now() as number - this._previousTime;
	this._previousTime = Date.now();

	for(let i = 0; i < this._scenes.length; i++){
	    this._scenes[i].update(deltaTime);
	}

	for(let i = 0; i < this._scenes.length; i++){
	    this._scenes[i].render(this._graphics.context, deltaTime);
	}

	this._loopId = requestAnimationFrame(this.gameLoop.bind(this));
    }

    public destroy(): void {
	for(let i = 0; i < this._scenes.length; i++){
	    this._scenes[i].destroy();
	}

	window.cancelAnimationFrame(this._loopId);
    } 

}

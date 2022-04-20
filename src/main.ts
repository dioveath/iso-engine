import Game from './game/game';
import IsoWorld from './iso_world';

window.onload = runGame;

function runGame(){
    let sceneName = "Iso Tiles";

    let g: Game = new Game("Isometric World", window.innerWidth, window.innerHeight);
    let w: IsoWorld = new IsoWorld(g, sceneName, 10, 10);

    g.addScene(w);
    g.startGame();

    let tilex = document.getElementById("tilesx") as HTMLInputElement;
    let tiley = document.getElementById("tilesy") as HTMLInputElement;
    let generateButton = document.getElementById("generateButton");
    generateButton.onclick = (e) => {
	e.preventDefault();
	g.removeScene(sceneName)

	let newTilesWidth: number = parseInt(tilex.value === '' ? '1' : tilex.value);
	let newTilesHeight: number = parseInt(tiley.value === '' ? '1' : tiley.value);

	let newWorld: IsoWorld = new IsoWorld(g, sceneName, newTilesWidth, newTilesHeight);
	g.addScene(newWorld);	
    }

    let debugUI = document.getElementById("debugUI");
    document.body.addEventListener('keyup', (e) => {
	if (e.key == 'Escape') {
	    if(debugUI.classList.contains('hide')) {
		debugUI.classList.remove('hide');
	    } else {
		debugUI.classList.add('hide');		
	    }
	}
    });    

}






export {}

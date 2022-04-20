import MathUtil from './math';

export default class Utils {

    static getColor(r: number, g : number, b : number, a : number) : string {
	return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    static getRandomColor() : string {
	return `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
    }    

    static shadeColor(color: string, percent: number = -10) : string {
	let sc = color.replace(/^rgba?\(|\s+|\)$/g,'').split(',');
	let nsc = []
	for(let i = 0; i< sc.length; i++){
	    if(i > 2) break;
	    let val = (MathUtil.clamp(0, 100, Math.abs(percent))/100 * 255);
	    if(percent > 0) {
		nsc[i] = MathUtil.clamp(0, 255, parseInt(sc[i]) + val);
	    } else {
		nsc[i] = MathUtil.clamp(0, 255, parseInt(sc[i]) - val);	
	    }	    
	}

	return `rgba(${nsc[0]}, ${nsc[1]}, ${nsc[2]}, ${sc[3] ?? 255})`;
    }

}

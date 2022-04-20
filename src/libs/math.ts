export default class MathUtil {

    static lerp(min: number, max: number, percent: number){
	return min + (max-min) * percent;
    }

    static clamp(min: number, max: number, value: number){
	return Math.min(max, Math.max(value, min));
    }

} 

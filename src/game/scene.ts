export default abstract class Scene {
    id: string;
    width: number;
    height: number;

    abstract init (deltaTime: number) : void;
    abstract update (deltaTime: number) : void;
    abstract render (context: CanvasRenderingContext2D, deltaTime: number): void;
    abstract destroy (): void;
}

import Rectangle = Phaser.GameObjects.Rectangle;
import TileSprite = Phaser.GameObjects.TileSprite;

export default class Preloader extends Phaser.Scene
{
	public constructor()
	{
		super("Preloader");
	}

	public editorCreate(): void
	{
		// progressBar
		const progressBar : Rectangle = this.add.rectangle(512, 384, 468, 32);
		progressBar.isFilled = true;
		progressBar.fillColor = 14737632;
		progressBar.isStroked = true;

		// background6
		const background6 : TileSprite = this.add.tileSprite(512, 384, 256, 256, "Background6");
		background6.scaleX = 4;
		background6.scaleY = 3;
		background6.tileScaleX = 0.75;

		this.progressBar = progressBar;

		this.events.emit("scene-awake");
	}

	private progressBar!: Phaser.GameObjects.Rectangle;

    public init () : void
    {
		this.editorCreate();

        const bar : Rectangle = this.add.rectangle(this.progressBar.x - this.progressBar.width / 2 + 4, this.progressBar.y, 4, 28, 0xffffff)

        this.load.on('progress', (progress: number) : void =>
		{
            bar.width = 4 + (460 * progress);
        });
    }

    public preload () : void
    {
        this.load.pack('preload', 'assets/preload-asset-pack.json');
    }

    public create () : void
    {
        this.scene.start('MainMenu');
    }
}

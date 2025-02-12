import Text = Phaser.GameObjects.Text;
import TileSprite = Phaser.GameObjects.TileSprite;

export default class Game extends Phaser.Scene
{
	private player : Phaser.Physics.Arcade.Sprite;
	private jumpVelocity : number = -200;
	//private scoreCounter : number = 0;

	public constructor()
	{
		super("Game");
	}

	public editorCreate() : void
	{
		const background6 : TileSprite = this.add.tileSprite(512, 384, 256, 256, "Background6");
		background6.scaleX = 4;
		background6.scaleY = 3;
		background6.tileScaleX = 0.75;

		const text : Text = this.add.text(85, 57, "", {});
		text.setOrigin(0.5, 0.5);
		text.text = "Score:";
		text.setStyle({ "align": "center", "color": "#ffffff", "fontFamily": "Arial Black", "fontSize": "38px", "stroke": "#000000", "strokeThickness": 8 });

		this.player = this.physics.add.sprite(65, 476, "AllBird1", 24).setGravityY(800).setCollideWorldBounds(true);
		this.player.scaleX = 5;
		this.player.scaleY = 5;
		this.input.on("pointerdown", this.fly, this);
		this.input.on("pointerup", this.fall, this);

		this.events.emit("scene-awake");
	}

	public create() : void
	{
		this.editorCreate();
	}

	private fly() : void
	{
		this.player.setGravityY(0);
		this.player.setVelocityY(this.jumpVelocity);
	}

	private fall() : void
	{
		this.player.setGravityY(300);
	}

	public update() : void
	{
		// Rotate the bird based on its velocity
		if (this.player.body !== null && this.player.body.velocity.y < 0)
		{
			this.player.setAngle(-20); // Slightly tilt up
		}
		else
		{
			this.player.setAngle(20); // Slightly tilt down
		}

		if (this.player.y > 600)
		{
			//this.scene.restart();
		}
	}
}

import Text = Phaser.GameObjects.Text;
import TileSprite = Phaser.GameObjects.TileSprite;

export default class Game extends Phaser.Scene
{
	private player!: Phaser.Physics.Arcade.Sprite;
	private jumpVelocity : number = -200;
	private pipeGroup!: Phaser.Physics.Arcade.Group;
	private pipeSpawnTimer!: Phaser.Time.TimerEvent;

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

		this.pipeGroup = this.physics.add.group({
			allowGravity: false
		});

		// Spawn pipes every 1.5 seconds
		this.pipeSpawnTimer = this.time.addEvent({
			delay: 1500, // Spawn every 1.5 seconds
			callback: this.spawnPipe,
			callbackScope: this,
			loop: true
		});

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
	private spawnPipe(): void
	{
		const pipeX = 1200; // Spawn just beyond the right side
		const pipeY : number = Phaser.Math.Between(100, 400); // Random height for variety

		const randomPipe : number = Phaser.Math.Between(0, 7);

		const pipe = this.pipeGroup.create(pipeX, pipeY, "PipeStyle1", randomPipe);
		pipe.scaleX = 3;
		pipe.scaleY = 3;
		pipe.setVelocityX(-200);
		pipe.setOrigin(0.5, 0.5);

		pipe.setActive(true);
		pipe.setVisible(true);

		pipe.body!.onWorldBounds = true;
		pipe.body!.onCollide = true;

		pipe.body!.checkCollision.left = true;
		pipe.body!.checkCollision.right = false;
		pipe.body!.checkCollision.up = false;
		pipe.body!.checkCollision.down = false;
	}

	public update() : void
	{
		if (this.player.body!.velocity.y < 0)
		{
			this.player.setAngle(-20);
		}
		else
		{
			this.player.setAngle(20);
		}

		if (this.player.y > 600)
		{
			//this.scene.restart();
		}

		this.pipeGroup.getChildren().forEach((pipe) =>
		{
			if (pipe instanceof Phaser.GameObjects.Image && pipe.x < -50)
			{
				pipe.destroy();
			}
		});
	}
}

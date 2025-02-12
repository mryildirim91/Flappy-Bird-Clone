import Text = Phaser.GameObjects.Text;
import TileSprite = Phaser.GameObjects.TileSprite;
import GameObject = Phaser.GameObjects.GameObject;

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
		const background6 : TileSprite = this.add.tileSprite(512, 384, 256, 256, "Background5");
		background6.scaleX = 4;
		background6.scaleY = 3;
		background6.tileScaleX = 0.75;
		background6.setDepth(-1);

		const text : Text = this.add.text(85, 57, "", {});
		text.setOrigin(0.5, 0.5);
		text.text = "Score:";
		text.setStyle({ "align": "center", "color": "#ffffff", "fontFamily": "Arial Black", "fontSize": "38px", "stroke": "#000000", "strokeThickness": 8 });
		text.setDepth(5)

		this.player = this.physics.add.sprite(65, 476, "AllBird1", 24).setGravityY(800).setCollideWorldBounds(true);
		this.player.scaleX = 4;
		this.player.scaleY = 4;
		this.player.setDepth(4)

		this.input.on("pointerdown", this.fly, this);
		this.input.on("pointerup", this.fall, this);

		this.pipeGroup = this.physics.add.group({
			allowGravity: false
		});

		this.pipeSpawnTimer = this.time.addEvent({
			delay: Phaser.Math.Between(2000, 3000),
			callback: this.spawnPipe,
			callbackScope: this,
			loop: true
		});
		this.physics.add.collider(this.player, this.pipeGroup, this.gameOver, undefined, this);
		this.events.emit("scene-awake");
	}

	public create() : void
	{
		this.editorCreate();
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

		this.destroyPipe();
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
		let pipeY : number = Phaser.Math.Between(0, 170); // Random height for variety

		const randomPipe : number = Phaser.Math.Between(0, 7);

		for (let i : number = 0; i < 2; i++)
		{
			if(i == 1)
			{
				pipeY += 768;
			}

			const pipe = this.pipeGroup.create(pipeX, pipeY, "PipeStyle1", randomPipe);
			pipe.setScale(3, 8);
			pipe.setVelocityX(-200);
			pipe.setOrigin(0.5, 0.5);
			pipe.setDepth(1);
			pipe.setImmovable(true);
			pipe.body!.allowGravity = false;
			pipe.body!.setSize(pipe.width, pipe.height, true);
		}
	}

	private destroyPipe() :void
	{
		this.pipeGroup.getChildren().forEach((pipe : GameObject) : void =>
		{
			if (pipe instanceof Phaser.Physics.Arcade.Sprite && pipe.x < -50)
			{
				pipe.destroy();
			}
		});
	}

	private gameOver(): void
	{
		// ✅ Stop only the player, not the pipes
		this.player.setVelocity(0, 0); // Stop movement
		this.player.setTint(0xff0000); // Optional: Tint red to show game over
		//this.player.anims.stop(); // Optional: Stop animation

		// ✅ Disable physics for the player only, NOT the whole physics world
		this.physics.world.disableBody(this.player.body);

		// ✅ Pipes keep moving, but stop spawning
		this.pipeSpawnTimer.remove(); // Stop new pipes from spawning

		//this.time.delayedCall(1000, () => { // Restart after 1 sec
			//this.scene.restart();
		//});
	}

}

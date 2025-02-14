import Text = Phaser.GameObjects.Text;
import TileSprite = Phaser.GameObjects.TileSprite;
import GameObject = Phaser.GameObjects.GameObject;
import Sprite = Phaser.Physics.Arcade.Sprite;
import Image = Phaser.GameObjects.Image;

export default class Game extends Phaser.Scene
{
	private player!: Phaser.Physics.Arcade.Sprite;
	private jumpVelocity : number = -200;
	private pipeGroup!: Phaser.Physics.Arcade.Group;
	private pipeSpawnTimer!: Phaser.Time.TimerEvent;
	private score : number = 0;
	private scoreText : Text;
	private isGameOver : boolean =  false;
	private gameOverTimer! : Phaser.Time.TimerEvent;

	public constructor()
	{
		super("Game");
	}

	public editorCreate() : void
	{
		this.isGameOver = false;
		this.score = 0;
		const background6 : TileSprite = this.add.tileSprite(512, 384, 256, 256, "Background5");
		background6.scaleX = 4;
		background6.scaleY = 3;
		background6.tileScaleX = 0.75;
		background6.setDepth(-1);

		this.scoreText = this.add.text(120, 57, "", {});
		this.scoreText.setOrigin(0.5, 0.5);
		this.scoreText.setText("Score: " + this.score);
		this.scoreText.setStyle({ "align": "center", "color": "#ffffff", "fontFamily": "Arial Black", "fontSize": "38px", "stroke": "#000000", "strokeThickness": 8 });
		this.scoreText.setDepth(5)

		const colliderSizeModifier: number = 0.5;
		this.player = this.physics.add.sprite(65, 476, "AllBird1", 0).setGravityY(800).setCollideWorldBounds(true);
		this.player.body!.setSize(this.player.width * colliderSizeModifier, this.player.height * colliderSizeModifier, true);
		this.player.scaleX = 4;
		this.player.scaleY = 4;
		this.player.setDepth(4)

		this.player.anims.create({
			key: "flap",
			frames: this.anims.generateFrameNumbers("AllBird1", { start: 0, end: 2 }),
			frameRate: 10,
			repeat: -1
		});

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

		this.player.play("flap", true);

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

		this.destroyPipe();
	}

	private fly() : void
	{
		if (this.isGameOver) return;
		this.player.setGravityY(0);
		this.player.setVelocityY(this.jumpVelocity);
	}

	private fall() : void
	{
		if (this.isGameOver) return;
		this.player.setGravityY(300);
	}

	private spawnPipe(): void
	{
		const pipeX = 1200; // Spawn just beyond the right side
		const secondPipeOffset = 768;
		let pipeY : number = Phaser.Math.Between(0, 170); // Random height for variety

		const randomPipe : number = Phaser.Math.Between(0, 7);

		for (let i : number = 0; i < 2; i++)
		{
			if(i == 1)
			{
				pipeY += secondPipeOffset;
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

		const scoreZone : Sprite = this.physics.add.sprite(pipeX + 100, secondPipeOffset * 0.5, "").setOrigin(0.5, 0.5).setAlpha(0);
		scoreZone.setSize(50, 500);
		scoreZone.setDepth(2)
		scoreZone.setImmovable(true);
		scoreZone.setVelocityX(-200);
		scoreZone.body!.allowGravity = false;

		this.physics.add.overlap(this.player, scoreZone, () : void => {
			scoreZone.destroy();
			this.score += 1;
			this.scoreText.setText("Score: " + this.score);
		}, undefined, this);
	}

	private destroyPipe() : void
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
		this.isGameOver = true;
		this.cameras.main.shake(200, 0.01);

		this.player.setVelocity(0, 0);
		this.player.anims.remove("flap");
		this.physics.world.disableBody(this.player.body!);
		this.pipeSpawnTimer.remove();
		this.stopPipes()

		this.gameOverTimer = this.time.addEvent({
			delay: 1500,
			callback: this.openGameOverUI,
			callbackScope: this,
			loop: false
		});
	}

	private openGameOverUI() : void
	{
		const gameOverText : Text = this.add.text(512, 768 * 0.5, "", {});
		gameOverText.scaleX = 2;
		gameOverText.scaleY = 2;
		gameOverText.setOrigin(0.5, 0.5);
		gameOverText.setDepth(10)
		gameOverText.text = "GAME OVER";
		gameOverText.setStyle({ "align": "center", "color": "#ffffff", "fontFamily": "Arial Black", "fontSize": "38px", "stroke": "#000000", "strokeThickness": 8 });

		const replayButton : Image = this.add.image(512, 675, "AllBird1", 0).setInteractive();
		replayButton.scaleX = 10;
		replayButton.scaleY = 10;
		replayButton.setDepth(11)

		replayButton.on("pointerover", () : void =>
		{
			replayButton.setTexture("AllBird1", 12)
		});

		replayButton.on("pointerout", () : void =>
		{
			replayButton.setTexture("AllBird1", 0)
		});

		replayButton.on("pointerdown", () : void =>
		{
			this.scene.restart();
		})

		const replayText : Text = this.add.text(517, 691, "", {});
		replayText.setOrigin(0.5, 0.5);
		replayText.text = "Replay";
		replayText.setStyle({ "align": "center", "fontSize": "46px", "fontStyle": "bold" });
		replayText.setDepth(12)

		this.gameOverTimer.remove();
	}

	private stopPipes() : void
	{
		this.pipeGroup.getChildren().forEach((pipe : GameObject) =>
		{
			if (pipe instanceof Phaser.Physics.Arcade.Sprite) {
				pipe.setVelocityX(0);
			}
		});
	}
}

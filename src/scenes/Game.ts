import Text = Phaser.GameObjects.Text;
import TileSprite = Phaser.GameObjects.TileSprite;
import GameObject = Phaser.GameObjects.GameObject;
import Image = Phaser.GameObjects.Image;
import Player from "../scripts/Player.ts";
import PipeSpawner from "../scripts/PipeSpawner.ts";

export default class Game extends Phaser.Scene
{
	private player!: Player
	private scoreText : Text;
	private isGameOver : boolean =  false;
	private gameOverTimer! : Phaser.Time.TimerEvent;
	private pipeSpawner!: PipeSpawner;

	public constructor()
	{
		super("Game");
	}

	public editorCreate() : void
	{
		this.isGameOver = false;
		const background6 : TileSprite = this.add.tileSprite(this.scale.width / 2 , this.scale.height / 2, 256, 256, "Background5");
		background6.scaleX = 4;
		background6.scaleY = 3;
		background6.tileScaleX = 0.75;
		background6.setDepth(-1);

		this.scoreText = this.add.text(120, 57, "Score: 0", {
			fontSize: "38px",
			color: "#ffffff",
			fontFamily: "Arial Black",
			stroke: "#000000",
			strokeThickness: 8
		}).setOrigin(0.5).setDepth(5);

		this.player = new Player(this, 65, 476, "AllBird1");
		this.pipeSpawner = new PipeSpawner(this, this.scoreText, this.player);

		this.input.on("pointerdown", () => this.player.fly());
		this.input.on("pointerup", () => this.player.fall());
		this.physics.add.collider(this.player, this.pipeSpawner.getGroup(), this.gameOver, undefined, this);

		this.events.emit("scene-awake");
	}

	public create() : void
	{
		this.editorCreate();
	}

	public update() : void
	{
		if (!this.isGameOver)
		{
			this.player.setAngle(this.player.body!.velocity.y < 0 ? -20 : 20);
		}

		this.destroyPipe();
	}

	private destroyPipe() : void
	{
		this.pipeSpawner.getGroup().getChildren().forEach((pipe : GameObject) : void =>
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
		this.player.stopPlayer();
		this.pipeSpawner.stopSpawning();

		this.gameOverTimer = this.time.addEvent({
			delay: 1500,
			callback: this.openGameOverUI,
			callbackScope: this,
			loop: false
		});
	}

	private openGameOverUI() : void
	{
		const gameOverText : Text = this.add.text(this.scale.width / 2, this.scale.height / 2, "", {});
		gameOverText.scaleX = 2;
		gameOverText.scaleY = 2;
		gameOverText.setOrigin(0.5, 0.5);
		gameOverText.setDepth(10)
		gameOverText.text = "GAME OVER";
		gameOverText.setStyle({ "align": "center", "color": "#ffffff", "fontFamily": "Arial Black", "fontSize": "38px", "stroke": "#000000", "strokeThickness": 8 });

		const replayButton : Image = this.add.image(this.scale.width / 2, this.scale.width / 1.5, "AllBird1", 0).setInteractive();
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

		const replayText : Text = this.add.text(this.scale.width / 2, this.scale.width / 1.5, "", {});
		replayText.setOrigin(0.5, 0.5);
		replayText.text = "Replay";
		replayText.setStyle({ "align": "center", "fontSize": "46px", "fontStyle": "bold" });
		replayText.setDepth(12)

		this.gameOverTimer.remove();
	}
}

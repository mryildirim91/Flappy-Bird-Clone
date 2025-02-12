import TileSprite = Phaser.GameObjects.TileSprite;
import Text = Phaser.GameObjects.Text;
import Image = Phaser.GameObjects.Image;

export default class MainMenu extends Phaser.Scene
{
	public constructor()
	{
		super("MainMenu");
	}

	public editorCreate(): void
	{
		const background : TileSprite = this.add.tileSprite(512, 384, 256, 256, "Background6");
		background.scaleX = 4;
		background.scaleY = 3;
		background.tileScaleX = 0.75;

		const headerText : Text = this.add.text(512, 60, "", {});
		headerText.scaleX = 2;
		headerText.scaleY = 2;
		headerText.setOrigin(0.5, 0.5);
		headerText.text = "Flappy Bird";
		headerText.setStyle({ "align": "center", "color": "#ffffff", "fontFamily": "Arial Black", "fontSize": "38px", "stroke": "#000000", "strokeThickness": 8 });

		const playButton : Image = this.add.image(512, 675, "AllBird1", 0).setInteractive();
		playButton.scaleX = 10;
		playButton.scaleY = 10;

		playButton.on("pointerover", () : void =>
		{
			playButton.setTexture("AllBird1", 12)
		});

		playButton.on("pointerout", () : void =>
		{
			playButton.setTexture("AllBird1", 0)
		});

		playButton.on("pointerdown", () : void =>
		{
			this.scene.start('Game');
		})

		const playText : Text = this.add.text(517, 691, "", {});
		playText.setOrigin(0.5, 0.5);
		playText.text = "Play";
		playText.setStyle({ "align": "center", "fontSize": "46px", "fontStyle": "bold" });

		this.events.emit("scene-awake");
	}

	public create () : void
	{
		this.editorCreate();
	}
}
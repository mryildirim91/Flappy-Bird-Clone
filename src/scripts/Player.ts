import Phaser from "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite
{
    private jumpVelocity: number = -200;
    private isGameOver: boolean = false;

    public constructor(scene: Phaser.Scene, x: number, y: number, texture: string)
    {
        super(scene, x, y, texture);

        scene.physics.add.existing(this);
        this.setGravityY(800).setCollideWorldBounds(true);
        this.setScale(4);
        this.setDepth(4)

        const colliderSizeModifier = 0.5;
        this.body!.setSize(this.width * colliderSizeModifier, this.height * colliderSizeModifier, true);

        scene.add.existing(this);

        this.createAnimations(scene);

        this.play("flap", true);
    }

    private createAnimations(scene: Phaser.Scene): void
    {
        if (scene.anims.exists("flap")) return;
        scene.anims.create({
            key: "flap",
            frames: scene.anims.generateFrameNumbers("AllBird1", { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });
    }

    public fly(): void
    {
        if (this.isGameOver) return;
        this.setGravityY(0);
        this.setVelocityY(this.jumpVelocity);
    }

    public fall(): void
    {
        if (this.isGameOver) return;
        this.setGravityY(300);
    }

    public stopPlayer(): void
    {
        this.isGameOver = true;
        this.setVelocity(0, 0);
        this.anims.stop()
        this.anims.remove("flap");
        this.scene.physics.world.disableBody(this.body!);
    }
}

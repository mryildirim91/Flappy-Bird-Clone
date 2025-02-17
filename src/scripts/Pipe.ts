import Phaser from "phaser";

export default class Pipe extends Phaser.Physics.Arcade.Sprite
{
    public constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: number)
    {
        super(scene, x, y, texture, frame);

        scene.physics.add.existing(this);
        this.setScale(3, 8);
        this.setVelocityX(-200);
        this.setOrigin(0.5, 0.5);
        this.setDepth(1);
        this.setImmovable(true);
        this.body!.allowGravity = false;
        this.body!.setSize(this.width, this.height, true);

        scene.add.existing(this);
    }
}

import Phaser from "phaser";
import Sprite = Phaser.Physics.Arcade.Sprite;
import Player from "./Player.ts";

export default class PipeSpawner
{
    private readonly scene: Phaser.Scene;
    private readonly pipeGroup: Phaser.Physics.Arcade.Group;
    private spawnTimer!: Phaser.Time.TimerEvent;
    private score: number = 0;
    private scoreText: Phaser.GameObjects.Text;
    private readonly player : Player

    public constructor(scene: Phaser.Scene, scoreText: Phaser.GameObjects.Text, player : Player)
    {
        this.scene = scene;
        this.player = player;
        this.pipeGroup = scene.physics.add.group({allowGravity: false});
        this.scoreText = scoreText;
        this.startSpawning();
    }

    private startSpawning(): void
    {
        this.spawnTimer = this.scene.time.addEvent({
            delay: Phaser.Math.Between(2000, 3000),
            callback: this.spawnPipes,
            callbackScope: this,
            loop: true
        });
    }

    private spawnPipes(): void
    {
        const pipeX : number = this.scene.scale.width + 200;
        const secondPipeOffset : number = this.scene.scale.height;
        let pipeY : number = Phaser.Math.Between(0, 170);
        const randomPipe : number = Phaser.Math.Between(0, 7);

        for (let i : number = 0; i < 2; i++)
        {
            if(i == 1)
            {
                pipeY += secondPipeOffset;
            }

            const pipe = this.pipeGroup.create(pipeX, pipeY, "PipeStyle1", randomPipe) as Phaser.Physics.Arcade.Sprite;
            pipe.setScale(3, 8);
            pipe.setVelocityX(-200);
            pipe.setOrigin(0.5, 0.5);
            pipe.setDepth(1);
            pipe.setImmovable(true);
            pipe.body!.allowGravity = false;
            pipe.body!.setSize(pipe.width * 0.9, pipe.height * 0.9, true);
        }

        const scoreZone : Sprite = this.scene.physics.add.sprite(pipeX + 100, secondPipeOffset / 2, "").setOrigin(0.5, 0.5).setAlpha(0);
        scoreZone.setSize(50, 500);
        scoreZone.setDepth(2)
        scoreZone.setImmovable(true);
        scoreZone.setVelocityX(-200);
        scoreZone.body!.allowGravity = false;

        this.scene.physics.add.overlap(this.player, scoreZone, () : void => {
            scoreZone.destroy();
            this.score += 1;
            this.scoreText.setText("Score: " + this.score);
        }, undefined, this);
    }

    public stopSpawning(): void
    {
        this.spawnTimer.remove();
        this.pipeGroup.getChildren().forEach(pipe => {
            if (pipe instanceof Phaser.Physics.Arcade.Sprite) {
                pipe.setVelocityX(0);
            }
        });
    }

    public getGroup(): Phaser.Physics.Arcade.Group
    {
        return this.pipeGroup;
    }
}

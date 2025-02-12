import { Scene } from 'phaser';

export default class Boot extends Scene
{
    public constructor ()
    {
        super('Boot');
    }

    public preload () : void
    {
        this.load.pack('pack', 'assets/boot-asset-pack.json');
    }

    public create () : void
    {
        this.scene.start('Preloader');
    }
}

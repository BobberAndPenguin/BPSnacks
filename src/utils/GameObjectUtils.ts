import Phaser from 'phaser';

export default class GameObjectUtils {
    static addShadowToObject(object : Phaser.Physics.Arcade.Sprite, scene : Phaser.Scene) {
        const shadow = scene.add.graphics({ x: object.x, y: object.y });
        shadow.fillStyle(0x8e716d, 0.6);
        const shadowEllipse = new Phaser.Geom.Ellipse(0, 0, 32, 16);
        shadow.fillEllipseShape(shadowEllipse);
        object.setPipeline("ShadowPipeline", shadow);
    
        // keep the shadow in sync with the object
        shadow.update = () => {
            shadow.x = object.x;
            shadow.y = object.y + 10;
        };
    
        // return the shadow sprite
        return shadow;
    }
}

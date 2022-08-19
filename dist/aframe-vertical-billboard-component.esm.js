/**** (re)define a component for A-Frame ****/
delete AFRAME.components['billboard'];
AFRAME.registerComponent('billboard', {
    dependencies: ['camera'],
    schema: {
        'map': { type: 'map' },
        'width': { type: 'number' },
        'height': { type: 'number' }
    },
    /**** init ****/
    init: function () {
        this.Texture = undefined;
        this.Material = new THREE.MeshBasicMaterial({
            transparent: true, alphaTest: 0.5
        });
        this.Mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.Material);
        this.Group = new THREE.Group();
        this.Group.add(this.Mesh);
        this.el.setObject3D('mesh', this.Group);
        this.Origin = new THREE.Vector3();
        this.Target = new THREE.Vector3();
    },
    /**** update ****/
    update: function (oldData) {
        var _this = this;
        if ((oldData == null) || (oldData.map == null) ||
            (oldData.map !== this.data.map)) {
            if (this.Texture != null) {
                this.Texture.dispose();
            }
            var newMap = this.data.map;
            this.Texture = new THREE.TextureLoader().load(newMap instanceof Image ? newMap.src : newMap, function (Texture) {
                _this.Material.map = Texture;
                _this.Material.needsUpdate = true;
                updateSizeOf(_this);
            });
        }
        if ((oldData == null) ||
            (oldData.width !== this.data.width) ||
            (oldData.height !== this.data.height)) {
            updateSizeOf(this);
        }
    },
    /**** tick ****/
    tick: function () {
        var Camera = this.el.sceneEl.getObject3D('camera');
        Camera.getWorldPosition(this.Target);
        this.Group.getWorldPosition(this.Origin);
        this.Target.setY(this.Origin.y);
        this.Group.lookAt(this.Target);
    },
    /**** remove ****/
    remove: function () {
        if (this.Mesh != null) {
            this.el.removeObject3D('mesh');
        }
        if (this.Texture != null) {
            this.Texture.dispose();
        }
        if (this.Material != null) {
            this.Material.dispose();
        }
    }
});
/**** updateSizeOf ****/
function updateSizeOf(Billboard) {
    var Width = Billboard.data.width;
    var Height = Billboard.data.height;
    if ((Width === 0) && (Height === 0)) {
        Height = 1;
    }
    if ((Width === 0) || (Height === 0)) {
        var Texture = Billboard.Texture;
        if ((Texture != null) && (Texture.image != null) &&
            Texture.image.complete &&
            (Texture.image.naturalWidth !== 0) && (Texture.image.naturalHeight !== 0)) {
            var AspectRatio = Texture.image.naturalWidth / Texture.image.naturalHeight;
            if (Width === 0) {
                Width = Height * AspectRatio;
            }
            else {
                Height = Width / AspectRatio;
            }
        }
    }
    Billboard.Mesh.scale.set(Width, Height, 1);
    Billboard.Mesh.position.set(0, Height / 2, 0); // affected by scale!
}
//# sourceMappingURL=aframe-vertical-billboard-component.esm.js.map

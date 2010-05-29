function StageAssistant() {
}

StageAssistant.prototype.setup = function() {
	this.controller.pushScene({name: "main", disableSceneScroller: true});
	this.controller.setWindowOrientation("free");
};
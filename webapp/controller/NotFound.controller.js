sap.ui.define([
	"braskem/com/bm/zmmbme_attach/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("braskem.com.bm.zmmbme_attach.controller.NotFound", {

		onInit : function() {
			this.getRouter().getTarget("notFound").attachDisplay(this._targetDisplay);
		}, 
		
		onNavBack : function (oEvent){
			if (this._oData && this._oData.fromTarget) {
				this.getRouter().getTargets().display(this._oData.fromTarget);
				delete this._oData.fromTarget;
				return;
			}

			// call the parent's onNavBack
			BaseController.prototype.onNavBack.apply(this, arguments);
		},
		
		_targetDisplay : function (oEvent) {
			this._oData = oEvent.getParameter("data");
		}

	});
	
});
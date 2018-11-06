sap.ui.define([
	"sap/ui/core/mvc/Controller", 
	"sap/ui/core/routing/History", 
	"braskem/com/bm/zmmbme_attach/util/Formatter",
	"braskem/com/bm/zmmbme_attach/model/StatusDocumento"
], function(Controller, History, Formatter, StatusDocumento) {
	"use strict";

	return Controller.extend("braskem.com.bm.zmmbme_attach.controller.S0_App", {
		
		oFormatter: Formatter, 
		oStatusDoc: StatusDocumento,
		
		getRouter : function() {
			return this.getOwnerComponent().getRouter();
		}, 
		
		onNavBack: function (oEvent) {
			var oHistory, sPreviousHash;

			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("mainScreen", {}, true /*no history*/);
			}
		}

	});

});
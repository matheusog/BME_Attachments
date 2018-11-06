sap.ui.define([
	"braskem/com/bm/zmmbme_attach/controller/BaseController", 
	"sap/ui/generic/app/navigation/service/NavigationHandler",
    "sap/ui/generic/app/navigation/service/NavType"
], function(BaseController, NavigationHandler, NavType) {
	"use strict";

	return BaseController.extend("braskem.com.bm.zmmbme_attach.controller.S1_MainScreen", {

		onInit: function() {
			this.getRouter().getRoute("mainScreen").attachMatched(this._routeMatched, this);
			
			// create an instance of the navigation handler
			this._oNavigationHandler = new NavigationHandler(this);
			
		},
		
		_routeMatched : function(oEvent) {

		}
	});

});
sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device", 
	"braskem/com/bm/zmmbme_attach/model/StatusDocumento",
	"braskem/com/bm/zmmbme_attach/model/TipoDocumento"
], function(JSONModel, Device, StatusDocumento, TipoDocumento) {
	"use strict";

	return {

		createDeviceModel: function() {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		
		createStatusDocumento: function() {
			return StatusDocumento;
		},
		
		createStatusDocumentoModel: function() {
			var oModel = new JSONModel(StatusDocumento);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		
		createTipoDocumentoModel: function() {
			return TipoDocumento;
		} 
		
		
	};
});
sap.ui.define([
	"braskem/com/bm/zmmbme_attach/model/models"
], function(models) {
	"use strict";

	return {
		
		formatStateStatus : function(sStatus) {
			return models.createStatusDocumento().getStatusState(sStatus);
		}
	};
}, true);
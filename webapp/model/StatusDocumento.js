sap.ui.define([
	"sap/ui/core/ValueState"
], function(ValueState) {
	"use strict";

	return {
		STATUS_APROVADO : "A",
		STATUS_CANCELADO : "C",
		STATUS_PENDENTE: "P", 
		STATUS_REJEITADO: "R", 
		
		getStatusState : function(sStatus) {
			var sState = ValueState.None; 
			switch (sStatus) {
				case this.STATUS_APROVADO:
					sState = ValueState.Success;
					break;
				case this.STATUS_CANCELADO:
					sState = ValueState.Error;
					break;
				case this.STATUS_PENDENTE:
					sState = ValueState.Warning;
					break;
				case this.STATUS_REJEITADO:
					sState = ValueState.Error;
					break;
			}
			return sState;
		}
	};
});
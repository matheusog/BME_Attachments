sap.ui.define([
	"braskem/com/bm/zmmbme_attach/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel"
], function(BaseController, Filter, FilterOperator, JSONModel) {
	"use strict";

	return BaseController.extend("braskem.com.bm.zmmbme_attach.controller.S1_DocList", {
		
		onInit: function() {
			this.getRouter().getRoute("mainScreen").attachMatched(this._routeMatched, this);
			this._oViewModel = this._createViewModel();
			this.getView().setModel(this._oViewModel, 'master');
			
			this._oComponent = this.getOwnerComponent();
			this._oBundle	 = this._oComponent.getModel('i18n').getResourceBundle();
			this._oList 	 = this.getView().byId('docList');
			this._oSearch	 = this.getView().byId('masterSearch');
		},
		
		onSearchDocument: function(oEvent) {
			var bClear 		= oEvent.getParameter('clearButtonPressed');
			var bRefresh 	= oEvent.getParameter('refreshButtonPressed');
			var sQuery		= oEvent.getParameter('query');
			
			if(bClear || !sQuery) {
				this.getRouter().navTo('mainScreen');
			} else {
				this.getRouter().navTo('mainScreen', {
					query: {
						idDocumento: sQuery
					}
				}, true);	
			}
		}, 
		
		onPressDocumentList: function(oEvent){
			var oContext = oEvent.getSource().getBindingContext('Attachments');
			var oObject = oContext.getObject();
			
			this.getRouter().navTo('mainDetail', {
				idDocumento: oObject.DocNum, 
				tipoDocumento: oObject.TipoDoc
			});
		}, 
		
		_createViewModel: function() {
			return new JSONModel({
				masterSearch: ''
			});
		}, 
		
		_filterList: function(oFilter) {
			this._oList.getBinding('items').filter(oFilter);
		},
		
		_routeMatched : function(oEvent) {
			var oArguments = oEvent.getParameter('arguments');
			var oQuery = oArguments["?query"];
			if(oQuery && oQuery.idDocumento) { 
				var sDocnum = oQuery.idDocumento;
				
				var oModelAtt = this._oComponent.getModel('Attachments');
				
				this._oViewModel.setProperty('/masterSearch', sDocnum);
				
				var aFilters = [(new Filter({path: 'DocNum', operator: FilterOperator.EQ, value1: sDocnum }))];
			
				var oFilter = 
					new Filter({
						filters: aFilters,
						bAnd: true
				});
				
				this._filterList(oFilter);
			} else {
				this._filterList([]);
			}	
		}
		
	});

});
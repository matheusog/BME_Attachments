sap.ui.define([
	"braskem/com/bm/zmmbme_attach/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/UploadCollectionItem",
	"sap/m/UploadCollectionParameter"
], function(BaseController, Filter, FilterOperator, JSONModel, MessageToast, UploadCollectionItem, UploadCollectionParameter) {
	"use strict";

	return BaseController.extend("braskem.com.bm.zmmbme_attach.controller.S1_DocAttachments", {

 		onInit: function() {
			this.getRouter().getRoute("mainDetail").attachMatched(this._routeMatched, this);
			
			this._oComponent = this.getOwnerComponent();
			this._oBundle	 = this._oComponent.getModel('i18n').getResourceBundle();
			this._oUploadCollection = this.getView().byId('attachList');
 			this._oViewModel = this._createViewModel();
 			
 			this._oUploadCollection.addEventDelegate({
				onBeforeRendering: function() {
					this.byId("attachmentTitle").setText(this._getAttachmentTitleText());
				}.bind(this)
			});
 		},
		
		onBeforeUploadStarts: function(oEvent) {
			// Header Slug
			var oCustomerHeaderSlug = new UploadCollectionParameter({
				name: "slug",
				value: oEvent.getParameter("fileName")
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
		},
		
		onBindingChange : function (oEvent) {
			// No data for the binding
			if (!this.getView().getBindingContext('Attachments')) {
				this.getRouter().getTargets().display("notFound");
			} else if(this._oViewModel) {
				this._oViewModel.setProperty('/statusDoc', this.getView().getBindingContext('Attachments').getProperty('StatusDoc'));
			}
		},
		
		onDeleteItem: function(oEvent) {
			var aSelectedItems = this._oUploadCollection.getSelectedItems();
			if (aSelectedItems) {
				/*
				if(aSelectedItems.length > 1) {
					MessageToast.show(this._oBundle.getText('errorMultiDelete'));
					return;
				}
				*/
				for (var i = 0; i < aSelectedItems.length; i++) {
					this._deleteFile(aSelectedItems[i]);
				}
			} 
		},
		
		onDownloadItem: function(oEvent) {
			var aSelectedItems = this._oUploadCollection.getSelectedItems();
			if (aSelectedItems) {
				for (var i = 0; i < aSelectedItems.length; i++) {
					this._oUploadCollection.downloadItem(aSelectedItems[i], true);
				}
			} 
		},
		
		onSelectionChange: function(oEvent) {
			var aItems = this._oUploadCollection.getSelectedItems();
			var iCount = 0;
			iCount = aItems ? aItems.length : 0;
			this._oViewModel.setProperty('/selectedItems', iCount);
		},
		
		onUploadChange: function(oEvent) {
			var sToken = this._oComponent.getModel('Attachments').getHeaders()["x-csrf-token"];
			var oUploadCollection = oEvent.getSource();			
			var oCustomerHeaderToken = new UploadCollectionParameter({
				name: "x-csrf-token",
				value: sToken
			});
			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
		},
		
		onUploadComplete: function(oEvent) {
			if(oEvent.getParameters().getParameter('status') &&
				oEvent.getParameters().getParameter('status') === 201 ) {
				this._oComponent.getModel('Attachments').refresh();
			}
		},
		
		_bindListUploadCollection: function(oFilter) {
			//this._oUploadCollection.getBinding('items').filter(oFilter);
			var sBaseURL = this._oComponent.getModel('Attachments').sServiceUrl;
			var sEndURI	 = '/toBinFileMedia/$value';
			
			this._oUploadCollection.bindItems({
				path: 'Attachments>/AttachmentSet',
				filters: oFilter, 
				template: new UploadCollectionItem({
					fileName: '{Attachments>FileName}',
					mimeType: '{Attachments>MimeType}',
					url: sBaseURL + "/AttachmentSet(DocNum='{Attachments>DocNum}',TipoDoc='{Attachments>TipoDoc}',FileName='{Attachments>FileName}')" + sEndURI,
					enableEdit: false,
					enableDelete: false,
					visibleEdit: false, 
					visibleDelete: false
				})
				//enableDelete: '{= ${detail>/statusDoc} === ${statusDoc>/STATUS_PENDENTE} }',
			});
			
		}, 
		
		_createViewModel: function() {
			return new JSONModel({
				selectedItems: 0, 
				statusDoc: '',
				uploadUrl: ''
			});
		}, 
		
		_deleteFile: function(oItem) {
			var oContext = oItem.getBindingContext('Attachments');
			var oAttachment = oContext.getObject();
			
			var sPath = this._oBundle.getText('PATH_ATTACHMENT_DELETE', 
				[oAttachment.DocNum, oAttachment.TipoDoc, oAttachment.FileName]);
			var oModel = this._oComponent.getModel('Attachments');
			oModel.remove(sPath, {
				success: function(oData, oResponse) {
					//alert("success");
				}, 
				error: function(oResponse) {
					MessageToast.show(oResponse.message);
				}
			});
		},
		
		_getAttachmentTitleText: function() {
			var aItems = this._oUploadCollection.getItems();
			return this._oBundle.getText('s2ListTitle', aItems.length);
		},
		
		_routeMatched : function(oEvent) {
			var oArguments = oEvent.getParameter('arguments');
			var oView = this.getView();
			
			var sPath = this._oBundle.getText('PATH_SINGLE_DOCUMENT', 
				[oArguments.idDocumento, oArguments.tipoDocumento]);
			
			var oModel = this._oComponent.getModel('Attachments');
			if(oModel) {
				var oContext = oModel.getContext(sPath);
				var oDocument = {};
				if(oContext && oContext.getObject()) {
					oDocument = oContext.getObject();

				} else {
					oDocument.DocNum = oArguments.idDocumento; 
					oDocument.TipoDoc = oArguments.tipoDocumento; 
				}
				
				var sBinding = this._oBundle.getText('BINDING_SINGLE_DOCUMENT', 
								[oDocument.DocNum, oDocument.TipoDoc]);
			
				oView.bindElement({
					path : sBinding,
					events : {
						change: this.onBindingChange.bind(this),
						dataRequested: function (oEvent) {
							oView.setBusy(true);
						},
						dataReceived: function (oEvent) {
							oView.setBusy(false);
						}
					}
				});
				
				var oFilter = 
						new Filter({
							filters: [
								new Filter({path: 'DocNum', operator: FilterOperator.EQ, value1: oDocument.DocNum }),
								new Filter({path: 'TipoDoc', operator: FilterOperator.EQ, value1: oDocument.TipoDoc})
							],
							bAnd: true
					});

				this._bindListUploadCollection(oFilter);
				
				var sUploadUrl = this._oComponent.getModel('Attachments').sServiceUrl +
									this._oBundle.getText('PATH_ATTACHMENT_UPLOAD', 
									[oDocument.DocNum, oDocument.TipoDoc]);
									
				this._oViewModel.setProperty('/selectedItems', 0);
				this._oViewModel.setProperty('/uploadUrl', sUploadUrl);
				this.getView().setModel(this._oViewModel, 'detail');
			}
		}
		
	});

});
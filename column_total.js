// simple method for totaling individual columns
(function($, window, document){

	var _defaults = {
		sTitle : "",
		sSumType : "full",
		//columns to total
		aColumns : [],
		//totaling logic
		fnMethod : function(current, next){
			//method for adding can be updated to whatever, default is add
			return current + next;
		}
	};

	var TotalColumn = function(instance, settings){
		//instance.fnRecordsTotal()
		settings = $.extend(_defaults, settings);	
		
		instance.aoFooterCallback.push({
			fn: function ( nRow, aaData, iStart, iEnd, aiDisplay ) {
				var total = [];
				//set all column totals to 0
				for (var i = settings.aColumns.length -1; i >= 0 ; i--) {
				 	total[i] = 0;
				}; 
				// run through each row
				for(var row = iStart; row < iEnd; row++){
					// run through each column
					for(var col = 0; col < settings.aColumns.length; col++ ){
						// replace any commas in the numeric amount
						var amount = aaData[aiDisplay[row]][settings.aColumns[col]].replace(/,/g,'');
						//replace () for negative currency ie (9.00) is - 9.00
						if(amount.search(/\(|\)/g) >= 0){
							amount = amount.replace(/\(|\)/g, '');
							amount = parseFloat(amount) * -1;
						} else {
							amount = parseFloat(amount)
						}
						// call the method, default is to add
						total[col] = settings.fnMethod(total[col], amount);
					}
				}
				// find each section and place the total for the column
				$.each($(nRow).find('.total-sum'), function(ind,elm){
					$(elm).html(total[ind].toLocaleString('en-US'));
				});
			},
			sName: "current-total-user"
		});


	};

	// add a T anywhere in the table's "sDom" parameter to add the total column

	$.fn.dataTableExt.aoFeatures.push({
		"fnInit": function( oSettings ) {
			new TotalColumn(oSettings, oSettings.oInit.TotalColumn);
		},
		"cFeature": "T",
		"sFeature": "TotalColumn"
	});

	//adds the TotalColumn object to the datatables object
	$.fn.DataTable.TotalColumn = TotalColumn;

})(jQuery, window, document);
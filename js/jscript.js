jQuery(document).ready(function($) {
	var url = "http://wdfeww.myqnapcloud.com:6754";
	var country="";
	var city="";
	var jsonData;
	getAllProducts();

	var product = {
        name: "", 
        countryCode: "", 
        price: "", 
        count: "", 
    };

/** LISTENERS */
	$(document).on('click', '#btn-add', function(event) {
		$(".message").remove();
		event.preventDefault();

		product.name = $("#prod_name").val();
		product.countryCode = $("#prod_code").val();
		product.price = $("#prod_price").val();
		product.count = $("#prod_count").val();
        if (product.name != '' && product.countryCode != '' && product.price != '' && product.count != '') {
        	addProduct(product);
        }
	});

	$(document).on('click', '.btn-edit', function(event) {
		event.preventDefault();
		$(".message").remove();
		$('.btn-edit').attr({
			disabled: true
		});
		var product_id = $(this).val();
		var product = [];
		var pressed_btn = $(this).parent();

		for (var i = 0; i < 4; i++) {
			product[i] = pressed_btn.prev().text();
			$(this).parent().prev().remove();
			var row = pressed_btn.parent()
				.prepend($("<td/>")
				.append($("<input/>", {
			}).val(product[i])));
		}
		pressed_btn.replaceWith($("<td/>").append($("<button/>", {
			"class": "mui-btn mui-btn--primary btn-tab",
			"id": "btn_confirm",
			"value": product_id
		}).text('OK')));
		
		$("#btn_confirm").parent().parent().append($("<td/>").append($("<button/>", {
			"class": "mui-btn mui-btn--primary btn-tab",
			"id": "btn_cancel",
			"value": product_id
		}).text('Cancel')));
		$("#btn_confirm").parent().parent().append($("<td/>").append($("<button/>", {
			"class": "mui-btn mui-btn--danger btn-tab",
			"id": "btn_delete",
			"value": product_id
		}).text('Delete')));
		// $("#table_div").hide().show(0);
	});

	$(document).on('click', '#btn_confirm', function(event) {
		var product_id = $(this).val();
		var pressed_btn = $(this).parent();

		product.count = pressed_btn.prev().children().val();
		product.price = pressed_btn.prev().prev().children().val();
		product.countryCode = pressed_btn.prev().prev().prev().children().val();
		product.name = pressed_btn.prev().prev().prev().prev().children().val();

		updateProduct(product_id);
	});

	$(document).on('click', '#btn_delete', function(event) {
		removeProduct($(this).val());
	});

	$(document).on('click', '#btn_cancel', function(event) {
		getAllProducts();
	});

	
/* END-LISTENERS **/

	function clearTable () {
		$(".head").remove();
		$(".body").remove();
		$(".message").remove();
	}

	function clearInputs () {
		$("#prod_name").val('');
		$("#prod_code").val('');
		$("#prod_price").val('');
		$("#prod_count").val('');
	}

	function writeMessage (text) {
		$(".message").remove();
		$("<div/>", {
			"class": "message"
		}).appendTo('.location-selection');
		$("<span/>").text(text).appendTo('.message');
	}

/** REQUESTS */
	function addProduct (product) {
		$.ajax({
	        url: url+"/products",
	        contentType: "application/json",
	        method: "POST",
	        data: JSON.stringify(product),
		    success: function(res) {
		    	getAllProducts();
		    	clearInputs();
		    },
		    error: function() {
		    	writeMessage("Unable to add product");
		    }});
	}

	function updateProduct (id) {
		$.ajax({
	        url: url+"/products/"+id,
	        contentType: "application/json",
	        method: "PUT",
	        crossDomain: true,
	        data: JSON.stringify(product),
		    success: function(res) {
		    	getAllProducts();
		    },
		    error: function(res) {
		    	writeMessage("Unable to update product");
		    }});
	}

	function removeProduct (id) {
		$.ajax({
	        url: url+"/products/"+id,
	        method: "DELETE",
	        success: function(res) {
	        	getAllProducts();
	        },
	        error: function() {
				writeMessage("Unable to remove product");
	        }});
	}

	function getAllProducts () {
		$.ajax({
	        url: url+"/products",
	        dataType: "json",
	        method: "GET",
		    success: function(data) {
		    	clearTable();
		    	jsonData=data;
		    	appnedData(data);
	    	},
	        error: function() {
	    		writeMessage("Can not find any goods");
	    	}});
	}
/* END-REQUESTS **/

	function appnedData (data) {
		$("<thead/>").addClass('head').appendTo(".tbl-goods");
			$("<tr/>").appendTo($(".tbl-goods").children());
				$("<th/>").text("Product name").appendTo($(".tbl-goods").children().children());
				$("<th/>").text("Product code").appendTo($(".tbl-goods").children().children());
				$("<th/>").text("Price").appendTo($(".tbl-goods").children().children());
				$("<th/>").text("Quantity").appendTo($(".tbl-goods").children().children());
		$("<tbody/>").addClass('body').appendTo(".tbl-goods");
		for (var i = data.length - 1; i >= 0; i--) {
			$("<tr/>").appendTo($(".body"))
				.append($("<td/>", {
					class: "tr-text"
				}).text(data[i].name))
				.append($("<td/>", {
					class: "tr-text"
				}).text(data[i].countryCode))
				.append($("<td/>", {
					class: "tr-text"
				}).text(data[i].price))
				.append($("<td/>", {
					class: "tr-text"
				}).text(data[i].count))
				.append($("<td/>", {
					class: "tr-buttons"
				}).append($("<button/>", {
					"class": "mui-btn mui-btn--accent btn-edit",
					"value": data[i].id
				}).text('Edit')));
		}
	}

});
jQuery(document).ready(function($) {
	var url = "http://wdfeww.myqnapcloud.com:6754";
	var country="";
	var city="";
	var jsonData;
	getAllProducts();

/** LISTENERS */
	$(document).on('click', '#btn-add', function(event) {
		$(".message").remove();
		event.preventDefault();
		var product = {
            name: $("#prod_name").val(), 
            countryCode: $("#prod_code").val(),
            price: $("#prod_price").val(), 
            count: $("#prod_count").val(), 
        };
        if (product.name != '' && product.countryCode != '' && product.price != '' && product.count != '') {
        	console.log(product);
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
		console.log(product);

		// $("#table_div").hide().show(0);
	});

	$(document).on('click', '#btn_confirm', function(event) {

	});

	$(document).on('click', '#btn_delete', function(event) {

	});

	$(document).on('click', '#btn_cancel', function(event) {

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


/** REQUESTS */
	function addProduct (product) {
		$.ajax({
	        url: url+"/products",
	        contentType: "application/json",
	        method: "POST",
	        data: JSON.stringify(product),
		    success: function() {
		    	getAllProducts();
		    	console.log(res);
		    	clearInputs();
		    },
		    error: function() {
	    		console.log("fail");
	    		$("<div/>", {
					"class": "message"
				}).appendTo('.location-selection');
				$("<span/>").text("Unable to add product").appendTo('.message');
		    }});
	}

	function removeProduct (id) {
		$.ajax({
	        url: url+"/products/"+id,
	        method: "DELETE",
	        success: function(res) {
	        	getAllProducts();
		    	console.log(res);
		    	clearInputs();
	        },
	        error: function() {
	        	$("<div/>", {
					"class": "message"
				}).appendTo('.location-selection');
				$("<span/>").text("Unable to remove product").appendTo('.message');
	        }});
	}

	function getAllProducts () {
		$.ajax({
	        url: url+"/products",
	        dataType: "json",
	        method: "GET",
		    success: function(data) {
		    	clearTable();
		    	console.log(data);
		    	jsonData=data;
		    	appnedData(data);
	    	},
	        error: function() {
	    		console.log("fail");
	    		$("<div/>", {
					"class": "message"
				}).appendTo('.location-selection');
				$("<span/>").text("Can not find any goods.").appendTo('.message');
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
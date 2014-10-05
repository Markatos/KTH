var userUsageData, userLoaded,
    nodeUsageData, nodeLoaded,
    priceData, priceLoaded,
	costData;
var maxUsage, maxPriceValue;
var minDate = new Date(2013, 4-1, 1),
	maxDate = new Date(2013, 10-1, 20);
var electricityChart, priceChart; 

$(document).ready(function() {    
	$(".tabs ul").idTabs(); 
	
	loading('.meter-selection');
	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	console.log(windowWidth, windowHeight);
	electricityChart = new ElectricityChart('.electricityChart', windowWidth * 0.75, 660, {top: 20, left: 135, bottom: 95, right: 40});
	priceChart = new PriceChart('.priceChart', 250, 250, {top: 10, left: 20, bottom: 20, right: 20});
	getMeters();
});

function loading(element) {
	var e = (element) ? $(element) : $('.container');
	var img = $('<img />', {'class': 'loading', src: 'images/loading.gif', width: 64});
	e.empty().append(img);
}

function getMeters() { 
	// Request the meters from energimolnet.se
	$.ajax({
		url: 'energimolnet.php',
		data: { info: 'meters' },
		success: function(data) {
			// Parse the response
			data = $.parseJSON(data);
			
			// Check if an error occurred
			if (data.error) {
				$('body').append('<p>' + data.error + '</p>');
				return;
			}
			
			// Create the selector
			var meterSelect = $('<select />', {
	//				size: 1
			}).addClass('meter-select');
			// Create options
			for (var i in data) {
				var meter = data[i];			
				var option = $('<option/>', {
				    text: meter.name + ' (' + meter.owner + ')',
				    value: meter._id
				});	
				meterSelect.append(option);			
			}
			
			// Add standard option			
			var option = $('<option/>', {
			    text: 'Select an address for which you want to see the data',
			    value: 0,
			    disabled: true,
			    selected: true
			});	
			meterSelect.prepend(option);	

			$('.meter-selection').empty().append(meterSelect);
			meterSelect.change(function(e) {				
				// Add loading bar gif
				$('.meter-selection')
					.append($('<div/>', {'class': 'loading-bar' })
							.append($('<img />', { src: 'images/loading.gif', width: 32 }))
					);
				
				userLoaded = false;
				loadUserData($('.meter-selection').find(":selected").val());
				onDataReady(updateGraph);
			});
			
			// Load the app
			loadApp();
		}
	});
	
	// Create the date picker
	$('.datepicker').datepicker({
		dateFormat: "DD, d MM yy",
		showOtherMonths: true,
		selectOtherMonths: true,
		onSelect: function(date, datepicker) {
			updateGraph();
		}
	}).datepicker('setDate', new Date(2013,4-1,1));
	
	// Adding buttons to go to the next/previous day
	var prev = $('<img />', {id: 'prev-date', 'class': 'date-button', src: 'images/prev.png'})
		.click(function(e) {
			var date = $('.datepicker').datepicker('getDate');
			
			// Check if the minDate is currently selected
			if (+date == +$('.datepicker').datepicker('option', 'minDate'))
				return;
			
			
			date = new Date(date.getTime() - 24*60*60*1000);
			$('.datepicker').datepicker('setDate', date);
			
			updateGraph();			
		});
	var next = $('<img />', {id: 'next-date', 'class': 'date-button', src: 'images/next.png'})
		.click(function(e) {
			var date = $('.datepicker').datepicker('getDate');

			// Check if the maxDate is currently selected
			if (+date == +$('.datepicker').datepicker('option', 'maxDate'))
				return;
			
			date = new Date(date.getTime() + 24*60*60*1000);
			$('.datepicker').datepicker('setDate', date);
			
			updateGraph();			
		});
	var refresh = $('<img />', {id: 'refresh-date', 'class': 'date-button', src: 'images/refresh.png'})
	.click(function(e) {		
		updateGraph();			
	});
	$('.date').prepend(prev)
	$('.date').append(next);
	$('.date').append(refresh);
}

function loadApp() {	
	// Restrict the date range for the datepicker to the dates for which we have data
	$('.datepicker').datepicker('option', {
		minDate: minDate,
        maxDate: maxDate
	});
	
	loadAppliances();
	loadData();
}

	
function loadData() {
	userLoaded = false, nodeLoaded = false, priceLoade = false;
	loadNodeData();
	loadPriceData();
}

function onDataReady(callback) {
	if (userLoaded && nodeLoaded && priceLoaded) {
		// Show the app if it is hidden
		$('.app').fadeIn('fast');
		// Remove loading bar
		$('.loading-bar').remove();
		
		// Calculate the cost for each day;
		calculateDayCosts();
		
		callback();
	} else {
		window.setTimeout(function() { onDataReady(callback) }, 100);
	}
}

function dateWithoutTime(date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getDataFor(date) {
	// Cut off hours, minutes etc. from the date
	date = dateWithoutTime(date);
	
	// Get user usage data
	var user = [];
	for (var i in userUsageData) {
		if (+dateWithoutTime(userUsageData[i].date) == +date)
			user.push(userUsageData[i]);
		else if (+dateWithoutTime(userUsageData[i].date) > +date)
			break;
	}
	
	// Get node usage data
	var node = [];
	for (var i in nodeUsageData) {
		if (+dateWithoutTime(nodeUsageData[i].date) == +date)
			node.push(nodeUsageData[i]);
		else if (+dateWithoutTime(nodeUsageData[i].date) > +date)
			break;
	}
	
	// Get price data
	var price = [];
	for (var i in priceData) {
		if (+dateWithoutTime(priceData[i].date) == +date)
			price.push(priceData[i]);
		else if (+dateWithoutTime(priceData[i].date) > +date)
			break;
	}
	
	return { user: user, node: node, price: price };
}

function loadAppliances() {
	var dsv = d3.dsv(";", "text/plain");
	dsv("data/appliances.csv")
		.row(function(d) { 
			var keys = Object.keys(d);
			// Check if its an empty row in the data table
			if (d[keys[0]] == "" && d[keys[1]] == "" && d[keys[2]] == "") return;
			
			var name = d[keys[1]];
			var group = d[keys[0]];
			
			// Parse the energie usage of the appliance
			var usageSplitted = d[keys[2]].split('-');
			var usage = +usageSplitted[0];
			if (usageSplitted.length > 2) {
				console.debug('Error when parsing "appliances.csv": "' + name + '" does have an invalid usage.');
				return;
			}
			
			return { name: name, group: group, usage: usage }; 
		})
		.get(function(error, rows) {
			if (error) {	
//				$('body').append('<p class="error">' + error + '</p>');
				console.debug(error);
				return;
			}

			// Create options for the selector of the appliances
			$('select.appliances').empty();
			// Standard, non-selectable option
			var option = $('<option/>', {
			    text: 'Select appliance you wish to add',
			    value: -1,
			    disabled: true,
			    selected: true
			});	
			$('select.appliances').prepend(option);
			
			// Rearrange the appliances in groups
			var data = [];
			for (var i in rows) {
				if (!data[rows[i].group]) data[rows[i].group] = [];
				data[rows[i].group].push({
					name: rows[i].name,
					usage: rows[i].usage
				});
			}
			// Add option for every appliance
		    for (var i in data) {
		    	// Create optgroup for the group
		    	var optgroup = $('<optgroup/>', {
		    	    'label': i
		    	});
		    	
		    	// Create options
		    	for (var j in data[i]) {
			    	var option = $('<option/>', {
			    	    'text': data[i][j].name,
			    	    'value': data[i][j].usage,
			    	    'selected': false
			    	});
			    	optgroup.append(option);
		    	}
		    	
		    	$('select.appliances').append(optgroup);
		    }
		    
		    // Create the time and duration selectors
		    createTimeSelectionOptions('time', 'select.start-time.hour', 'select.start-time.minute');
		    createTimeSelectionOptions('time', 'select.to-time.hour', 'select.to-time.minute', 12);
		    createTimeSelectionOptions('duration', 'select.duration.hour', 'select.duration.minute', 1);
		    
		    
		    // Behaviour when different appliance is selected
		    $('select.appliances').change(function(e) {
		    	// Change the selection for all selectors
		    	var selected = $(this).find('option:selected').text();
		    	$('select.appliances').find('option:selected').attr('selected', false);
		    	$('select.appliances option').filter(function () { return $(this).text() == selected; }).attr('selected', true);
		    	
		    	// Change the power display
		    	$('span.power').html($(this).val() + 'W');
		    });
		    
		    // Behaviour when one of the time selectors changes
		    $('select.duration, select.start-time').change(function(e) {
		    	var selector = 'select.' + $(this).attr('class').split(' ').join('.');
		    	
		    	// Change the selection for all selectors
		    	var selected = $(this).find('option:selected').val();
		    	$(selector).find('option[value="' + selected +'"]').attr('selected', true);
		    });
		    
			
		    // Add click behaviour for the buttons
	    	$('#add-appliance').click(function(e) {
		            e.preventDefault();
		        	var appUsage = getApplianceData();
		        	if (appUsage != null) {
		        		electricityChart.addBars(appUsage);
		        		priceChart.change(costOf(appUsage));
		        	}
		        });
	    	$('#move-appliance').click(function(e) {
		            e.preventDefault();
		        	var removeUsage = getApplianceData();
		        	
		        	if (removeUsage != null) {
		        		var removedUsage = electricityChart.removeBars(removeUsage);

		        		// Remove the price from the price chart that was removed (New value will be added further down below)
		        		priceChart.change(-costOf(removedUsage));
		        		
		        		
			        	// Calculate the total amount of removed usage
			        	var totallyRemovedUsage = 0;
			        	for (var i in removedUsage)
			        		totallyRemovedUsage += removedUsage[i].usage;
			        	
			        	
			        	// Get the appliance usage which will be added
			        	var addUsage = getApplianceData(true, totallyRemovedUsage);
		        		
		        		electricityChart.addBars(addUsage);
			        	priceChart.change(costOf(addUsage));
		        	}
		        });
		});
}

function loadUserData(id) {
	if (id == 0)
		return;
	
	var minDateString = $.datepicker.formatDate('yymmdd', minDate);
	var maxDateString = $.datepicker.formatDate('yymmdd', maxDate);
	var query = '[[' + minDateString + ',' + maxDateString + ']]';
	
	// Request a series of data for the specified meter from energimolnet.se
	$.ajax({
		url: 'energimolnet.php',
		data: {
			info: 'series',
			meter_id: id,
			query: query,
			resolution: 'hour'
		},
		success: function(data) {
			
			// Parse the response
			data = $.parseJSON(data);
			
			// Check if an error occurred
			if (data.error) {
				//$('body').append('<p class="error">' + data.error + '</p>');
				console.debug(data.error);
				return;
			} else if (!(data instanceof Array)) {
				console.debug('The returned data form energimolnet.php when requesting a series is not an array!');
				return;
			}
			
			// For a request for the usage of a day we'll get a array with one element: An array with all the data for the day.
			data = data[0];
						
			// Format the data for d3js
			var jsonData = [];
			var date = minDate;
			maxUsage = 0;
			for (var i in data) {
				jsonData.push({
					date: date,
					usage: +data[i]
				});
				
				// Find the max usage during this period
				if (+data[i] > maxUsage)
					maxUsage = +data[i];
				
				date = new Date(date.getTime() + 60*60*1000);		// Add one hour to the date (60 minutes * 60 seconds * 1000 milliseconds)
			}
			
			userUsageData = jsonData;
			userLoaded = true;
		}
	});		
}

function loadNodeData() {
	var dsv = d3.dsv(";", "text/plain");
	dsv("data/node_usage.csv")
		.row(function(d) { 
			var keys = Object.keys(d);
			
			// Parse date string. Format in csv file is dd.mm.yyyy
			var dateSplitted = d[[keys[0]]].split('.');
			var date = new Date(dateSplitted[2], +dateSplitted[1]-1, dateSplitted[0]);
			
			// Parse usage value
			var usage = parseFloat(d[keys[1]].replace(',','.'));
			
			return { date: date, usage:  usage}; 
		})
		.get(function(error, rows) {
			// Check if an error occured
			if (error) {	
//				$('body').append('<p class="error">' + error + '</p>');
				console.debug(error);
				return;
			} 
			
			var data = [];
			var date = rows[0].date;
			for (var i in rows) {
				data.push({
					date: date,
					usage: rows[i].usage
				});
				
				var originalDate = dateWithoutTime(date);
				if (+rows[i].date == +originalDate)
					date = new Date(date.getTime() + 60*60*1000);		// Add one hour to the date (60 minutes * 60 seconds * 1000 milliseconds)
				else
					date = rows[i].date;								// The days in the raw data are always set to 00:00
			}
			
			nodeUsageData = data;
			nodeLoaded = true;
		});
}

function loadPriceData(date) {
	var dsv = d3.dsv(";", "text/plain");
	dsv("data/prices.csv")
		.row(function(d) { 
			var keys = Object.keys(d);
			
			// Parse the hour
			var hour = parseInt(d[keys[1]].split('-')[0]);
			// Parse date string. Format in csv file is dd.mm.yyyy
			var dateSplitted = d[[keys[0]]].split('.');
			var date = new Date(dateSplitted[2], +dateSplitted[1]-1, dateSplitted[0], hour);
			
			// Parse usage value
			var priceMWh = parseFloat(d[keys[2]].replace(',','.'));
			var pricekWh = parseFloat(d[keys[3]].replace(',','.'));
			
			return { date: date, price: pricekWh }; 
		})
		.get(function(error, rows) {
			// Check if an error occured
			if (error) {
//				$('body').append('<p class="error">' + error + '</p>');
				console.debug(error);
				return;
			}
			
			// Only use data for the specified date
			var data = [];
			for (var i in rows) {
				data.push({ 
					date: rows[i].date,
					usage: rows[i].price
				});
			}

			priceData = data;
			priceLoaded = true;
		});
}

function calculateDayCosts() {
	costData = [];
	maxPriceValue = 0;
	
	for (var i = +minDate; i < (+maxDate + 24*60*60*1000); i += (24*60*60*1000)) {
		data = getDataFor(new Date(i));		

		var cost = 0;
		for (var j in data.price)
			cost += +data.user[j].usage * +data.price[j].usage;

		if (cost > maxPriceValue) maxPriceValue = cost;
		costData[+(new Date(i))] = cost;
//		costData.push({ date: new Date(i), cost: cost });
	}	
}

function updateGraph() {
	var date = $('.datepicker').datepicker('getDate');
	data = getDataFor(date);
	
	// Check if we have to adept the y scale for the electricity chart (aka we loaded data for a different meter)
	if (electricityChart.maxUsage != maxUsage)
		electricityChart.maxUsage = maxUsage;	
		
	electricityChart.clear();
	electricityChart.createBarChart(data.user, 'Your elecricity use', 'kWh', 'userUsage');
	electricityChart.createLineChart(data.node, 'Node electricity load', 'kWh', 'nodeUsage');
	electricityChart.createLineChart(data.price, 'Market price', 'SEK/kWh', 'price');
	electricityChart.createLegend();
	electricityChart.createTooltip();

	// Check if we have to adept the y scale for the price chart
	if (priceChart.maxValue != maxPriceValue)
		priceChart.maxValue = maxPriceValue;
	
	priceChart.clear();
	priceChart.createBarChart(costData[+date]);
}

function getApplianceData(to, maxUsage) {
	var appliance = $('select.appliances').find('option:selected').first().text();
	var applianceUsage =  +$('select.appliances').find('option:selected').val();
	var duration = { hour: +$('select.duration.hour').first().val(), minute: +$('select.duration.minute').first().val() };
	if (to)
		var time = { hour: +$('select.to-time.hour').first().val(), minute: +$('select.to-time.minute').first().val() };
	else
		var time = { hour: +$('select.start-time.hour').first().val(), minute: +$('select.start-time.minute').first().val() };

	var dur = duration.hour*60 + duration.minute;
	// Don't add when no duration is specified or no appliance selected
	if (dur <= 0)
		return null;
	if (applianceUsage < 0)
		return null;
	
	
	var data = [];
	var numRects = Math.ceil((time.minute + dur) / 60);
	var mins = (time.minute + dur < 60) ? duration.minute : 60 - time.minute;
	var hour = time.hour;
	var usageLeft = maxUsage;
	while (numRects > 0) {
		// Cut usage after 24:00
		if (hour > 23)
			break;
		
		var usage = (applianceUsage * (mins/60)) / 1000;
		usage = (usage > usageLeft) ? usageLeft : usage;
		usageLeft -= usage;
		data.push({
			hour: hour,
			duration: mins,
			usage: usage,
			appliance: appliance,
		});
		
		dur -= mins;
		mins = (dur> 60) ? 60 : ((dur > 0) ?  dur : 0);
		hour++;
		numRects--;	
	}
	
	return data;
}

function costOf(usage) {
	// Frist get the prices for the current date
	var date = $('.datepicker').datepicker('getDate');
	date = dateWithoutTime(date);
	var price = [];
	for (var i in priceData) {
		if (+dateWithoutTime(priceData[i].date) == +date)
			price.push(priceData[i].usage);
		else if (+dateWithoutTime(priceData[i].date) > +date)
			break;
	}
	
	// Calculate the cost of the appliance usage we want to add/remove
	var cost = 0;
	for (var i in usage) {
		cost += +price[+usage[i].hour] * +usage[i].usage;
	}
	
	return cost;
}

function createTimeSelectionOptions(type, idHour, idMinute, selectedHour, selectedMinute) {
	if (!selectedHour) selectedHour = 0;
	if (!selectedMinute) selectedMinute = 0;
	
	// Create minute options
	for (var i = 0; i <= 45; i += 15) {
		var option = $('<option/>', {
		    text: (i < 10 && type == 'time') ? '0' + i : i,
		    value: i,
		    selected: (selectedMinute == i) ? true : false
		});	
		$(idMinute).append(option);		
	}
	
	
	// Create hour options
	if (type == 'time') {
		for (var i = 0; i <= 23; i++) {
			var option = $('<option/>', {
			    text: (i < 10) ? '0' + i : i,
			    value: i,
			    selected: (selectedHour == i) ? true : false
			});	
			$(idHour).append(option);		
		}
	} else if (type == 'duration') {
		for (var i = 0; i <= 24; i++) {
			var option = $('<option/>', {
			    text: i,
			    value: i,
			    selected: (selectedHour == i) ? true : false
			});	
			$(idHour).append(option);		
		}
	}
}

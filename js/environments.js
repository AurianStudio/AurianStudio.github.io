var backendHostname = (function () {
	var hostname;
    
	var environments = {
		'default': 'https://www.cibconline.cibc.com'
	};

	hostname = environments['default'];

	return hostname;
})();
window.onload = addevent;
var AuthToken = document.currentScript.getAttribute('token');
//var ThemeCategory = document.currentScript.getAttribute('theme_category');

var ThemeCategory = 2;
var lang = document.currentScript.getAttribute('lang');

function makeUL(productsarray,termsarray, categoryarray) {
    var list = document.createElement('ul');
    list.className += "jibia-search-box";
    list.id += "jibia-autocomplete"
    termsarray.map(function(term){ 
        let item = document.createElement('li');
        item.className += 'jibia-search-element jibia-term-element';    
        item.innerHTML = '<a href = \'' + 'https://' +  window.location.hostname + '/search/' + term['raw_word']  + '\' class = \'jibia-term-link\'><p class = \'jibia-term-title\'>' + term["html_word"] + '</p></a>'
        list.appendChild(item);
		item.addEventListener("click", function() {
			var req = new XMLHttpRequest();
			req.open('POST', decodeURIComponent('https://api.jibia.nl/api/search_app_click_analytics'), true);
			req.setRequestHeader("Content-type", "application/json");
			var data = JSON.stringify({"origin":window.location,"query": term});
			req.send(data);
		})
	});
    productsarray.map(function(name){ 
            let item = document.createElement('li');
            let prod = name["product"]  
            item.className += "jibia-search-element jibia-product-element";    
            item.innerHTML = "<a href = '" + 'https://' +  window.location.hostname + '/' + prod["url"] + '.html' + "' class = 'jibia-product-link'><img class = 'jibia-product-image' src ='" + prod["img_url"] + "'><p class = 'jibia-product-title'>" + prod["name"] + "</p> </a>"//Dit zou dan al veranderd moeten zijn voor Cloudsuite
            list.appendChild(item);
		item.addEventListener("click", function() {
			var req = new XMLHttpRequest();
			req.open('POST', decodeURIComponent('https://api.jibia.nl/api/search_app_click_analytics'), true);
			req.setRequestHeader("Content-type", "application/json");
			var data = JSON.stringify({"origin":window.location,"query": name});
			req.send(data);
		})
		});
	categoryarray.map(function(name){	 
		let item = document.createElement('li');
		let cate = name["category"]  
		item.className += "jibia-search-element jibia-category-element";    
		item.innerHTML = "<a href = '" + 'https://' +  window.location.hostname + '/' + cate["name"] + '.html' + "' class = 'jibia-category-link'><img class = 'jibia-category-image' src ='" + cate["img_url"] + "'><p class = 'jibia-category-title'>" + cate["name"] + "</p> </a>"//Dit zou dan al veranderd moeten zijn voor Cloudsuite
		list.appendChild(item);
		item.addEventListener("click", function() {
			var req = new XMLHttpRequest();
			req.open('POST', decodeURIComponent('https://api.jibia.nl/api/search_app_click_analytics'), true);
			req.setRequestHeader("Content-type", "application/json");
			var data = JSON.stringify({"origin":window.location,"query": name});
			req.send(data);
		});
	});	 
    return list;
}

function reloadresults(auto_data){ 
    var autoCompleteBox = document.getElementById("data");
	autoCompleteBox.innerHTML = ""; 
	var temp_dict = [{"category" : {name : "citroenen", img_url : "https://upload.wikimedia.org/wikipedia/commons/3/37/Oryctolagus_cuniculus_Tasmania_2.jpg",  }}];
	var auto_data = {
		"ref": "https://www.graceisgreen.com/vrouw/", 
		"result": {
		  "products": [
			{
			  "product": {
				"img_url": "https://cdn.webshopapp.com/shops/235598/files/228879149/50x50x2/bambooty-basics-wetbag---alle-kleuren.jpg", 
				"name": "Bambooty Basics Wetbag in verschillende kleuren", 
				"url": "bambooty-basics-wetbag"
			  }
			}, 
			{
			  "product": {
				"img_url": "https://cdn.webshopapp.com/shops/235598/files/251267771/50x50x2/inlegger-klein-3-2.jpg", 
				"name": "Bambooty inlegger voor in de wasbare luier - 2 varianten.", 
				"url": "bamboo-inlegger"
			  }
			}, 
			{
			  "product": {
				"img_url": "https://cdn.webshopapp.com/shops/235598/files/211176899/50x50x2/bambooty-zoogcompressen-zakje.jpg", 
				"name": "Booby wasbare zoogcompressen dag", 
				"url": "booby-wasbare-zoogcompressen-dag"
			  }
			}, 
			{
			  "product": {
				"img_url": "https://cdn.webshopapp.com/shops/235598/files/211177382/50x50x2/zoogcompressen-nacht-wasbaar.jpg", 
				"name": "Booby wasbare zoogcompressen nacht", 
				"url": "booby-wasbare-zoogcompressen-nacht"
			  }
			}, 
			{
			  "product": {
				"img_url": "https://cdn.webshopapp.com/shops/235598/files/263034773/50x50x2/swim-and-training-whale-hq.png", 
				"name": "Actie! Zwemluier & Trainingsbroekje Bubble - 2-pak  ", 
				"url": "zwemluier-trainingsbroekje-bubble"
			  }
			}
		  ], 
		  "words": [
			{
			  "html_word": "<b>B</b>orstvoeding", 
			  "raw_word": "Borstvoeding"
			}, 
			{
			  "html_word": "<b>B</b>escherming", 
			  "raw_word": "Bescherming"
			}, 
			{
			  "html_word": "<b>B</b>abydoekjes", 
			  "raw_word": "Babydoekjes"
			}
		  ]
		}
	  }
	autoCompleteBox.appendChild(makeUL(auto_data["result"]["products"], auto_data["result"]["words"], temp_dict));
}

function updateJSON(json) {
    latest_search_results = json
}

function sendSearchApi(value, callback=undefined, id){
    var req = new XMLHttpRequest();
    let token = AuthToken
    let numberResponse = 5;
	let lang = "en";
	if(lang == null){
		lang = window.location.pathname.split( '/' )[1];
	}
    req.open('GET', decodeURIComponent('https://api.jibia.nl/api/do_search?query='+value+'&token='+token+'&n='+numberResponse+"&country_code="+lang, true));
    req.addEventListener("readystatechange", function () {
        if (req.readyState === 4) {
            var json = JSON.parse(req.responseText);
            if (callback !== undefined) {
                callback(json, id)
            } else {
                console.warn("Oi callback undefined ")
            }
        }
    });
    req.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    req.send(); 
}

function search(event){
	let searchunit = document.getElementById("searchunit");
	reloadresults('');
	//sendSearchApi(event.srcElement.value, reloadresults, searchunit )
}

function popup(event) {
	document.getElementById('searchunit').style.display = 'block';
	let inputfield = document.getElementById('searchbox');
	inputfield.value = event.srcElement.value;
	inputfield.focus();
	//inputfield.select();
	search(event);
}

function addevent(){
	
	let searchbars = document.getElementsByName('q');
	let searchunit = document.createElement('div');
	document.onclick = function(e){
		if(e.target.id !=='searchunit'){
			searchunit.style.display = 'none';
			searchbars.forEach(function(e){
				e.value = '';
				if(e.getAttribute("searchbar") == searchunit.getAttribute('s'))
				{
					e.focus();
				}});
			};
		}
	searchunit.id = "searchunit"
	searchunit.className = "popup";
	searchunit.innerHTML = "<div class = 'center-box'/><input id = 'searchbox' class = 'searchbox'></input></div>"; 
	let i = 0;
	searchbars.forEach(function(e){
		searchunit.setAttribute("s", i);
		e.setAttribute("searchbar", i);
		document.body.appendChild(searchunit);
		e.addEventListener("input", popup);
		i = i + 1;
	});
	searchunit.addEventListener("input", search);
	let autoCompleteBox = document.createElement('div'); 
	autoCompleteBox.id = "data"; 
	
	autoCompleteBox.test = "kut"
	searchunit.appendChild(autoCompleteBox); 
}

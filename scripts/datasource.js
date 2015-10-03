var dataSource = (function(){
    var module = {};
	function supports_storage() {
	  try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	  }
	}
	module.getData = function (url,callback){
		if(!supports_storage()) return "";
		return localStorage.getItem(url);
	};
	module.setData = function (url,data){
		if(!supports_storage()) return false;
		localStorage.setItem(url,data);
	};
	return module;
}());
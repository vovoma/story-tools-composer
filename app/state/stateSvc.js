function stateSvc($location, $q) {
  var svc = {};
  svc.config = null;
  svc.getConfig = function () {
    var deferred = $q.defer();
    var path = $location.path();
    var mapID = /\/maps\/(\d+)/.exec(path) ? /\/maps\/(\d+)/.exec(path)[1] : null;
    var mapJsonUrl = '/maps/' + mapID + '/data';
    if (svc.config) {
      deferred.resolve(svc.config);
    } else if (mapID) {
      $.ajax({
        dataType: "json",
        url: mapJsonUrl ,
        }).done(function ( data ) {
          svc.config = data;
          deferred.resolve(data);
      });
    } else {
      svc.config = window.config;
      deferred.resolve(window.config);
    }
    return deferred.promise;
  };

  svc.getChapter = function() {
    var chapter = 1;
    var path = $location.path();
    var matches;
    if (path && path.indexOf('/chapter') === 0){
      if ((matches = /\d+/.exec(path)) !== null) {
        chapter = matches[0];
      }
    }
    return chapter;
  };
  return svc;
}

module.exports = stateSvc;
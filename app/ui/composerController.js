function composerController(
  $scope,
  $rootScope,
  $log,
  $compile,
  $http,
  $injector,
  $uibModal,
  MapManager,
  styleUpdater,
  stFeatureInfoService,
  appConfig,
  TimeControlsManager,
  stateSvc,
  navigationSvc,
  pinSvc,
  uiHelperSvc,
  searchSvc,
  // popupSvc,
  $location
) {
  $scope.mapManager = MapManager;
  $scope.stateSvc = stateSvc;
  $scope.pinSvc = pinSvc;
  $scope.uiHelperSvc = uiHelperSvc;
  $scope.searchSvc = searchSvc;
  $scope.pin = {};

  $rootScope.$on("showPin", (event, pin) => {
    self.displayPinInfo(null, pin);
  });

  $rootScope.$on("rangeChange", (event, range) => {
    // StoryPinLayerManager.autoDisplayPins(range);
  });

  $rootScope.$on("hidePinOverlay", (event, pin) => {
    self.hidePinOverlay(pin);
  });

  $rootScope.$on("hidePinOverlay", (event, pin) => {
    self.hidePinOverlay(pin);
  });

  $rootScope.$on("$locationChangeSuccess", () => {
    $scope.mapManager.initMapLoad();
    $scope.stateSvc.updateCurrentChapterConfig();
  });

  $rootScope.$on("configInitialized", () => {
    $scope.mapManager.initMapLoad();
  });

  $rootScope.$on("pin-added", (event, chapter_index) => {
    // $scope.$apply();
  });

  $rootScope.$on("chapter-added", (event, config) => {
    pinSvc.addChapter();
  });

  $rootScope.$on("chapter-removed", (event, chapter_index) => {
    pinSvc.removeChapter(chapter_index);
  });

  MapManager.storyMap.getMap().on("click", evt => {
    // popupSvc.displayInfo(evt.pixel);
  });

  $scope.updateSelected = selected => {
    $scope.selected = { selected: true };
  };

  $scope.mode = {
    preview: false
  };
  $scope.timeControlsManager = $injector.instantiate(TimeControlsManager);
  $scope.mapWidth = appConfig.dimensions.mapWidthEditMode;
  $scope.playbackOptions = {
    mode: "instant",
    fixed: false
  };

  $scope.saveMap = () => {
    stateSvc.save();
  };

  $scope.newMap = () => {
    $location.path("/new");
  };

  $scope.styleChanged = layer => {
    layer.on("change:type", evt => {
      styleUpdater.updateStyle(evt.target);
    });
    styleUpdater.updateStyle(layer);
  };

  $scope.showLoadMapDialog = () => {
    const promise = loadMapDialog.show();
    promise.then(result => {
      if (result.mapstoryMapId) {
        $location.path(`/maps/${result.mapstoryMapId}/data/`);
      } else if (result.localMapId) {
        $location.path(`/local/${result.localMapId}`);
      }
    });
  };

  $scope.getMapWidth = preview => {
    if (preview === true) {
      return appConfig.dimensions.mapWidthPreviewMode;
    }
    return appConfig.dimensions.mapWidthEditMode;
  };

  $scope.togglePreviewMode = () => {
    $scope.mapWidth = $scope.getMapWidth($scope.mode.preview);
    $rootScope.mapWidth = $scope.mapWidth;
    if ($scope.mode.preview) {
      $("[data-target='#playback-settings']").css("display", "inline-block");
    } else {
      $("[data-target='#playback-settings']").css("display", "none");
    }
    $rootScope.$broadcast("toggleMode", {
      mapWidth: $scope.mapWidth
    });
    setTimeout(() => {
      window.storyMap.getMap().updateSize();
    });
  };

  // strip features from properties to avoid circular dependencies in debug
  $scope.layerProperties = lyr => {
    const props = lyr.getProperties();
    const features = delete props.features;
    props.featureCount = (features || []).length;
    return props;
  };

  $scope.nextChapter = navigationSvc.nextChapter;
  $scope.previousChapter = navigationSvc.previousChapter;

  $scope.openStoryModal = function(size) {
    const uibmodalInstance = $uibModal.open({
      templateUrl: "app/ui/templates/storyInfoModal.html",
      size,
      scope: $scope
    });

    uibmodalInstance.result.then(
      (selectedItem) => {
        $scope.selected = selectedItem;
      },
      () => {
        $log.info("Modal dismissed at: " + new Date());
      }
    );
  };
}

module.exports = composerController;

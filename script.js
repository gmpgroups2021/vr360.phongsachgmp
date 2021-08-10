(function(){
    var script = {
 "scripts": {
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "getKey": function(key){  return window[key]; },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "registerKey": function(key, value){  window[key] = value; },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "unregisterKey": function(key){  delete window[key]; },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "existsKey": function(key){  return key in window; },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; }
 },
 "paddingBottom": 0,
 "borderRadius": 0,
 "backgroundPreloadEnabled": true,
 "class": "Player",
 "desktopMipmappingEnabled": false,
 "layout": "absolute",
 "contentOpaque": false,
 "id": "rootPlayer",
 "defaultVRPointer": "laser",
 "paddingRight": 0,
 "children": [
  "this.MainViewer",
  "this.Container_3AF42711_2891_A8A9_41B7_EBD14775229F",
  "this.Image_3D22A574_28F6_EB6F_41B6_80545AB26D3A",
  "this.IconButton_3C68243B_2892_68D9_41C0_E73FA55EB768",
  "this.WebFrame_3E50D649_2891_E8B8_41B1_DB138DC00B23",
  "this.Image_3D0D13AD_2892_6FF8_419E_B71AB87F3541",
  "this.Image_3E03341C_28B1_E8D8_41BB_B97CC94D5A8F",
  "this.Container_3DB3EC32_28BF_B8EB_41A7_DEE0CF502248"
 ],
 "definitions": [{
 "label": "P \u1ee6",
 "class": "Photo",
 "width": 1800,
 "thumbnailUrl": "media/album_3EE35D22_2876_58EB_40E1_C44CF6E55F80_2_t.jpg",
 "id": "album_3EE35D22_2876_58EB_40E1_C44CF6E55F80_2",
 "image": {
  "levels": [
   {
    "url": "media/album_3EE35D22_2876_58EB_40E1_C44CF6E55F80_2.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "duration": 5000,
 "height": 1200
},
{
 "label": "TOP01",
 "class": "Photo",
 "width": 1800,
 "thumbnailUrl": "media/album_3D361AC0_28B1_F9A7_41A5_C68170E7BD98_3_t.jpg",
 "id": "album_3D361AC0_28B1_F9A7_41A5_C68170E7BD98_3",
 "image": {
  "levels": [
   {
    "url": "media/album_3D361AC0_28B1_F9A7_41A5_C68170E7BD98_3.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "duration": 5000,
 "height": 1200
},
{
 "items": [
  {
   "media": "this.panorama_22111A6F_286F_D978_41B2_E2B93685477A",
   "camera": "this.panorama_22111A6F_286F_D978_41B2_E2B93685477A_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_22541986_286F_DBA8_418E_8F601C84156B",
   "camera": "this.panorama_22541986_286F_DBA8_418E_8F601C84156B_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_222841AB_286F_ABF8_41B3_5117F7A87751",
   "camera": "this.panorama_222841AB_286F_ABF8_41B3_5117F7A87751_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF",
   "camera": "this.panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10",
   "camera": "this.panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_222CA225_286F_A8E9_41B4_67FF3D19BBBA",
   "camera": "this.panorama_222CA225_286F_A8E9_41B4_67FF3D19BBBA_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 6)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "begin": "this.setEndToItemIndex(this.mainPlayList, 6, 7)",
   "media": "this.album_3D361AC0_28B1_F9A7_41A5_C68170E7BD98",
   "player": "this.MainViewerPhotoAlbumPlayer",
   "class": "PhotoAlbumPlayListItem"
  },
  {
   "media": "this.album_3EE35D22_2876_58EB_40E1_C44CF6E55F80",
   "end": "this.trigger('tourEnded')",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 7, 0)",
   "player": "this.MainViewerPhotoAlbumPlayer",
   "class": "PhotoAlbumPlayListItem"
  }
 ],
 "id": "mainPlayList",
 "class": "PlayList"
},
{
 "label": "P. H\u1ea4P",
 "class": "Photo",
 "width": 1800,
 "thumbnailUrl": "media/photo_3FF9409C_28B6_69D8_41A1_0ED33D7B60CA_t.jpg",
 "id": "photo_3FF9409C_28B6_69D8_41A1_0ED33D7B60CA",
 "image": {
  "levels": [
   {
    "url": "media/photo_3FF9409C_28B6_69D8_41A1_0ED33D7B60CA.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "duration": 5000,
 "height": 1200
},
{
 "label": "Photo Album HUY MOI TRUONG",
 "class": "PhotoAlbum",
 "thumbnailUrl": "media/album_3EE35D22_2876_58EB_40E1_C44CF6E55F80_t.png",
 "id": "album_3EE35D22_2876_58EB_40E1_C44CF6E55F80",
 "playList": "this.album_3EE35D22_2876_58EB_40E1_C44CF6E55F80_AlbumPlayList"
},
{
 "items": [
  {
   "media": "this.panorama_22111A6F_286F_D978_41B2_E2B93685477A",
   "camera": "this.panorama_22111A6F_286F_D978_41B2_E2B93685477A_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_3BC9B660_2892_6968_41AD_9EAAE90385F5_playlist, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_22541986_286F_DBA8_418E_8F601C84156B",
   "camera": "this.panorama_22541986_286F_DBA8_418E_8F601C84156B_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_3BC9B660_2892_6968_41AD_9EAAE90385F5_playlist, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_222841AB_286F_ABF8_41B3_5117F7A87751",
   "camera": "this.panorama_222841AB_286F_ABF8_41B3_5117F7A87751_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_3BC9B660_2892_6968_41AD_9EAAE90385F5_playlist, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF",
   "camera": "this.panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_3BC9B660_2892_6968_41AD_9EAAE90385F5_playlist, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10",
   "camera": "this.panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_3BC9B660_2892_6968_41AD_9EAAE90385F5_playlist, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_222CA225_286F_A8E9_41B4_67FF3D19BBBA",
   "camera": "this.panorama_222CA225_286F_A8E9_41B4_67FF3D19BBBA_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_3BC9B660_2892_6968_41AD_9EAAE90385F5_playlist, 5, 0)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  }
 ],
 "id": "ThumbnailList_3BC9B660_2892_6968_41AD_9EAAE90385F5_playlist",
 "class": "PlayList"
},
{
 "gyroscopeVerticalDraggingEnabled": true,
 "mouseControlMode": "drag_rotation",
 "class": "PanoramaPlayer",
 "touchControlMode": "drag_rotation",
 "displayPlaybackBar": true,
 "id": "MainViewerPanoramaPlayer",
 "viewerArea": "this.MainViewer"
},
{
 "label": "HUY MOI TRUONG",
 "class": "Photo",
 "width": 1800,
 "thumbnailUrl": "media/album_3EE35D22_2876_58EB_40E1_C44CF6E55F80_0_t.jpg",
 "id": "album_3EE35D22_2876_58EB_40E1_C44CF6E55F80_0",
 "image": {
  "levels": [
   {
    "url": "media/album_3EE35D22_2876_58EB_40E1_C44CF6E55F80_0.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "duration": 5000,
 "height": 1200
},
{
 "label": "Photo Album P.C\u00c2N",
 "class": "PhotoAlbum",
 "thumbnailUrl": "media/album_3D361AC0_28B1_F9A7_41A5_C68170E7BD98_t.png",
 "id": "album_3D361AC0_28B1_F9A7_41A5_C68170E7BD98",
 "playList": "this.album_3D361AC0_28B1_F9A7_41A5_C68170E7BD98_AlbumPlayList"
},
{
 "hfovMax": 130,
 "label": "P. Thi\u1ebft B\u1ecb Sinh Nhi\u1ec7t",
 "vfov": 180,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10_t.jpg",
 "class": "Panorama",
 "pitch": 0,
 "id": "panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10",
 "overlays": [
  "this.overlay_3A172C41_2892_D8A9_41A1_4DF3FA00BA08",
  "this.overlay_3CAA7BD8_2891_BFA7_41B7_ED88860E9D03",
  "this.overlay_3A9A7CEB_2897_B978_41B4_9F8BED5CB1E1",
  "this.overlay_3BA035D8_2896_AB58_41B1_730877A13BBF"
 ],
 "adjacentPanoramas": [
  {
   "yaw": 107.4,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF",
   "backwardYaw": -151.74,
   "distance": 1
  },
  {
   "yaw": -45.72,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_222CA225_286F_A8E9_41B4_67FF3D19BBBA",
   "backwardYaw": -62.81,
   "distance": 1
  }
 ],
 "hfov": 360,
 "hfovMin": "150%",
 "partial": false
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 33.55,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 5.31,
    "easing": "cubic_in"
   },
   {
    "yawDelta": 292.9,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 5.31,
    "easing": "linear"
   },
   {
    "yawDelta": 33.55,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 5.31,
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_222CA225_286F_A8E9_41B4_67FF3D19BBBA_camera",
 "manualRotationSpeed": 260,
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": -72.6,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_3DA875A8_2D98_F87A_4193_21C53B918E90",
 "manualRotationSpeed": 260,
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "label": "P. \u1ee6",
 "vfov": 180,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1536,
      "rowCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1536,
      "rowCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1536,
      "rowCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1536,
      "rowCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1536,
      "rowCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1536,
      "rowCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF_t.jpg",
 "class": "Panorama",
 "pitch": 0,
 "id": "panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF",
 "overlays": [
  "this.overlay_39E9F68D_28B2_A9B9_41C3_6A2F386D5D72",
  "this.overlay_3AB4BCA5_28B2_59E9_419D_B6319CAE5A21",
  "this.overlay_39ACDE97_28B2_79A8_41B0_3828245CB650",
  "this.overlay_3AAE8422_28B2_E8E8_41A1_C266655467B2"
 ],
 "adjacentPanoramas": [
  {
   "yaw": 62.18,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_22111A6F_286F_D978_41B2_E2B93685477A",
   "backwardYaw": 111.92,
   "distance": 1
  },
  {
   "yaw": -151.74,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10",
   "backwardYaw": 107.4,
   "distance": 1
  }
 ],
 "hfov": 360,
 "hfovMin": "150%",
 "partial": false
},
{
 "id": "ViewerAreaLabeled_3DB31C32_28BF_B8EB_41BF_671257555253PhotoAlbumPlayer",
 "class": "PhotoAlbumPlayer",
 "viewerArea": "this.ViewerAreaLabeled_3DB31C32_28BF_B8EB_41BF_671257555253",
 "buttonPrevious": "this.IconButton_3DB32C32_28BF_B8EB_4191_646D39129F1D",
 "buttonNext": "this.IconButton_3DB3CC32_28BF_B8EB_41A5_3A84824E4C1A"
},
{
 "label": "P. H\u00d3A L\u00dd",
 "class": "Photo",
 "width": 1800,
 "thumbnailUrl": "media/photo_3FE3030C_28B6_68BF_41B7_A2E86D7C5A79_t.jpg",
 "id": "photo_3FE3030C_28B6_68BF_41B7_A2E86D7C5A79",
 "image": {
  "levels": [
   {
    "url": "media/photo_3FE3030C_28B6_68BF_41B7_A2E86D7C5A79.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "duration": 5000,
 "height": 1200
},
{
 "hfovMax": 130,
 "label": "P. H\u00f3a Trung T\u00e2m",
 "vfov": 180,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_22111A6F_286F_D978_41B2_E2B93685477A_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_22111A6F_286F_D978_41B2_E2B93685477A_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_22111A6F_286F_D978_41B2_E2B93685477A_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_22111A6F_286F_D978_41B2_E2B93685477A_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_22111A6F_286F_D978_41B2_E2B93685477A_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_22111A6F_286F_D978_41B2_E2B93685477A_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_22111A6F_286F_D978_41B2_E2B93685477A_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_22111A6F_286F_D978_41B2_E2B93685477A_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_22111A6F_286F_D978_41B2_E2B93685477A_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_22111A6F_286F_D978_41B2_E2B93685477A_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_22111A6F_286F_D978_41B2_E2B93685477A_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_22111A6F_286F_D978_41B2_E2B93685477A_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_22111A6F_286F_D978_41B2_E2B93685477A_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_22111A6F_286F_D978_41B2_E2B93685477A_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_22111A6F_286F_D978_41B2_E2B93685477A_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_22111A6F_286F_D978_41B2_E2B93685477A_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_22111A6F_286F_D978_41B2_E2B93685477A_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_22111A6F_286F_D978_41B2_E2B93685477A_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_22111A6F_286F_D978_41B2_E2B93685477A_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_22111A6F_286F_D978_41B2_E2B93685477A_t.jpg",
 "class": "Panorama",
 "pitch": 0,
 "id": "panorama_22111A6F_286F_D978_41B2_E2B93685477A",
 "overlays": [
  "this.overlay_260E89FB_2871_BB58_41C1_D0D93AE90108",
  "this.overlay_26E9BE65_2872_5969_41C1_2A8604A80F3F",
  "this.overlay_3CEF2518_2892_E8A7_41B6_B9BEC7DA5853",
  "this.overlay_39BC384B_2892_58B9_4193_85ED4A639248",
  "this.overlay_3C65D43E_28B1_E8D8_41AB_52DBD4DA6F16",
  "this.overlay_391C7DCB_28BE_5BB8_41BB_519D85CE6795"
 ],
 "adjacentPanoramas": [
  {
   "yaw": -86.8,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_22541986_286F_DBA8_418E_8F601C84156B",
   "backwardYaw": -48.11,
   "distance": 1
  },
  {
   "yaw": 80.77,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_222841AB_286F_ABF8_41B3_5117F7A87751",
   "backwardYaw": 120.21,
   "distance": 1
  },
  {
   "yaw": 111.92,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF",
   "backwardYaw": 62.18,
   "distance": 1
  }
 ],
 "hfov": 360,
 "hfovMin": "204%",
 "partial": false
},
{
 "hfovMax": 130,
 "label": "P. Th\u1eed \u0110\u1ed9 Nhi\u1ec5m Khu\u1ea9n",
 "vfov": 180,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_222841AB_286F_ABF8_41B3_5117F7A87751_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_222841AB_286F_ABF8_41B3_5117F7A87751_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1536,
      "rowCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_222841AB_286F_ABF8_41B3_5117F7A87751_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_222841AB_286F_ABF8_41B3_5117F7A87751_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_222841AB_286F_ABF8_41B3_5117F7A87751_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1536,
      "rowCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_222841AB_286F_ABF8_41B3_5117F7A87751_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_222841AB_286F_ABF8_41B3_5117F7A87751_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_222841AB_286F_ABF8_41B3_5117F7A87751_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1536,
      "rowCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_222841AB_286F_ABF8_41B3_5117F7A87751_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_222841AB_286F_ABF8_41B3_5117F7A87751_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_222841AB_286F_ABF8_41B3_5117F7A87751_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1536,
      "rowCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_222841AB_286F_ABF8_41B3_5117F7A87751_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_222841AB_286F_ABF8_41B3_5117F7A87751_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_222841AB_286F_ABF8_41B3_5117F7A87751_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1536,
      "rowCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_222841AB_286F_ABF8_41B3_5117F7A87751_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_222841AB_286F_ABF8_41B3_5117F7A87751_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_222841AB_286F_ABF8_41B3_5117F7A87751_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1536,
      "rowCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_222841AB_286F_ABF8_41B3_5117F7A87751_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_222841AB_286F_ABF8_41B3_5117F7A87751_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_222841AB_286F_ABF8_41B3_5117F7A87751_t.jpg",
 "class": "Panorama",
 "pitch": 0,
 "id": "panorama_222841AB_286F_ABF8_41B3_5117F7A87751",
 "overlays": [
  "this.overlay_399DC7E6_28B2_D76B_41C2_DEC223527A5E",
  "this.overlay_39C03906_28B6_58AB_4194_AA307EE70688"
 ],
 "adjacentPanoramas": [
  {
   "yaw": 120.21,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_22111A6F_286F_D978_41B2_E2B93685477A",
   "backwardYaw": 80.77,
   "distance": 1
  }
 ],
 "hfov": 360,
 "hfovMin": "150%",
 "partial": false
},
{
 "items": [
  {
   "begin": "this.loopAlbum(this.playList_3D9A6557_2D98_F8D6_4196_E3F1069D98DD, 0)",
   "media": "this.album_3D361AC0_28B1_F9A7_41A5_C68170E7BD98",
   "player": "this.ViewerAreaLabeled_3DB31C32_28BF_B8EB_41BF_671257555253PhotoAlbumPlayer",
   "class": "PhotoAlbumPlayListItem"
  }
 ],
 "id": "playList_3D9A6557_2D98_F8D6_4196_E3F1069D98DD",
 "class": "PlayList"
},
{
 "label": "P. H\u00d3A TRUNG T\u00c2M",
 "class": "Photo",
 "width": 1800,
 "thumbnailUrl": "media/photo_3D6AF498_28B6_69D8_41AC_031F81290A72_t.jpg",
 "id": "photo_3D6AF498_28B6_69D8_41AC_031F81290A72",
 "image": {
  "levels": [
   {
    "url": "media/photo_3D6AF498_28B6_69D8_41AC_031F81290A72.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "duration": 5000,
 "height": 1200
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": -59.79,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_2377F5F2_2D98_FBEE_41C0_4BA95B351E6D",
 "manualRotationSpeed": 254,
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "label": "P. H\u1ea5p",
 "vfov": 180,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_22541986_286F_DBA8_418E_8F601C84156B_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_22541986_286F_DBA8_418E_8F601C84156B_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1536,
      "rowCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_22541986_286F_DBA8_418E_8F601C84156B_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_22541986_286F_DBA8_418E_8F601C84156B_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_22541986_286F_DBA8_418E_8F601C84156B_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1536,
      "rowCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_22541986_286F_DBA8_418E_8F601C84156B_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_22541986_286F_DBA8_418E_8F601C84156B_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_22541986_286F_DBA8_418E_8F601C84156B_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1536,
      "rowCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_22541986_286F_DBA8_418E_8F601C84156B_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_22541986_286F_DBA8_418E_8F601C84156B_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_22541986_286F_DBA8_418E_8F601C84156B_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1536,
      "rowCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_22541986_286F_DBA8_418E_8F601C84156B_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_22541986_286F_DBA8_418E_8F601C84156B_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_22541986_286F_DBA8_418E_8F601C84156B_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1536,
      "rowCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_22541986_286F_DBA8_418E_8F601C84156B_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_22541986_286F_DBA8_418E_8F601C84156B_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_22541986_286F_DBA8_418E_8F601C84156B_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1536,
      "rowCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_22541986_286F_DBA8_418E_8F601C84156B_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_22541986_286F_DBA8_418E_8F601C84156B_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_22541986_286F_DBA8_418E_8F601C84156B_t.jpg",
 "class": "Panorama",
 "pitch": 0,
 "id": "panorama_22541986_286F_DBA8_418E_8F601C84156B",
 "overlays": [
  "this.overlay_382A2772_2871_B76B_4192_087FBB5A9A62",
  "this.overlay_39684DDB_2871_DB59_4174_02031D41788E"
 ],
 "adjacentPanoramas": [
  {
   "yaw": -48.11,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_22111A6F_286F_D978_41B2_E2B93685477A",
   "backwardYaw": -86.8,
   "distance": 1
  }
 ],
 "hfov": 360,
 "hfovMin": "150%",
 "partial": false
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10_camera",
 "manualRotationSpeed": 260,
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 22.7,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in"
   },
   {
    "yawDelta": 314.6,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear"
   },
   {
    "yawDelta": 22.7,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": -99.23,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_237A460A_2D98_F83E_41C3_348D29D192E9",
 "manualRotationSpeed": 254,
 "automaticZoomSpeed": 10,
 "automaticRotationSpeed": 0
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": 28.26,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_236CB616_2D98_F856_41B2_56CA47146A47",
 "manualRotationSpeed": 254,
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_222841AB_286F_ABF8_41B3_5117F7A87751_camera",
 "manualRotationSpeed": 254,
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 33.55,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 5.31,
    "easing": "cubic_in"
   },
   {
    "yawDelta": 292.9,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 5.31,
    "easing": "linear"
   },
   {
    "yawDelta": 33.55,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 5.31,
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": 117.19,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_22974624_2D98_F86A_41C0_88058CA44DE9",
 "manualRotationSpeed": 260,
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": 131.89,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_234B95E5_2D98_FBEA_41B0_A23F3004D859",
 "manualRotationSpeed": 254,
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": -117.82,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_237C25FE_2D98_FBD6_41B4_C0F62962C00B",
 "manualRotationSpeed": 254,
 "automaticZoomSpeed": 10
},
{
 "id": "MainViewerPhotoAlbumPlayer",
 "class": "PhotoAlbumPlayer",
 "viewerArea": "this.MainViewer",
 "buttonPrevious": "this.IconButton_3DB32C32_28BF_B8EB_4191_646D39129F1D",
 "buttonNext": "this.IconButton_3DB3CC32_28BF_B8EB_41A5_3A84824E4C1A"
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": 39.69,
  "class": "PanoramaCameraPosition",
  "pitch": -11.8
 },
 "id": "panorama_22541986_286F_DBA8_418E_8F601C84156B_camera",
 "manualRotationSpeed": 254,
 "automaticZoomSpeed": 10
},
{
 "label": "P TH\u1eec \u0110\u1ed8 V\u00d4 KHU\u1ea8N",
 "class": "Photo",
 "width": 1800,
 "thumbnailUrl": "media/album_3EE35D22_2876_58EB_40E1_C44CF6E55F80_1_t.jpg",
 "id": "album_3EE35D22_2876_58EB_40E1_C44CF6E55F80_1",
 "image": {
  "levels": [
   {
    "url": "media/album_3EE35D22_2876_58EB_40E1_C44CF6E55F80_1.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "duration": 5000,
 "height": 1200
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": 134.28,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_234CE5D5_2D98_F82A_41BA_B04CD860FF64",
 "manualRotationSpeed": 260,
 "automaticZoomSpeed": 10
},
{
 "label": "TOP02",
 "class": "Photo",
 "width": 1800,
 "thumbnailUrl": "media/album_3D361AC0_28B1_F9A7_41A5_C68170E7BD98_4_t.jpg",
 "id": "album_3D361AC0_28B1_F9A7_41A5_C68170E7BD98_4",
 "image": {
  "levels": [
   {
    "url": "media/album_3D361AC0_28B1_F9A7_41A5_C68170E7BD98_4.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "duration": 5000,
 "height": 1200
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 22.7,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in"
   },
   {
    "yawDelta": 314.6,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear"
   },
   {
    "yawDelta": 22.7,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": 18.7,
  "class": "PanoramaCameraPosition",
  "pitch": 0.3
 },
 "id": "panorama_22111A6F_286F_D978_41B2_E2B93685477A_camera",
 "manualRotationSpeed": 254,
 "automaticZoomSpeed": 10,
 "automaticRotationSpeed": 0
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 22.7,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in"
   },
   {
    "yawDelta": 314.6,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear"
   },
   {
    "yawDelta": 22.7,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": -68.08,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_3DA6159A_2D98_F85E_41BD_0DAD871CF759",
 "manualRotationSpeed": 254,
 "automaticZoomSpeed": 10,
 "automaticRotationSpeed": 0
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 22.7,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in"
   },
   {
    "yawDelta": 314.6,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear"
   },
   {
    "yawDelta": 22.7,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": 93.2,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_3DBC158B_2D98_F83E_41B3_542A25523158",
 "manualRotationSpeed": 254,
 "automaticZoomSpeed": 10,
 "automaticRotationSpeed": 0
},
{
 "hfovMax": 130,
 "label": "P. R\u1eeda D\u1ee5ng C\u1ee5",
 "vfov": 180,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_222CA225_286F_A8E9_41B4_67FF3D19BBBA_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_222CA225_286F_A8E9_41B4_67FF3D19BBBA_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_222CA225_286F_A8E9_41B4_67FF3D19BBBA_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_222CA225_286F_A8E9_41B4_67FF3D19BBBA_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_222CA225_286F_A8E9_41B4_67FF3D19BBBA_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_222CA225_286F_A8E9_41B4_67FF3D19BBBA_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_222CA225_286F_A8E9_41B4_67FF3D19BBBA_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_222CA225_286F_A8E9_41B4_67FF3D19BBBA_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_222CA225_286F_A8E9_41B4_67FF3D19BBBA_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_222CA225_286F_A8E9_41B4_67FF3D19BBBA_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_222CA225_286F_A8E9_41B4_67FF3D19BBBA_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_222CA225_286F_A8E9_41B4_67FF3D19BBBA_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_222CA225_286F_A8E9_41B4_67FF3D19BBBA_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_222CA225_286F_A8E9_41B4_67FF3D19BBBA_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_222CA225_286F_A8E9_41B4_67FF3D19BBBA_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_222CA225_286F_A8E9_41B4_67FF3D19BBBA_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_222CA225_286F_A8E9_41B4_67FF3D19BBBA_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_222CA225_286F_A8E9_41B4_67FF3D19BBBA_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_222CA225_286F_A8E9_41B4_67FF3D19BBBA_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_222CA225_286F_A8E9_41B4_67FF3D19BBBA_t.jpg",
 "class": "Panorama",
 "pitch": 0,
 "id": "panorama_222CA225_286F_A8E9_41B4_67FF3D19BBBA",
 "overlays": [
  "this.overlay_3ABAC8B8_2892_59E7_41AE_BF0BF275F076",
  "this.overlay_3A6EB111_2892_E8A9_4131_095504BDCBFC"
 ],
 "adjacentPanoramas": [
  {
   "yaw": -62.81,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10",
   "backwardYaw": -45.72,
   "distance": 1
  }
 ],
 "hfov": 360,
 "hfovMin": "150%",
 "partial": false
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF_camera",
 "manualRotationSpeed": 254,
 "automaticZoomSpeed": 10
},
{
 "toolTipDisplayTime": 600,
 "paddingBottom": 0,
 "borderRadius": 0,
 "class": "ViewerArea",
 "transitionMode": "blending",
 "toolTipShadowColor": "#333333",
 "progressOpacity": 1,
 "id": "MainViewer",
 "playbackBarHeadBorderRadius": 0,
 "width": "100%",
 "playbackBarHeadBorderColor": "#000000",
 "playbackBarHeadBorderSize": 0,
 "vrPointerSelectionColor": "#FF6600",
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarBottom": 5,
 "toolTipPaddingBottom": 4,
 "toolTipFontWeight": "normal",
 "playbackBarLeft": 0,
 "playbackBarHeadHeight": 15,
 "toolTipBorderColor": "#767676",
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "vrPointerSelectionTime": 2000,
 "progressBorderColor": "#000000",
 "toolTipBorderSize": 1,
 "height": "100%",
 "borderSize": 0,
 "toolTipPaddingTop": 4,
 "playbackBarHeadShadow": true,
 "playbackBarOpacity": 1,
 "firstTransitionDuration": 0,
 "progressBottom": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "progressHeight": 10,
 "progressBackgroundOpacity": 1,
 "toolTipTextShadowBlurRadius": 3,
 "paddingLeft": 0,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBarOpacity": 1,
 "vrPointerColor": "#FFFFFF",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "toolTipFontFamily": "Arial",
 "playbackBarHeadShadowHorizontalLength": 0,
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipTextShadowColor": "#000000",
 "progressBorderSize": 0,
 "toolTipBorderRadius": 3,
 "toolTipShadowOpacity": 1,
 "toolTipPaddingRight": 6,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarBorderSize": 0,
 "progressBorderRadius": 0,
 "progressBarBorderColor": "#000000",
 "paddingRight": 0,
 "playbackBarProgressOpacity": 1,
 "playbackBarHeight": 10,
 "playbackBarHeadWidth": 6,
 "progressLeft": 0,
 "playbackBarBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowOpacity": 0,
 "playbackBarRight": 0,
 "playbackBarProgressBorderSize": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "toolTipOpacity": 1,
 "toolTipShadowHorizontalLength": 0,
 "toolTipFontSize": "1.11vmin",
 "playbackBarHeadShadowOpacity": 0.7,
 "displayTooltipInTouchScreens": true,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "minHeight": 50,
 "playbackBarHeadOpacity": 1,
 "paddingTop": 0,
 "toolTipFontColor": "#606060",
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipShadowSpread": 0,
 "shadow": false,
 "minWidth": 100,
 "playbackBarProgressBorderRadius": 0,
 "transitionDuration": 500,
 "progressBarBorderSize": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "toolTipFontStyle": "normal",
 "toolTipPaddingLeft": 6,
 "progressBarBorderRadius": 0,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "playbackBarHeadShadowColor": "#000000",
 "toolTipShadowBlurRadius": 3,
 "toolTipShadowVerticalLength": 0,
 "progressRight": 0,
 "progressBackgroundColorDirection": "vertical",
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "propagateClick": false,
 "data": {
  "name": "Main Viewer"
 },
 "progressBackgroundColorRatios": [
  0
 ],
 "playbackBarBorderRadius": 0
},
{
 "layout": "absolute",
 "paddingBottom": 0,
 "borderRadius": 0,
 "class": "Container",
 "left": "0%",
 "contentOpaque": false,
 "id": "Container_3AF42711_2891_A8A9_41B7_EBD14775229F",
 "paddingRight": 0,
 "children": [
  "this.ThumbnailList_3BC9B660_2892_6968_41AD_9EAAE90385F5"
 ],
 "verticalAlign": "top",
 "scrollBarMargin": 2,
 "bottom": "0.21%",
 "minHeight": 1,
 "height": "39.058%",
 "scrollBarWidth": 10,
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "minWidth": 1,
 "scrollBarColor": "#000000",
 "overflow": "scroll",
 "paddingLeft": 0,
 "width": "14.596%",
 "horizontalAlign": "left",
 "propagateClick": false,
 "gap": 10,
 "data": {
  "name": "Listview"
 }
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "left": "0%",
 "class": "Image",
 "paddingRight": 0,
 "maxHeight": 1095,
 "maxWidth": 1095,
 "id": "Image_3D22A574_28F6_EB6F_41B6_80545AB26D3A",
 "url": "skin/Image_3D22A574_28F6_EB6F_41B6_80545AB26D3A.png",
 "verticalAlign": "middle",
 "top": "0%",
 "minHeight": 1,
 "height": "20.314%",
 "width": "15.983%",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "shadow": false,
 "minWidth": 1,
 "paddingLeft": 0,
 "scaleMode": "fit_inside",
 "data": {
  "name": "Image20839"
 },
 "horizontalAlign": "center",
 "propagateClick": false
},
{
 "toolTipPaddingRight": 6,
 "paddingBottom": 0,
 "borderRadius": 0,
 "toolTipBorderRadius": 3,
 "class": "IconButton",
 "right": "1%",
 "paddingRight": 0,
 "maxHeight": 128,
 "maxWidth": 128,
 "id": "IconButton_3C68243B_2892_68D9_41C0_E73FA55EB768",
 "toolTipShadowColor": "#333333",
 "toolTipTextShadowOpacity": 0,
 "toolTipShadowHorizontalLength": 0,
 "toolTipOpacity": 1,
 "toolTipPaddingBottom": 4,
 "toolTipFontWeight": "normal",
 "toolTipFontSize": 12,
 "verticalAlign": "middle",
 "toolTipBorderColor": "#767676",
 "bottom": "2%",
 "minHeight": 1,
 "width": "3.38%",
 "toolTipBorderSize": 1,
 "borderSize": 0,
 "toolTipPaddingTop": 4,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "mode": "toggle",
 "toolTipFontColor": "#606060",
 "height": "3.56%",
 "toolTipShadowSpread": 0,
 "shadow": false,
 "minWidth": 1,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTip": "Fullscreen",
 "toolTipFontStyle": "normal",
 "toolTipPaddingLeft": 6,
 "toolTipShadowBlurRadius": 3,
 "toolTipTextShadowBlurRadius": 3,
 "paddingLeft": 0,
 "data": {
  "name": "IconButton1493"
 },
 "horizontalAlign": "center",
 "toolTipShadowVerticalLength": 0,
 "propagateClick": false,
 "toolTipFontFamily": "Arial",
 "transparencyActive": true,
 "iconURL": "skin/IconButton_3C68243B_2892_68D9_41C0_E73FA55EB768.png",
 "cursor": "hand",
 "toolTipDisplayTime": 600,
 "toolTipTextShadowColor": "#000000",
 "toolTipShadowOpacity": 1
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "class": "WebFrame",
 "right": "19.44%",
 "paddingRight": 0,
 "insetBorder": false,
 "id": "WebFrame_3E50D649_2891_E8B8_41B1_DB138DC00B23",
 "url": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14906.822367730405!2d106.3365446!3d20.9241612!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xdeccb0e2ba0027d2!2zQ8OUTkcgVFkgQ-G7lCBQSOG6pk4gR01QIEdST1VQUw!5e0!3m2!1svi!2s!4v1628477112469!5m2!1svi!2s",
 "backgroundColorDirection": "vertical",
 "bottom": "16.34%",
 "minHeight": 1,
 "backgroundColor": [
  "#FFFFFF"
 ],
 "scrollEnabled": true,
 "width": "59.834%",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 1,
 "backgroundColorRatios": [
  0
 ],
 "height": "64.194%",
 "shadow": false,
 "minWidth": 1,
 "paddingLeft": 0,
 "data": {
  "name": "B\u1ea3n \u0111\u1ed3"
 },
 "visible": false,
 "propagateClick": false
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "class": "Image",
 "right": "5%",
 "paddingRight": 0,
 "maxHeight": 45,
 "maxWidth": 38,
 "id": "Image_3D0D13AD_2892_6FF8_419E_B71AB87F3541",
 "url": "skin/Image_3D0D13AD_2892_6FF8_419E_B71AB87F3541.png",
 "verticalAlign": "middle",
 "bottom": "2%",
 "minHeight": 1,
 "width": "2.292%",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "height": "4.712%",
 "shadow": false,
 "minWidth": 1,
 "click": "if(!this.WebFrame_3E50D649_2891_E8B8_41B1_DB138DC00B23.get('visible')){ this.setComponentVisibility(this.WebFrame_3E50D649_2891_E8B8_41B1_DB138DC00B23, true, 0, null, null, false) } else { this.setComponentVisibility(this.WebFrame_3E50D649_2891_E8B8_41B1_DB138DC00B23, false, 0, null, null, false) }",
 "paddingLeft": 0,
 "scaleMode": "fit_inside",
 "data": {
  "name": "Image28518"
 },
 "horizontalAlign": "center",
 "propagateClick": false
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "class": "Image",
 "right": "8.5%",
 "paddingRight": 0,
 "maxHeight": 45,
 "maxWidth": 74,
 "id": "Image_3E03341C_28B1_E8D8_41BB_B97CC94D5A8F",
 "url": "skin/Image_3E03341C_28B1_E8D8_41BB_B97CC94D5A8F.png",
 "verticalAlign": "middle",
 "bottom": "2%",
 "minHeight": 1,
 "width": "4.463%",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "height": "4.712%",
 "shadow": false,
 "minWidth": 1,
 "click": "this.setComponentVisibility(this.Container_3DB3EC32_28BF_B8EB_41A7_DEE0CF502248, true, 0, null, null, false)",
 "paddingLeft": 0,
 "scaleMode": "fit_inside",
 "data": {
  "name": "Image31039"
 },
 "horizontalAlign": "center",
 "propagateClick": false
},
{
 "layout": "absolute",
 "paddingBottom": 0,
 "borderRadius": 0,
 "left": "0%",
 "contentOpaque": false,
 "class": "Container",
 "right": "0%",
 "paddingRight": 0,
 "children": [
  "this.Container_3DB37C32_28BF_B8EB_41C3_096C81807F2E"
 ],
 "id": "Container_3DB3EC32_28BF_B8EB_41A7_DEE0CF502248",
 "scrollBarMargin": 2,
 "top": "0%",
 "backgroundColorDirection": "vertical",
 "bottom": "0%",
 "minHeight": 1,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "scrollBarWidth": 10,
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0.6,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "minWidth": 1,
 "verticalAlign": "top",
 "click": "this.setComponentVisibility(this.Container_3DB3EC32_28BF_B8EB_41A7_DEE0CF502248, false, 0, null, null, false)",
 "overflow": "scroll",
 "scrollBarColor": "#000000",
 "paddingLeft": 0,
 "data": {
  "name": "--PHOTOALBUM"
 },
 "horizontalAlign": "left",
 "creationPolicy": "inAdvance",
 "visible": false,
 "propagateClick": true,
 "gap": 10
},
{
 "items": [
  {
   "media": "this.album_3EE35D22_2876_58EB_40E1_C44CF6E55F80_0",
   "class": "PhotoPlayListItem",
   "camera": {
    "duration": 5000,
    "class": "MovementPhotoCamera",
    "targetPosition": {
     "x": "0.37",
     "class": "PhotoCameraPosition",
     "y": "0.64",
     "zoomFactor": 1.1
    },
    "initialPosition": {
     "x": "0.50",
     "class": "PhotoCameraPosition",
     "y": "0.50",
     "zoomFactor": 1
    },
    "scaleMode": "fit_outside",
    "easing": "linear"
   }
  },
  {
   "media": "this.album_3EE35D22_2876_58EB_40E1_C44CF6E55F80_1",
   "class": "PhotoPlayListItem",
   "camera": {
    "duration": 5000,
    "class": "MovementPhotoCamera",
    "targetPosition": {
     "x": "0.56",
     "class": "PhotoCameraPosition",
     "y": "0.42",
     "zoomFactor": 1.1
    },
    "initialPosition": {
     "x": "0.50",
     "class": "PhotoCameraPosition",
     "y": "0.50",
     "zoomFactor": 1
    },
    "scaleMode": "fit_outside",
    "easing": "linear"
   }
  },
  {
   "media": "this.album_3EE35D22_2876_58EB_40E1_C44CF6E55F80_2",
   "class": "PhotoPlayListItem",
   "camera": {
    "duration": 5000,
    "class": "MovementPhotoCamera",
    "targetPosition": {
     "x": "0.49",
     "class": "PhotoCameraPosition",
     "y": "0.52",
     "zoomFactor": 1.1
    },
    "initialPosition": {
     "x": "0.50",
     "class": "PhotoCameraPosition",
     "y": "0.50",
     "zoomFactor": 1
    },
    "scaleMode": "fit_outside",
    "easing": "linear"
   }
  }
 ],
 "id": "album_3EE35D22_2876_58EB_40E1_C44CF6E55F80_AlbumPlayList",
 "class": "PhotoPlayList"
},
{
 "items": [
  {
   "media": "this.album_3D361AC0_28B1_F9A7_41A5_C68170E7BD98_3",
   "class": "PhotoPlayListItem",
   "camera": {
    "duration": 5000,
    "class": "MovementPhotoCamera",
    "targetPosition": {
     "x": "0.35",
     "class": "PhotoCameraPosition",
     "y": "0.55",
     "zoomFactor": 1.1
    },
    "initialPosition": {
     "x": "0.50",
     "class": "PhotoCameraPosition",
     "y": "0.50",
     "zoomFactor": 1
    },
    "scaleMode": "fit_outside",
    "easing": "linear"
   }
  },
  {
   "media": "this.album_3D361AC0_28B1_F9A7_41A5_C68170E7BD98_4",
   "class": "PhotoPlayListItem",
   "camera": {
    "duration": 5000,
    "class": "MovementPhotoCamera",
    "targetPosition": {
     "x": "0.42",
     "class": "PhotoCameraPosition",
     "y": "0.31",
     "zoomFactor": 1.1
    },
    "initialPosition": {
     "x": "0.50",
     "class": "PhotoCameraPosition",
     "y": "0.50",
     "zoomFactor": 1
    },
    "scaleMode": "fit_outside",
    "easing": "linear"
   }
  },
  {
   "media": "this.photo_3FF9409C_28B6_69D8_41A1_0ED33D7B60CA",
   "class": "PhotoPlayListItem",
   "camera": {
    "duration": 5000,
    "class": "MovementPhotoCamera",
    "targetPosition": {
     "x": "0.39",
     "class": "PhotoCameraPosition",
     "y": "0.34",
     "zoomFactor": 1.1
    },
    "initialPosition": {
     "x": "0.50",
     "class": "PhotoCameraPosition",
     "y": "0.50",
     "zoomFactor": 1
    },
    "scaleMode": "fit_outside",
    "easing": "linear"
   }
  },
  {
   "media": "this.photo_3FE3030C_28B6_68BF_41B7_A2E86D7C5A79",
   "class": "PhotoPlayListItem",
   "camera": {
    "duration": 5000,
    "class": "MovementPhotoCamera",
    "targetPosition": {
     "x": "0.45",
     "class": "PhotoCameraPosition",
     "y": "0.37",
     "zoomFactor": 1.1
    },
    "initialPosition": {
     "x": "0.50",
     "class": "PhotoCameraPosition",
     "y": "0.50",
     "zoomFactor": 1
    },
    "scaleMode": "fit_outside",
    "easing": "linear"
   }
  },
  {
   "media": "this.photo_3D6AF498_28B6_69D8_41AC_031F81290A72",
   "class": "PhotoPlayListItem",
   "camera": {
    "duration": 5000,
    "class": "MovementPhotoCamera",
    "targetPosition": {
     "x": "0.64",
     "class": "PhotoCameraPosition",
     "y": "0.26",
     "zoomFactor": 1.1
    },
    "initialPosition": {
     "x": "0.50",
     "class": "PhotoCameraPosition",
     "y": "0.50",
     "zoomFactor": 1
    },
    "scaleMode": "fit_outside",
    "easing": "linear"
   }
  }
 ],
 "id": "album_3D361AC0_28B1_F9A7_41A5_C68170E7BD98_AlbumPlayList",
 "class": "PhotoPlayList"
},
{
 "rollOverDisplay": false,
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "Arrow 06a"
 },
 "maps": [
  {
   "yaw": 106.95,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10_0_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -9.5,
   "hfov": 17.45
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_3979DEFF_289E_7958_41B6_D734CC98D9D2",
   "yaw": 106.95,
   "pitch": -9.5,
   "distance": 100,
   "hfov": 17.45
  }
 ],
 "id": "overlay_3A172C41_2892_D8A9_41A1_4DF3FA00BA08"
},
{
 "rollOverDisplay": true,
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "PH\u00d2NG \u1ee6"
 },
 "maps": [
  {
   "yaw": 107.4,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10_0_HS_1_0_map.gif",
      "width": 21,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -5.98,
   "hfov": 24.99
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF, this.camera_236CB616_2D98_F856_41B2_56CA47146A47); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10_0_HS_1_0.png",
      "width": 348,
      "class": "ImageResourceLevel",
      "height": 265
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -5.98,
   "yaw": 107.4,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "hfov": 24.99
  }
 ],
 "id": "overlay_3CAA7BD8_2891_BFA7_41B7_ED88860E9D03"
},
{
 "rollOverDisplay": false,
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "Circle Point 01"
 },
 "maps": [
  {
   "yaw": -48.11,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10_0_HS_2_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 5.7,
   "hfov": 23.99
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_39799EFF_289E_7958_418B_BEC04659EDD9",
   "yaw": -48.11,
   "pitch": 5.7,
   "distance": 100,
   "hfov": 23.99
  }
 ],
 "id": "overlay_3A9A7CEB_2897_B978_41B4_9F8BED5CB1E1"
},
{
 "rollOverDisplay": true,
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "      PH\u00d2NG\u000dR\u1eecA D\u1ee4NG C\u1ee4"
 },
 "maps": [
  {
   "yaw": -45.72,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10_0_HS_3_0_map.gif",
      "width": 26,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 8.33,
   "hfov": 31.57
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_222CA225_286F_A8E9_41B4_67FF3D19BBBA, this.camera_22974624_2D98_F86A_41C0_88058CA44DE9); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10_0_HS_3_0.png",
      "width": 443,
      "class": "ImageResourceLevel",
      "height": 272
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 8.33,
   "yaw": -45.72,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "hfov": 31.57
  }
 ],
 "id": "overlay_3BA035D8_2896_AB58_41B1_730877A13BBF"
},
{
 "rollOverDisplay": false,
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "Arrow 06a"
 },
 "maps": [
  {
   "yaw": 61.6,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF_0_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -9.75,
   "hfov": 14.22
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_39792EFE_289E_7958_41B9_1DF1F7529E9F",
   "yaw": 61.6,
   "pitch": -9.75,
   "distance": 100,
   "hfov": 14.22
  }
 ],
 "id": "overlay_39E9F68D_28B2_A9B9_41C3_6A2F386D5D72"
},
{
 "rollOverDisplay": true,
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "         PH\u00d2NG\u000dH\u00d3A TRUNG T\u00c2M"
 },
 "maps": [
  {
   "yaw": 62.18,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF_0_HS_1_0_map.gif",
      "width": 26,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -5.61,
   "hfov": 39.5
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_22111A6F_286F_D978_41B2_E2B93685477A, this.camera_3DA6159A_2D98_F85E_41BD_0DAD871CF759); this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF_0_HS_1_0.png",
      "width": 496,
      "class": "ImageResourceLevel",
      "height": 295
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -5.61,
   "yaw": 62.18,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "hfov": 39.5
  }
 ],
 "id": "overlay_3AB4BCA5_28B2_59E9_419D_B6319CAE5A21"
},
{
 "rollOverDisplay": false,
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "Arrow 06a Left-Up"
 },
 "maps": [
  {
   "yaw": -154.79,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF_0_HS_2_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -28.72,
   "hfov": 24.39
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_3979EEFF_289E_7958_41AC_EF6E47989A86",
   "yaw": -154.79,
   "pitch": -28.72,
   "distance": 50,
   "hfov": 24.39
  }
 ],
 "id": "overlay_39ACDE97_28B2_79A8_41B0_3828245CB650"
},
{
 "rollOverDisplay": true,
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "           PH\u00d2NG\u000dTHI\u1ebeT B\u1eca SINH NHI\u1ec6T"
 },
 "maps": [
  {
   "yaw": -151.74,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF_0_HS_3_0_map.gif",
      "width": 30,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -21.44,
   "hfov": 44.66
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10, this.camera_3DA875A8_2D98_F87A_4193_21C53B918E90); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF_0_HS_3_0.png",
      "width": 599,
      "class": "ImageResourceLevel",
      "height": 314
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -21.44,
   "yaw": -151.74,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "hfov": 44.66
  }
 ],
 "id": "overlay_3AAE8422_28B2_E8E8_41A1_C266655467B2"
},
{
 "toolTipDisplayTime": 600,
 "paddingBottom": 0,
 "borderRadius": 0,
 "class": "ViewerArea",
 "left": "0%",
 "toolTipShadowColor": "#333333",
 "progressOpacity": 1,
 "id": "ViewerAreaLabeled_3DB31C32_28BF_B8EB_41BF_671257555253",
 "transitionMode": "blending",
 "width": "100%",
 "playbackBarHeadBorderColor": "#000000",
 "playbackBarHeadBorderSize": 0,
 "playbackBarHeadBorderRadius": 0,
 "vrPointerSelectionColor": "#FF6600",
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarBottom": 0,
 "toolTipPaddingBottom": 4,
 "toolTipFontWeight": "normal",
 "playbackBarLeft": 0,
 "playbackBarProgressBorderColor": "#000000",
 "toolTipBorderColor": "#767676",
 "playbackBarHeadHeight": 15,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "vrPointerSelectionTime": 2000,
 "progressBorderColor": "#FFFFFF",
 "toolTipBorderSize": 1,
 "borderSize": 0,
 "toolTipPaddingTop": 4,
 "playbackBarHeadShadow": true,
 "playbackBarOpacity": 1,
 "height": "100%",
 "firstTransitionDuration": 0,
 "progressBottom": 2,
 "toolTipBackgroundColor": "#F6F6F6",
 "progressHeight": 6,
 "progressBackgroundOpacity": 1,
 "toolTipTextShadowBlurRadius": 3,
 "paddingLeft": 0,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBarOpacity": 1,
 "vrPointerColor": "#FFFFFF",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "toolTipFontFamily": "Arial",
 "playbackBarHeadShadowHorizontalLength": 0,
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipTextShadowColor": "#000000",
 "progressBorderSize": 0,
 "show": "this.ViewerAreaLabeled_3DB31C32_28BF_B8EB_41BF_671257555253.bind('hide', function(e){ e.source.unbind('hide', arguments.callee, this); this.playList_3D9A6557_2D98_F8D6_4196_E3F1069D98DD.set('selectedIndex', -1); }, this); this.playList_3D9A6557_2D98_F8D6_4196_E3F1069D98DD.set('selectedIndex', 0)",
 "toolTipShadowOpacity": 1,
 "toolTipBorderRadius": 3,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarBorderSize": 0,
 "progressBorderRadius": 0,
 "toolTipPaddingRight": 6,
 "progressBarBorderColor": "#0066FF",
 "paddingRight": 0,
 "playbackBarProgressOpacity": 1,
 "playbackBarHeight": 10,
 "playbackBarHeadWidth": 6,
 "progressLeft": 0,
 "playbackBarBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowOpacity": 0,
 "playbackBarRight": 0,
 "playbackBarProgressBorderSize": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "toolTipOpacity": 1,
 "toolTipShadowHorizontalLength": 0,
 "toolTipFontSize": 12,
 "playbackBarHeadShadowOpacity": 0.7,
 "top": "0%",
 "playbackBarBorderColor": "#FFFFFF",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "minHeight": 1,
 "playbackBarHeadOpacity": 1,
 "displayTooltipInTouchScreens": true,
 "paddingTop": 0,
 "toolTipFontColor": "#606060",
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipShadowSpread": 0,
 "shadow": false,
 "minWidth": 1,
 "playbackBarProgressBorderRadius": 0,
 "transitionDuration": 500,
 "progressBarBorderSize": 6,
 "playbackBarHeadShadowBlurRadius": 3,
 "toolTipFontStyle": "normal",
 "toolTipPaddingLeft": 6,
 "progressBarBorderRadius": 0,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "playbackBarHeadShadowColor": "#000000",
 "toolTipShadowBlurRadius": 3,
 "toolTipShadowVerticalLength": 0,
 "progressRight": 0,
 "progressBackgroundColorDirection": "vertical",
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "propagateClick": false,
 "data": {
  "name": "Viewer photoalbum 1"
 },
 "progressBackgroundColorRatios": [
  0.01
 ],
 "playbackBarBorderRadius": 0
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "left": 10,
 "class": "IconButton",
 "rollOverIconURL": "skin/IconButton_3DB32C32_28BF_B8EB_4191_646D39129F1D_rollover.png",
 "paddingRight": 0,
 "maxHeight": 60,
 "maxWidth": 60,
 "id": "IconButton_3DB32C32_28BF_B8EB_4191_646D39129F1D",
 "verticalAlign": "middle",
 "top": "20%",
 "bottom": "20%",
 "minHeight": 50,
 "width": "14.22%",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "mode": "push",
 "pressedIconURL": "skin/IconButton_3DB32C32_28BF_B8EB_4191_646D39129F1D_pressed.png",
 "shadow": false,
 "minWidth": 50,
 "paddingLeft": 0,
 "data": {
  "name": "IconButton <"
 },
 "horizontalAlign": "center",
 "propagateClick": false,
 "transparencyActive": false,
 "iconURL": "skin/IconButton_3DB32C32_28BF_B8EB_4191_646D39129F1D.png",
 "cursor": "hand"
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "class": "IconButton",
 "rollOverIconURL": "skin/IconButton_3DB3CC32_28BF_B8EB_41A5_3A84824E4C1A_rollover.png",
 "right": 10,
 "paddingRight": 0,
 "maxHeight": 60,
 "maxWidth": 60,
 "id": "IconButton_3DB3CC32_28BF_B8EB_41A5_3A84824E4C1A",
 "verticalAlign": "middle",
 "top": "20%",
 "bottom": "20%",
 "minHeight": 50,
 "width": "14.22%",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "mode": "push",
 "pressedIconURL": "skin/IconButton_3DB3CC32_28BF_B8EB_41A5_3A84824E4C1A_pressed.png",
 "shadow": false,
 "minWidth": 50,
 "paddingLeft": 0,
 "data": {
  "name": "IconButton >"
 },
 "horizontalAlign": "center",
 "propagateClick": false,
 "transparencyActive": false,
 "iconURL": "skin/IconButton_3DB3CC32_28BF_B8EB_41A5_3A84824E4C1A.png",
 "cursor": "hand"
},
{
 "rollOverDisplay": false,
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "Arrow 06b"
 },
 "maps": [
  {
   "yaw": -86.8,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_22111A6F_286F_D978_41B2_E2B93685477A_0_HS_0_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -26.1,
   "hfov": 29.78
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_27367071_287E_6969_41C2_B2EFEB0455C3",
   "yaw": -86.8,
   "pitch": -26.1,
   "distance": 100,
   "hfov": 29.78
  }
 ],
 "id": "overlay_260E89FB_2871_BB58_41C1_D0D93AE90108"
},
{
 "rollOverDisplay": true,
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "    \u0110I V\u00c0O PH\u00d2NG H\u1ea4P"
 },
 "maps": [
  {
   "yaw": -86.8,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_22111A6F_286F_D978_41B2_E2B93685477A_0_HS_1_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 18
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -21.83,
   "hfov": 29.38
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_22541986_286F_DBA8_418E_8F601C84156B, this.camera_234B95E5_2D98_FBEA_41B0_A23F3004D859); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_22111A6F_286F_D978_41B2_E2B93685477A_0_HS_1_0.png",
      "width": 439,
      "class": "ImageResourceLevel",
      "height": 506
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -21.83,
   "yaw": -86.8,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "hfov": 29.38
  }
 ],
 "id": "overlay_26E9BE65_2872_5969_41C1_2A8604A80F3F"
},
{
 "rollOverDisplay": false,
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "Arrow 06a Right-Up"
 },
 "maps": [
  {
   "yaw": 86.38,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_22111A6F_286F_D978_41B2_E2B93685477A_0_HS_2_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -11.53,
   "hfov": 13.96
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_39372F9F_2892_77D8_41C1_D740E08F13C7",
   "yaw": 86.38,
   "pitch": -11.53,
   "distance": 50,
   "hfov": 13.96
  }
 ],
 "id": "overlay_3CEF2518_2892_E8A7_41B6_B9BEC7DA5853"
},
{
 "rollOverDisplay": true,
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "             PH\u00d2NG\u000dTH\u1eec \u0110\u1ed8 NHI\u1ec4M KHU\u1ea8N"
 },
 "maps": [
  {
   "yaw": 80.77,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_22111A6F_286F_D978_41B2_E2B93685477A_0_HS_3_0_map.gif",
      "width": 31,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -7.01,
   "hfov": 37.9
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_222841AB_286F_ABF8_41B3_5117F7A87751, this.camera_2377F5F2_2D98_FBEE_41C0_4BA95B351E6D); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_22111A6F_286F_D978_41B2_E2B93685477A_0_HS_3_0.png",
      "width": 530,
      "class": "ImageResourceLevel",
      "height": 268
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -7.01,
   "yaw": 80.77,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "hfov": 37.9
  }
 ],
 "id": "overlay_39BC384B_2892_58B9_4193_85ED4A639248"
},
{
 "rollOverDisplay": false,
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "Arrow 06b Right-Up"
 },
 "maps": [
  {
   "yaw": 105.26,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_22111A6F_286F_D978_41B2_E2B93685477A_0_HS_4_0_0_map.gif",
      "width": 34,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -18.44,
   "hfov": 15.49
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_3978DEFE_289E_7958_41B3_C7C0E9C69270",
   "yaw": 105.26,
   "pitch": -18.44,
   "distance": 50,
   "hfov": 15.49
  }
 ],
 "id": "overlay_3C65D43E_28B1_E8D8_41AB_52DBD4DA6F16"
},
{
 "rollOverDisplay": true,
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "PH\u00d2NG \u1ee6"
 },
 "maps": [
  {
   "yaw": 111.92,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_22111A6F_286F_D978_41B2_E2B93685477A_0_HS_5_0_map.gif",
      "width": 22,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -16.05,
   "hfov": 19.8
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF, this.camera_237C25FE_2D98_FBD6_41B4_C0F62962C00B); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_22111A6F_286F_D978_41B2_E2B93685477A_0_HS_5_0.png",
      "width": 286,
      "class": "ImageResourceLevel",
      "height": 205
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -16.05,
   "yaw": 111.92,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "hfov": 19.8
  }
 ],
 "id": "overlay_391C7DCB_28BE_5BB8_41BB_519D85CE6795"
},
{
 "rollOverDisplay": false,
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "Arrow 06c"
 },
 "maps": [
  {
   "yaw": 114.43,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_222841AB_286F_ABF8_41B3_5117F7A87751_0_HS_0_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -12.67,
   "hfov": 25
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_3AB4EFCE_28B6_57BB_4177_AE11A34CC755",
   "yaw": 114.43,
   "pitch": -12.67,
   "distance": 100,
   "hfov": 25
  }
 ],
 "id": "overlay_399DC7E6_28B2_D76B_41C2_DEC223527A5E"
},
{
 "rollOverDisplay": true,
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "       PH\u00d2NG\u000dH\u00d3A TRUNG T\u00c2M"
 },
 "maps": [
  {
   "yaw": 120.21,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_222841AB_286F_ABF8_41B3_5117F7A87751_0_HS_1_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -9.28,
   "hfov": 51.07
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_22111A6F_286F_D978_41B2_E2B93685477A, this.camera_237A460A_2D98_F83E_41C3_348D29D192E9); this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_222841AB_286F_ABF8_41B3_5117F7A87751_0_HS_1_0.png",
      "width": 575,
      "class": "ImageResourceLevel",
      "height": 279
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -9.28,
   "yaw": 120.21,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "hfov": 51.07
  }
 ],
 "id": "overlay_39C03906_28B6_58AB_4194_AA307EE70688"
},
{
 "rollOverDisplay": false,
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "Arrow 06c"
 },
 "maps": [
  {
   "yaw": -46.98,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_22541986_286F_DBA8_418E_8F601C84156B_0_HS_0_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -6.4,
   "hfov": 30.21
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_3876BAC1_286E_59A9_4193_0B6251160299",
   "yaw": -46.98,
   "pitch": -6.4,
   "distance": 100,
   "hfov": 30.21
  }
 ],
 "id": "overlay_382A2772_2871_B76B_4192_087FBB5A9A62"
},
{
 "rollOverDisplay": true,
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "         PH\u00d2NG \u000dH\u00d3A TRUNG T\u00c2M"
 },
 "maps": [
  {
   "yaw": -48.11,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_22541986_286F_DBA8_418E_8F601C84156B_0_HS_1_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -1.37,
   "hfov": 44.7
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_22111A6F_286F_D978_41B2_E2B93685477A, this.camera_3DBC158B_2D98_F83E_41B3_542A25523158); this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_22541986_286F_DBA8_418E_8F601C84156B_0_HS_1_0.png",
      "width": 496,
      "class": "ImageResourceLevel",
      "height": 270
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -1.37,
   "yaw": -48.11,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "hfov": 44.7
  }
 ],
 "id": "overlay_39684DDB_2871_DB59_4174_02031D41788E"
},
{
 "rollOverDisplay": false,
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "Circle Point 01"
 },
 "maps": [
  {
   "yaw": -64.69,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_222CA225_286F_A8E9_41B4_67FF3D19BBBA_0_HS_0_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -9.64,
   "hfov": 21.29
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_39464EFF_289E_7958_41B4_179B355413E2",
   "yaw": -64.69,
   "pitch": -9.64,
   "distance": 100,
   "hfov": 21.29
  }
 ],
 "id": "overlay_3ABAC8B8_2892_59E7_41AE_BF0BF275F076"
},
{
 "rollOverDisplay": true,
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "           PH\u00d2NG\u000dTHI\u1ebeT B\u1eca SINH NHI\u1ec6T"
 },
 "maps": [
  {
   "yaw": -62.81,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_222CA225_286F_A8E9_41B4_67FF3D19BBBA_0_HS_1_0_map.gif",
      "width": 30,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -5.88,
   "hfov": 40.73
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10, this.camera_234CE5D5_2D98_F82A_41BA_B04CD860FF64); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_222CA225_286F_A8E9_41B4_67FF3D19BBBA_0_HS_1_0.png",
      "width": 568,
      "class": "ImageResourceLevel",
      "height": 300
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -5.88,
   "yaw": -62.81,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "hfov": 40.73
  }
 ],
 "id": "overlay_3A6EB111_2892_E8A9_4131_095504BDCBFC"
},
{
 "paddingBottom": 10,
 "borderRadius": 5,
 "class": "ThumbnailList",
 "left": "0%",
 "id": "ThumbnailList_3BC9B660_2892_6968_41AD_9EAAE90385F5",
 "itemThumbnailScaleMode": "fit_outside",
 "width": "100%",
 "verticalAlign": "top",
 "itemPaddingLeft": 3,
 "itemThumbnailWidth": 75,
 "itemPaddingTop": 3,
 "itemBackgroundColor": [],
 "itemPaddingRight": 3,
 "itemLabelPosition": "bottom",
 "rollOverItemThumbnailShadow": false,
 "height": "100%",
 "borderSize": 0,
 "scrollBarWidth": 9,
 "scrollBarOpacity": 0.46,
 "itemThumbnailShadow": false,
 "scrollBarVisible": "rollOver",
 "itemLabelFontColor": "#003366",
 "itemThumbnailOpacity": 1,
 "rollOverItemLabelFontWeight": "normal",
 "itemLabelGap": 5,
 "paddingLeft": 20,
 "itemOpacity": 1,
 "itemBackgroundColorRatios": [],
 "playList": "this.ThumbnailList_3BC9B660_2892_6968_41AD_9EAAE90385F5_playlist",
 "layout": "vertical",
 "itemBackgroundColorDirection": "vertical",
 "itemLabelFontWeight": "normal",
 "itemHorizontalAlign": "center",
 "paddingRight": 20,
 "itemMode": "normal",
 "itemThumbnailHeight": 75,
 "itemThumbnailBorderRadius": 26,
 "selectedItemLabelFontWeight": "bold",
 "scrollBarMargin": 2,
 "itemBackgroundOpacity": 0,
 "bottom": "0%",
 "minHeight": 1,
 "itemLabelFontSize": "16px",
 "paddingTop": 10,
 "backgroundOpacity": 0,
 "itemPaddingBottom": 3,
 "itemLabelTextDecoration": "none",
 "shadow": false,
 "minWidth": 1,
 "itemLabelFontFamily": "Arial",
 "itemLabelFontStyle": "normal",
 "scrollBarColor": "#FFFFFF",
 "itemBorderRadius": 0,
 "data": {
  "name": "ThumbnailList1355"
 },
 "horizontalAlign": "left",
 "propagateClick": false,
 "itemLabelHorizontalAlign": "center",
 "gap": 10,
 "itemVerticalAlign": "middle"
},
{
 "layout": "vertical",
 "paddingBottom": 0,
 "borderRadius": 0,
 "left": "15%",
 "contentOpaque": false,
 "class": "Container",
 "right": "15%",
 "paddingRight": 0,
 "shadowColor": "#000000",
 "id": "Container_3DB37C32_28BF_B8EB_41C3_096C81807F2E",
 "children": [
  "this.Container_3DB30C32_28BF_B8EB_41C2_8A3B721FA088"
 ],
 "verticalAlign": "top",
 "scrollBarMargin": 2,
 "top": "7%",
 "backgroundColorDirection": "vertical",
 "bottom": "7%",
 "minHeight": 1,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "scrollBarWidth": 10,
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "shadowHorizontalLength": 0,
 "scrollBarVisible": "rollOver",
 "shadowSpread": 1,
 "shadow": true,
 "minWidth": 1,
 "shadowVerticalLength": 0,
 "overflow": "visible",
 "scrollBarColor": "#000000",
 "shadowBlurRadius": 25,
 "paddingLeft": 0,
 "data": {
  "name": "Global"
 },
 "horizontalAlign": "center",
 "propagateClick": false,
 "shadowOpacity": 0.3,
 "gap": 10
},
{
 "levels": [
  {
   "url": "media/panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10_0_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_3979DEFF_289E_7958_41B6_D734CC98D9D2",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_222A7DDD_286E_5B59_416F_B70EADEE1F10_0_HS_2_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 1800
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_39799EFF_289E_7958_418B_BEC04659EDD9",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF_0_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_39792EFE_289E_7958_41B9_1DF1F7529E9F",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_222DE927_286F_B8E8_41A7_C50C8CB5AACF_0_HS_2_0.png",
   "width": 520,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_3979EEFF_289E_7958_41AC_EF6E47989A86",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_22111A6F_286F_D978_41B2_E2B93685477A_0_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_27367071_287E_6969_41C2_B2EFEB0455C3",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_22111A6F_286F_D978_41B2_E2B93685477A_0_HS_2_0.png",
   "width": 520,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_39372F9F_2892_77D8_41C1_D740E08F13C7",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_22111A6F_286F_D978_41B2_E2B93685477A_0_HS_4_0.png",
   "width": 520,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_3978DEFE_289E_7958_41B3_C7C0E9C69270",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_222841AB_286F_ABF8_41B3_5117F7A87751_0_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_3AB4EFCE_28B6_57BB_4177_AE11A34CC755",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_22541986_286F_DBA8_418E_8F601C84156B_0_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_3876BAC1_286E_59A9_4193_0B6251160299",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_222CA225_286F_A8E9_41B4_67FF3D19BBBA_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 1800
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_39464EFF_289E_7958_41B4_179B355413E2",
 "colCount": 4
},
{
 "layout": "absolute",
 "paddingBottom": 0,
 "borderRadius": 0,
 "class": "Container",
 "contentOpaque": false,
 "id": "Container_3DB30C32_28BF_B8EB_41C2_8A3B721FA088",
 "paddingRight": 0,
 "children": [
  "this.ViewerAreaLabeled_3DB31C32_28BF_B8EB_41BF_671257555253",
  "this.IconButton_3DB32C32_28BF_B8EB_4191_646D39129F1D",
  "this.IconButton_3DB3CC32_28BF_B8EB_41A5_3A84824E4C1A",
  "this.IconButton_3DB3DC32_28BF_B8EB_41A1_0FFAED56EF84"
 ],
 "verticalAlign": "top",
 "scrollBarMargin": 2,
 "backgroundColorDirection": "vertical",
 "minHeight": 1,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "scrollBarWidth": 10,
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0.3,
 "backgroundColorRatios": [
  0,
  1
 ],
 "height": "100%",
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "minWidth": 1,
 "paddingLeft": 0,
 "overflow": "visible",
 "scrollBarColor": "#000000",
 "width": "100%",
 "horizontalAlign": "left",
 "propagateClick": false,
 "gap": 10,
 "data": {
  "name": "Container photo"
 }
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "class": "IconButton",
 "rollOverIconURL": "skin/IconButton_3DB3DC32_28BF_B8EB_41A1_0FFAED56EF84_rollover.jpg",
 "right": 20,
 "paddingRight": 0,
 "maxHeight": 60,
 "maxWidth": 60,
 "id": "IconButton_3DB3DC32_28BF_B8EB_41A1_0FFAED56EF84",
 "verticalAlign": "top",
 "top": 20,
 "minHeight": 50,
 "width": "10%",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "mode": "push",
 "height": "10%",
 "pressedIconURL": "skin/IconButton_3DB3DC32_28BF_B8EB_41A1_0FFAED56EF84_pressed.jpg",
 "shadow": false,
 "minWidth": 50,
 "click": "this.setComponentVisibility(this.Container_3DB3EC32_28BF_B8EB_41A7_DEE0CF502248, false, 0, null, null, false)",
 "paddingLeft": 0,
 "data": {
  "name": "IconButton X"
 },
 "horizontalAlign": "right",
 "propagateClick": false,
 "transparencyActive": false,
 "iconURL": "skin/IconButton_3DB3DC32_28BF_B8EB_41A1_0FFAED56EF84.jpg",
 "cursor": "hand"
}],
 "verticalAlign": "top",
 "start": "this.init(); this.syncPlaylists([this.ThumbnailList_3BC9B660_2892_6968_41AD_9EAAE90385F5_playlist,this.mainPlayList]); if(!this.get('fullscreenAvailable')) { [this.IconButton_3C68243B_2892_68D9_41C0_E73FA55EB768].forEach(function(component) { component.set('visible', false); }) }",
 "scrollBarMargin": 2,
 "minHeight": 20,
 "scrollBarWidth": 10,
 "mobileMipmappingEnabled": false,
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "minWidth": 20,
 "vrPolyfillScale": 0.5,
 "height": "100%",
 "buttonToggleFullscreen": "this.IconButton_3C68243B_2892_68D9_41C0_E73FA55EB768",
 "paddingLeft": 0,
 "downloadEnabled": false,
 "overflow": "visible",
 "scrollBarColor": "#000000",
 "width": "100%",
 "horizontalAlign": "left",
 "propagateClick": false,
 "mouseWheelEnabled": true,
 "gap": 10,
 "data": {
  "name": "Player485"
 }
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();

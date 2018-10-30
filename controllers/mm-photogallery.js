/* Muhammad Miftah s2757691
 * associated view: mm-photo-gallery.html
 */

var module_dependencies = [
    'facebook'
];

/* photogalleryScreenCtrlFn: the controller function for the photogallery
 * methods are declared using this.name, but usually invoked using self.name()
 */
function photogalleryScreenCtrlFn($scope, $notify, $timeout, $dmsTravelDataSvc, Facebook) {
    var self = this;

    this.thubmnailSize = { x: 320, y: 320 };

    this.albumCount = $dmsTravelDataSvc.getPhotoAlbumCount(); // this gets set again [fbPhotoAlbums: downloaded] fires
    this.albums = $dmsTravelDataSvc.fbPhotoAlbums;            // same as this.albumCount

    this.fbPage = $dmsTravelDataSvc.getFbPage();              // updated via a $watch expression
    this.pageDescription = this.fbPage.description || "To view photos, please login to Facebook";

    // these are all held separately, but are mostly updated at the same time
    this.currentAlbum = {};
    this.currentAlbumId = "";
    this.currentAlbumPhotos = [];
    this.currentPhoto = {};

    this.currentAlbumPhotoLikes = {};           // held separately but updated alongside the above 4 vars

    this.$dmsTravelDataSvc = $dmsTravelDataSvc; // allow access to this from the view

    this.searchText = "";                       // bound to view control, #mm-search-box in mm-photo-gallery.html
    this.searchResults = [];                    // replace this.currentAlbumPhotos when seaching

    this.sortToggle;                            // switch between sorting descending and ascending

    /* List of messsages this controller dispatches
     * [photogalleryScreenCtrl.unlikedPhoto]
     * [photogalleryScreenCtrl.likedPhoto]
     */

    /* setup notification listeners and $scope $watches */
    (function() {
        // watch for when getFbPage() actually returns a fbPage object; it returns a string if it hasnt been downloaded
        $scope.$watch(function() { return self.fbPage; }, function(newVal, oldVal) {
            if (typeof newVal === "undefined") {
                // console.log("photogalleryScreenCtrl self.fbPage changed");
                // console.log(newVal);
                self.fbPage = $dmsTravelDataSvc.getFbPage();
                self.pageDescription = self.fbPage.description;
            }
        });

        // watch for currentAlbum changes; when switching to another routes (and thus controller), any controller variables set via $scope or this.* goes blank. this will reset it to the default one (the first one downloaded) when switching back.
        $scope.$watch(function() { self.currentAlbum; }, function(newVal, oldVal) {
            // console.log("newVal: ");
            // console.log(newVal);
            // console.log("oldVal: ");
            // console.log(oldVal);

            // also, this will only fire off after all albumPhotos have been downloaded
            if (typeof newVal === "undefined" && $dmsTravelDataSvc.fbAllAlbumPhotosDownloaded) {
                console.log("photogalleryScreenCtrl self.currentAlbum changed");
                // console.log(self.albums);
                var albumId = self.albums[0].id;
                self.setCurrentAlbum(albumId)
            }
        });

        // listen for fbPhotoAlbums: downloaded message, and update view
        $notify.listen("fbPhotoAlbums: downloaded", function() {
            self.albumCount = $dmsTravelDataSvc.getPhotoAlbumCount();
            self.albums = $dmsTravelDataSvc.getPhotoAlbums();
            // console.log(self.albums);
        });

        // listen when all photo album photos have downloaded and then set default album; this sets the default album view on startup
        $notify.listen("fbAlbumPhotos: all downloaded", function() {
            // specify the first album downloaded
            var albumId = self.albums[0].id;
            self.setCurrentAlbum(albumId)

            // console.log("self.currentAlbum set to: " + self.currentAlbum.name);
            // console.log(self.currentAlbum);
        });

        $notify.listen("photogalleryScreenCtrl.unlikedPhoto", function() {
            self.updateCurrentAlbumPhotoLikes();
        });

        $notify.listen("photogalleryScreenCtrl.likedPhoto", function() {
            self.updateCurrentAlbumPhotoLikes();
        });
    })();

    /* setCurrentAlbum(): sets the view to display photos from the specified album (by albumID)
     * uses $dmsTravelDataSvc
     */ 
    this.setCurrentAlbum = function(albumId) {
        self.currentAlbum = $dmsTravelDataSvc.getPhotoAlbumForId(albumId);
        self.currentAlbumPhotos = $dmsTravelDataSvc.getAlbumPhotosForId(albumId);
        // self.currentAlbumPhotos.reverse();
        self.currentAlbumId = albumId;
        self.updateCurrentAlbumPhotoLikes();
        // console.log(self.currentAlbum);
        // console.log(albumId);

        // console.log("photogalleryScreenCtrl.setCurrentAlbum()");
        // console.log(self.currentAlbumPhotos);

        // console.log("photogalleryScreenCtrl.getThumbnailImage()");
        // console.log(self.getThumbnailImage(self.currentAlbumPhotos[0].id));
    };

    /* setCurrentPhoto(): sets the view to display the current photo
     * uses $dmsTravelDataSvc; unused
     */
    this.setCurrentPhoto = function(photoId) {
        self.currentPhoto = $dmsTravelDataSvc.getPhotoForId(photoId);
        console.log("photogalleryScreenCtrl.setCurrentPhoto()");
        console.log(self.currentPhoto);
    };

    /* getThumbnailImage(): gets the thumbnail version of the photo
     * min width 320
     */
    this.getThumbnailImage = function(photoId) {
        var thumbnail = {};
        
        var photo = (typeof photoId === 'string') ? $dmsTravelDataSvc.getPhotoForId(photoId) : photo = photoId;

        // console.log(photo);

        for (var i = 0; i < photo.images.length; i++) {
            var img = photo.images[i];
            // console.log(img);
            var twentyfive_percent_larger_x = (self.thubmnailSize.x * 1.25);
            var twentyfive_percent_larger_y = (self.thubmnailSize.y * 1.25);
            var twentyfive_percent_smaller_x = (self.thubmnailSize.x * 0.75);
            var twentyfive_percent_smaller_y = (self.thubmnailSize.y * 0.75);

            if ((img.width == self.thubmnailSize.x ||  img.height == self.thubmnailSize.y) ||
                (img.width < twentyfive_percent_larger_x && img.height < twentyfive_percent_larger_y) ||
                (img.width < twentyfive_percent_smaller_x && img.height < twentyfive_percent_smaller_x) ) 
            {
                thumbnail = img;
                // console.log("photogalleryScreenCtrl.getThumbnailImage() found!");
                // console.log(img);
                i = photo.images.length;
            }
        }

        return thumbnail;
    };

    /* updateCurrentAlbumPhotoLikes(): gets photo like data for current album of photos
     * invoke after calling setCurrentAlbum
     */
    this.updateCurrentAlbumPhotoLikes = function() {        
        console.log("photogalleryScreenCtrl.updateCurrentAlbumPhotoLikes() invoked");
        // now get current album photo likes and populate self.currentAlbumPhotoLikes
        jQuery.each(self.currentAlbumPhotos, function(i, photo) {
            // console.log(photo);
            Facebook.api(""+photo.id+"/likes", function(response) {
                if (response && !response.error) {
                    // console.log(response);
                    // add this to the currentAlbumPhotoLikes object
                    self.currentAlbumPhotoLikes[photo.id] = response.data;
                }
            });
        });

        // console.log(self.currentAlbumPhotoLikes);
    };

    /* getPhotoLikes(): gets the info pertaining to likes for the current photo
     * returns json object
     */
    this.getPhotoLikes = function(photoId) {
        var photo = (typeof photoId === 'string') ? $dmsTravelDataSvc.getPhotoForId(photoId) : photoId;

        // console.log(photo);

        return photo.likes.data;
    };

    /* getFormattedPhotoLikes(): same as getphotoLikes(), but for html view output
     * returns html
     */
    this.getFormattedPhotoLikes = function(photoId) {
        var photoLikes = self.getPhotoLikes(photoId);

        console.log(photoLikes);
    };

    /* likePhoto(): likes a photo using Facebook API
     * 
     */
    this.likePhoto = function(photoId) {
        var likes = self.currentAlbumPhotoLikes[photoId];
        // if ($dmsTravelDataSvc.fbUser.id == )
        // console.log(likes);
        // console.log($dmsTravelDataSvc.fbUser);

        var alreadyLiked = false;
        for (var l = 0; l < likes.length; l++) {
            if ($dmsTravelDataSvc.fbUser.id === likes[l].id) {
                console.log("already liked " + photoId);
                l = likes.length;
                alreadyLiked = true;
            }
        }

        if (alreadyLiked) {
            var unlike = confirm("You already like that! Do you want to unlike?");
            if (unlike) {
                Facebook.api(photoId+"/likes",'DELETE', function(response) {
                    console.log("photogalleryScreenCtrl.unlikedPhoto id: "+ photoId +": ");
                    console.log(response);

                    if (response && !response.error) {
                        $notify.dispatch('photogalleryScreenCtrl.unlikedPhoto');
                    }
                });
            }
            // quit here
            return;
        } 

        Facebook.api(""+photoId+"/likes",'POST', function(response) {
            console.log("photogalleryScreenCtrl.likePhoto id: "+ photoId +": ");
            console.log(response);
            if (response.success === true || response === true) {
                console.log("successfully liked");

                $notify.dispatch('photogalleryScreenCtrl.likedPhoto');
            } else {
                console.log("not liked; possible error; see next console log");
                console.log(response);

            }
        });
    };

    /* sortCurrentAlbum(): sorts the current album's photos by likes
     * will toggle between ascending and descending
     */
    this.sortCurrentAlbum = function(album) {
        self.sortToggle = !self.sortToggle;
        // console.log("sortCurrentAlbum(): ");
        // console.log(album);

        self.currentAlbumPhotos.sort(function(a, b) {
            return self.sortToggle ? (b.likes.data.length - a.likes.data.length) : (a.likes.data.length - b.likes.data.length);
        });

        if (self.searchResults) {
            self.searchResults.sort(function(a, b) {
                return self.sortToggle ? (b.likes.data.length - a.likes.data.length) : (a.likes.data.length - b.likes.data.length);
            });
        }
    };

    /* searches the current album photos array and creates a new array based on those search results
    * updates the view to display those search results by replacing the reference on self.currentAlbumPhotos
    */ 
    this.searchCurrentAlbumPhotos = function($event) {
        if (self.searchResults || self.currentAlbumPhotos) (self.searchResults || self.currentAlbumPhotos).pop();
        
        if (!self.searchResults && !self.currentAlbumPhotos) self.setCurrentAlbum(self.currentAlbumId);

        // respond only to enter or a mouse pointer target click
        if ($event.which == 13 || $event.which == 1 || $event.isTrigger > 0) {
            if (self.searchText.length == 0 || self.searchText === '') {
                console.log("currentAlbumId: " + self.currentAlbumId);
                self.setCurrentAlbum(self.currentAlbumId); 
                return;
            }

            for (var i = 0; i < self.currentAlbumPhotos.length; i++) {
                var photo = self.currentAlbumPhotos[i];
                var photoName = ((photo.hasOwnProperty('name')) ? photo.name : "No name").toLowerCase();
                console.log(photoName);
                console.log(self.searchText);
                
                // if searchText not found, then remove it from the array
                if (photoName.indexOf(self.searchText, 0) !== -1) {
                    self.searchResults.push(photo);
                    console.log(self.searchResults);
                }
            }

            self.currentAlbumPhotos = self.searchResults;
        }
    };
}

var splash_mod = angular.module("s2757691_2622ict_assignment_gallery", module_dependencies)
    .controller('photogalleryScreenCtrl', ['$scope','$notify','$timeout','$dmsTravelDataSvc','Facebook', photogalleryScreenCtrlFn]);
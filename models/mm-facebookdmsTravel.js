/* Muhammad Miftah s2757691
 * handles most of the data retrieval functions for the app
 */

var dependencies = [
    'facebook',
    's2757691_2622ict_assignment_notifications'
];

/* dmsTravelDataSvc: handles grabbing all the data from facebook that is related to the DMS Travel facebook page
 * unlike controllers, a services self.* variables retain their references when switching routes
 * some methods may be unused, but are retained to ensure no breaking
 */
function dmsTravelDataSvc($http, Facebook, $notify) {
    var $dmsTravelDataSvc = {};         // the service to be returned

    var self = $dmsTravelDataSvc;       // shorthand reference

    self.fbPageID = "815157038515764";  // the DMS travel facebook page id
    self.fbPage = {};                   // the DMS travel facebook page data
    self.fbUser = {};                   // this is it's own reference of fbUser, passed to this ctrlr by facebookLoginCtrl
    self.fbPhotoAlbums = [];            // array to store photo albums associated with the page
    self.fbAlbumPhotos = {};            // object to store photos information from albums
    self.fbAlbumPhotosArray = [];       // array to store photos information from albums, a second copy of fbAlbumPhotos

    self.totalPhotoCount = 0;           // total number of photos for all the albums
    self.downloadedPhotoCount = 0;      // used to trigger event when all photo albums are dl'd

    self.fbAllAlbumPhotosDownloaded = false;

    /* List of $notify messages that this service will dispatch()
     * [fbPage: downloaded]
     * [fbPhotoAlbums: downloaded]
     * [fbAlbumPhotos: all downloaded]
     */

    /* setup notification listeners */
    // listen when fbUser object has downlaoded (after user has logged into their facebook profile). need this to request access tokens
    $notify.listen("fbUser: downloaded", function(fbUserObj) {
        self.fbUser = fbUserObj;        // store our own reference
        self.performGetFbPageObj();     // now we can get access tokens download the fb page info
    });

    // listen when fbPage: downloaded
    $notify.listen("fbPage: downloaded", function() {
        self.performGetPhotoAlbums();
    });

    // listen when fbPhotoAlbums: downloaded and create new objects for each album
    $notify.listen("fbPhotoAlbums: downloaded", function(fbPhotoAlbumsArray) {
        // calculate self.totalPhotoCount and download photos

        jQuery.each(fbPhotoAlbumsArray, function(i, album) {
            self.totalPhotoCount += album.count;
            self.performGetAlbumPhotos(self.fbPhotoAlbums[i].id);
        });

        // console.log('Total photo count: ' +self.totalPhotoCount);
    });

    // testing
    $notify.listen("fbAlbumPhotos: all downloaded", function() {
        // console.log('album id: '+819310544767080);
        // console.log('searching for album...');
        // console.log(self.getPhotoAlbumForId(819310544767080));
        // console.log('searching for album photos...');
        // console.log(self.getAlbumPhotosForId(819310544767080));
    });

    /* performGetFbPageObj: invokes the Facebook API to retrieve info about DMS's Travel Facebook page
     * invoked when fbLoggedIn = true (inside $N listener);
     */
    self.performGetFbPageObj = function() {
        Facebook.api(self.fbPageID, function(response) {
            // console.log("dmsTravelDataSvc.performGetFbPageObj()");
            // console.log(response);
            if (response && !response.error) {  
                self.fbPage = response;
                $notify.dispatch("fbPage: downloaded", response);
            } else { }
        });
    };

    /* performGetPhotoAlbums: download photo album data
     * and store the response data inside self.fbPhotoAlbums
     */
    self.performGetPhotoAlbums = function() {
        Facebook.api(self.fbPageID+"/albums", function(response) {
            // console.log("dmsTravelDataSvc.performGetPhotoAlbums()");
            // console.log(response); 
            if (response && !response.error) { 
                self.fbPhotoAlbums = response.data;
                $notify.dispatch("fbPhotoAlbums: downloaded", response.data);
            } else { }
        });
    };

    /* performGetAlbumPhotos: get photos inside albums
     * returns arrays and appends them to the self.fbAlbumPhotos object
     */
    self.performGetAlbumPhotos = function(albumId) {
        Facebook.api(albumId+"/photos", function(response) {
            // console.log("dmsTravelDataSvc.performGetAlbumPhotos(): "+ albumId);
            if (response && !response.error) {
                self.fbAlbumPhotos[albumId] = response;
                self.fbAlbumPhotosArray.push(response);
                // increment the downloadedPhotoCount
                self.downloadedPhotoCount += response.data.length;
                // console.log('downloadedPhotoCount: ' + self.downloadedPhotoCount);
                // console.log(self.fbAlbumPhotos);
                // console.log(response);
                $notify.dispatch("fbAlbumPhotos "+ albumId +": downloaded", response);

                // once downlaodedPhotoCount has reached totalPhotoCount (calculated before performGetAlbumPhotos()),
                // dispatch message
                if (self.downloadedPhotoCount == self.totalPhotoCount) {
                    $notify.dispatch("fbAlbumPhotos: all downloaded");  
                    self.fbAllAlbumPhotosDownloaded = true;
                }
            } else { }
        });
    };

    /* getPhotoAlbums: returns all photo albums (json object array)
     * 
     */
    self.getPhotoAlbums = function() {
        return self.fbPhotoAlbums;
    };

    /* getAlbumPhotos: gets photos for an album id
     * returns the array for the album id;
     */
    self.getAlbumPhotosForId = function(albumId) {
        // console.log(self.fbAlbumPhotos);

        return (self.fbAlbumPhotos.hasOwnProperty(albumId)) ? self.fbAlbumPhotos[albumId].data : console.error("album ["+albumId+"] has not been downloaded yet");
        // return (albumById.hasOwnProperty('id')) ? albumById.data : console.error("album ["+albumId+"] has not been downloaded yet");
    };

    /* getPhotoAlbum: get the json object for the album id
     * returns the json object
     */
    self.getPhotoAlbumForId = function(albumId) {
        if (self.getPhotoAlbumCount() == 0) {
            console.error("photos albums have not been downloaded yet");
            return { error: "photos albums have not been downloaded yet"};
        }

        var album = {};
        for (var i = 0; i < self.getPhotoAlbumCount(); i++) {
            // console.log(self.fbPhotoAlbums[i]);
            if (self.fbPhotoAlbums[i].id == ""+albumId) {
                album = self.fbPhotoAlbums[i];
            }
        }

        return album;
    };

    /* searches all downloaded photo albums for an image by id
     * returns photo object
     */
    self.getPhotoForId = function(photoId) {
        var returnedPhoto = {};

        // console.log("$dmsTravelDataSvc.getPhotoForId()");
        // console.log(self.fbPhotoAlbums);

        if (arguments[1] === true) { // download new id data
            Facebook.api("/"+photoId, function(response) {
                if (response && !response.error) {
                    // console.log("$dmsTravelDataSvc.getPhotoForId: downloaded fresh data");
                    // console.log(response);

                    returnedPhoto = response;
                }
            });
        } else {
            for (var i = 0; i < self.fbAlbumPhotosArray.length; i++) {
                var album = self.fbAlbumPhotosArray[i];
                
                for (var j = 0; j < album.data.length; j++) {
                    var photo = album.data[j];
                    // console.log(photo);

                    if (photo.id == new String(photoId)) {
                        // console.log("$dmsTravelDataSvc.getPhotoForId() found photo!");
                        returnedPhoto = photo;
                        // console.log(returnedPhoto);
                        j = album.data.length;
                        i = self.fbAlbumPhotosArray.length;
                    }
                }
            }
        }

        return returnedPhoto;
    };

    /* getPhotoAlbumCount: self explanatory!
     * returns an int
     */
    self.getPhotoAlbumCount = function() {
        return (self.fbPhotoAlbums.length);
    };

    /* getFbPage: returns the fbPage object
     * returns string if fbPage has not downlaoded yet
     */
    self.getFbPage = function() {
        return (self.fbPage.hasOwnProperty('id')) ? self.fbPage : "fbPage not yet downloaded"; 
    };

    return $dmsTravelDataSvc;
}

angular.module("s2757691_2622ict_assignment_dmsTravel", dependencies)
.factory('$dmsTravelDataSvc', dmsTravelDataSvc);
let functions = require("firebase-functions");
let admin = require("firebase-admin");
let cors = require("cors")({origin: true});
let serviceAccount = require("./test-project-3d277-firebase-adminsdk-qfyec-c4d76e91e5.json");
let axios = require('axios');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

//replace everything in the {} for the formats

//register an account on the DB
exports.registerAccount = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    //get variables
    const ID = req.body.data.id;
    const name = req.body.data.username;
    const email = req.body.data.email;

    //initialise the Profile for the user - this can be anything
    db.collection("UserIDs").doc(`${name}`).set({
      id: ID,
      email: email
    }).then(
      db.collection("UserData").doc(`${ID}`).set({
        likedArtists: [],
        likedAlbums: [],
        id: ID,
        bio: "",
        username: name,
        pfpURL: "",
      })
    ).then(
      res.send({ result: "Created Account" })
    );
    
    return;
  });
});

//--OLD--
//function to login - temporary until firebase auth is set up
//successful login should be followed with a call to getProfileInfo
exports.login = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    //get variables
    //accessing the request object from vue
    const uname = req.body.data.username;
    const pswd = req.body.data.password;
    const email = req.body.data.email;

    //access the account and check the password is correct
    db.collection("Accounts").doc(uname).get().then((docsnap) => {
      if (docsnap.exists) {
        if (docsnap.data()["password"] == pswd) {
          res.send({data: { result: "login successful", bool: true , username: uname}});
          return;
        }
        else {
          res.send({ result: "incorrect username for password", bool: false});
          return;
        }
      }
      else {
        res.send({ result: "user does not exist", bool: false, username: uname});
        return ;
      }
    });
  });
});

//update any part of a profile with a provided id, field and value
//FORMAT: URL...?id={id}&field={field}&value={value}
//^ must provide a valid ID
exports.updateProfile = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    //get variables
    const id = req.body.data.id;
    const field = req.body.data.field;
    const value = req.body.data.value;
  
    let updateData = {};  //create an empty object
    updateData[field] = value;  //assign the value to a field in the object

    //get a reference to the profile
    db.collection("UserData").doc(`${id}`).update(updateData).then(() => {
      res.send({ data: {code: 0, body: `Updated data regarding ${field} with ${value}` }});
    });
  });
});

//function dedicated to receiving an ID of a given email
exports.getEmail = functions.https.onRequest((req, res) => {
  cors(req, res, () => {    
    //access the document relating to the given email to get the uid
    db.collection("UserIDs").doc(req.body.data.username).get().then((docSnap) => {
      if (docSnap.exists) {
        res.send({data: {code: 0, body: docSnap.data()["email"]}});
        return;
      }
      else {
        res.send({data: {code: 1, body: `Failed to find user ${req.body.data.username}`}});
        return;
      }
    });
  });
});

//finds if the submitted username is already in the database
exports.checkUniqueUsername = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const username = req.body.data.username;
    
    //try and find the user document
    db.collection("UserIDs").doc(`${username}`).get().then((docSnap) => {
      if(docSnap.exists){
        res.send({data: {isTaken: true, message: "Username Taken"}});
        return;
      }
      else{
        res.send({data: {isTaken: false, message: "Username Available"}})
      }
    });
  });
});

//function to provide all the profile info, or just one field, based on the input
//FORMAT: URL...?id={id}&field={field}
//for all info the field parameter should be left out
exports.getProfileInfo = functions.https.onRequest( (req, res) => {
  cors(req, res, () => {
    //get the variables
    const id = req.body.data.id;
    const field = req.body.data.field;
  
    //access the appropriate document in the profiles collection
    db.collection("UserData").doc(`${id}`).get().then((docSnap) => {
      if (docSnap.exists) {
        //return the entire profile if the field is null, otherwise return the desired field
        if(field == null){
          res.send({data: docSnap.data()});
        }
        else{
          const data = docSnap.data()[field];
          if(data == null){
            res.send({data: "Unknown Field"});
          }
          else{
            res.send({data: data});
          }
        }
      }
    });
  });
});

/*
--SPOTIFY API FUNCTIONS--
*/

//gets a new token
//the token will be in the response.data.access_token json header
exports.getSpotifyToken = functions.https.onRequest( (req, res) => {
  cors(req, res, () => {
    //client secret and id provided by spotify api
    const clientId = "2165473919fe4b0891ac4becaa5866ee";
    const clientSecret = "b78f201d7bc747a2ba335c1d694d27ce";
  
    //headers for POST request
    let _headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
    };
  
    //options for POST request
    let options = {
      method: 'POST',
      url: 'https://accounts.spotify.com/api/token',
      data: 'grant_type=client_credentials',
      headers: _headers,
    };
    
    //make the request and return the result
    //reqPromise is the 'request-promise' node package (used instead of fetch)
    axios(options).then((result) => {
      //firebase requires the response to be sent under the data header
      res.send({data: result.data});
    }).catch((error) => {
      res.send({data: error.data});
    });
  });
});

//searches spotify for artists
//send request as {token: token, term: searchTerm, limit: limit}
exports.searchArtist = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    //get the variables
    const token = req.body.data.token;
    const term = req.body.data.term;
    const limit = req.body.data.limit;

    let options = {
      method: 'GET',
      url: `https://api.spotify.com/v1/search?q=${term}&type=artist&limit=${limit}`,
      headers: {'Authorization': `Bearer ${token}`},
    };

    //make the request
    axios(options).then((result) => {
      res.send({data: result.data});
    }).catch((error) => {
      res.send({data: error.data});
    });
  });
});

// get related artists
//send request as {token: token, id: artistId}
exports.getRelatedArtists = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    // get the variables
    const token = req.body.data.token;
    const id = req.body.data.id;

    // specify the options
    let options = {
      method: 'GET',
      url: `https://api.spotify.com/v1/artists/${id}/related-artists`,
      headers: { 'Authorization': `Bearer ${token}` },
    };

    // make the request
    axios(options).then((result) => {
      res.send({ data: result.data });
    }).catch((error) => {
      res.send({ data: error.data });
    });
  });
});

//returns a list of unrelated artists to the data given
exports.getUnrelatedArtists = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    //get the variables
    const token = req.body.data.token;
    const limit = req.body.data.limit;
    const genres = req.body.data.genres;  //should be an array
    const backupGenre = req.body.data.backup; //the last successful genre
    console.log(backupGenre);

    //genres sorted by their similarity to each other
    //Thanks to ChatGPT for this
    const similarGenres = [
      "electronic", "edm", "electro", "minimal-techno", "techno", "trance",
      "house", "deep-house", "progressive-house",
      "hip-hop", "r&b",
      "pop", "power-pop", "pop-film", "indie-pop",
      "dance", "club", "dancehall", "disco", "dub", "dubstep", "funk", "groove", "hardcore", "hardstyle", "house", "j-dance", "j-idol", "j-pop", "j-rock", "k-pop", "party", "road-trip",
      "rock", "alt-rock", "punk-rock", "grunge", "psych-rock", "post-dubstep",
      "metal", "heavy-metal", "black-metal", "metal-misc", "metalcore", "grindcore",
      "jazz", "blues",
      "alternative", "cantopop", "british", "indie",
      "folk", "country", "bluegrass",
      "forro", "gospel", "honky-tonk", "pagode",
      "latin", "salsa", "samba", "reggae", "reggaeton",
      "world-music", "african", "afrobeat", "brazilian", "french", "german", "indian", "iranian", "malay", "spanish", "swedish", "tango", "turkish",
      "ambient", "chill", "new-age", "rainy-day", "sleep", "study",
      "singer-songwriter", "acoustic", "guitar", "soul",
      "classical", "opera",
      "anime", "children", "filmi", "show-tunes",
    ];    

    let searchGenre = ""; //the genre search filter
    genres.forEach(genre => {
      genre = genre.toLowerCase();
      if(similarGenres.includes(genre)){
        do {
          let index = Math.floor(Math.random() * 119);
          searchGenre = similarGenres[index];
        } while(Math.abs(similarGenres.indexOf(searchGenre) - similarGenres.indexOf(genre)) < 30);  //the higher the number the more "different" the result will be but also the longer it could potentially take to find a result
        return;
      }
    });

    //avoids a case of returning an empty array
    if(searchGenre == undefined || searchGenre == ""){
      do {
        let index = Math.floor(Math.random() * 119);
        searchGenre = similarGenres[index];
      } while(Math.abs(similarGenres.indexOf(searchGenre) - similarGenres.indexOf(backupGenre)) < 40 || searchGenre == undefined);  //the higher the number the more "different" the result will be but also the longer it could potentially take to find a result
    }

    //specify request options
    let options = {
      method: 'GET',
      url: `https://api.spotify.com/v1/search?q=genre:${searchGenre}&type=artist&limit=${limit}`,
      headers: {'Authorization': `Bearer ${token}`},
    };

    axios(options).then((result) => {
      res.send({data: {genre: searchGenre, artists: result.data.artists.items}});
    }).catch((error) => {
      res.send({data: error});
    });
  });
});

// get single artist by id
// send request as {token: token, id: artistId}
exports.getArtist = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    // get the variables
    const token = req.body.data.token;
    const id = req.body.data.id;

    // specify the options
    let options = {
      method: 'GET',
      url: `https://api.spotify.com/v1/artists/${id}`,
      headers: { 'Authorization': `Bearer ${token}` }
    };

    // make the request
    axios(options).then((result) => {
      res.send({ data: result.data });
    }).catch((error) => {
      res.send({ data: error.data });
    });
  });
});

// get weezer
// send request as {token: token}
exports.getWeezer = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const token = req.body.data.token;

    let options = {
      method: 'GET',
      url: `https://api.spotify.com/v1/artists/3jOstUTkEu2JkjvRdBA5Gu`,
      headers: { 'Authorization': `Bearer ${token}`}
    };

    axios(options).then((result) => {
      res.send({ data: result.data });
    }).catch((error) => {
      res.send({ data: error.data });
    });
  });
});

// get artist's albums
// send request as {token: token, id: artistId}
exports.getAlbums = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    // get the variables
    const token = req.body.data.token;
    const id = req.body.data.id;

    // specify the options
    let options = {
      method: 'GET',
      url: `https://api.spotify.com/v1/artists/${id}/albums?include_groups=album,single&limit=50`,
      headers: { 'Authorization': `Bearer ${token}` }
    };

    // make the request
    axios(options).then((result) => {
      res.send({ data: result.data });
    }).catch((error) => {
      res.send({ data: error.data });
    });
  });
});
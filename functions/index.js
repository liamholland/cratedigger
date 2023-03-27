let functions = require("firebase-functions");
let admin = require("firebase-admin");
let cors = require("cors")({ origin: true });
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
exports.registerAccount = functions.https.onCall((data, context) => {
  //get variables
  const ID = context.auth.uid;
  const name = data.username;
  const email = data.email;

  //initialise the Profile for the user - this can be anything
  return db.collection("UserIDs").doc(`${name}`).set({
    id: ID,
    email: email
  }).then(
    db.collection("UserData").doc(`${ID}`).set({
      likedArtists: [],
      likedAlbums: [],
      suggestedArtists: [], //queue ADT used for recommendations - length configured application side
      listeners: [],
      listeningTo: [],
      listenerCount: 0,
      recommendedArtists: [], //artists recommended by people you are listening to
      id: ID,
      bio: "",
      username: name,
      pfpURL: "",
    })
  ).then(() => {
    return { result: "Created Account" };
  });
});

//update any part of a profile with a provided id, field and value
exports.updateProfile = functions.https.onCall((data, context) => {
  if (typeof context.auth !== 'undefined') {
    //get variables
    const field = data.field;
    const value = data.value;

    let updateData = {};  //create an empty object
    updateData[field] = value;  //assign the value to a field in the object

    //get a reference to the profile
    return db.collection("UserData").doc(`${context.auth.uid}`).update(updateData).then(() => {
      return { code: 0, body: `Updated data regarding ${field} with ${value}` };
    });
  }
});

//function dedicated to receiving an ID of a given email
exports.getEmail = functions.https.onCall((data, context) => {

  //access the document relating to the given email to get the uid
  return db.collection("UserIDs").doc(`${data.username}`).get().then((docSnap) => {
    if (docSnap.exists) {
      return { code: 0, body: docSnap.data()["email"] };
    }
    else {
      return { code: 1, body: `Failed to find user ${data.username}` };
    }
  });
});

//finds if the submitted username is already in the database
exports.checkUniqueUsername = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const username = req.body.data.username;

    //stop attempts at making an invalid username
    if (username === null) {
      res.send({ data: { isTaken: true, message: "Invalid Username" } });
      return;
    }

    //try and find the user document
    db.collection("UserIDs").doc(`${username}`).get().then((docSnap) => {
      if (docSnap.exists) {
        res.send({ data: { isTaken: true, message: "Username Taken" } });
        return;
      }
      else {
        res.send({ data: { isTaken: false, message: "Username Available" } })
      }
    });
  });
});

//function to provide all the profile info, or just one field, based on the input
//FORMAT: URL...?id={id}&field={field}
//for all info the field parameter should be left out
exports.getProfileInfo = functions.https.onCall((data, context) => {
  if (typeof context.auth !== 'undefined') {
    //get the variables
    const id = context.auth.uid;
    const field = data.field;

    //access the appropriate document in the profiles collection
    return db.collection("UserData").doc(`${id}`).get().then((docSnap) => {
      if (docSnap.exists) {
        //return the entire profile if the field is null, otherwise return the desired field
        if (field == null) {
          return docSnap.data();
        }
        else {
          const data = docSnap.data()[field];
          if (data == null) {
            return `Unknown Field: ${field}`;
          }
          else {
            return data;
          }
        }
      }
    });
  }
});

//function dedicated to finding a user in the database
exports.getUser = functions.https.onCall((data, context) => {

  //access the document relating to the given email to get the uid
  return db.collection("UserIDs").doc(`${data.username}`).get().then((docSnap) => {
    if (docSnap.exists) {
      const id = docSnap.data()["id"];

      return db.collection("UserData").doc(`${id}`).get().then((userDoc) => {
        if (userDoc.exists) {
          const user = userDoc.data();
          return { code: 0, userData: { id: user["id"], username: user["username"], pfp: user["pfpURL"] } };
        }
        else {
          return { code: 1, body: "Error when fetching user data" };
        }
      });
    }
    else {
      return { code: 1, body: `Failed to find user ${data.username}` };
    }
  });
});

//function for adding Listeners (friends)
exports.addListener = functions.https.onCall((data, context) => {
  //get variables
  const userID = context.auth.uid;
  const friendID = data.id;

  if (typeof context.auth !== 'undefined') {
    return db.collection("UserData").doc(`${userID}`).update({
      listeningTo: admin.firestore.FieldValue.arrayUnion(friendID)
    }).then(() => {
      return db.collection("UserData").doc(`${friendID}`).update({
        listeners: admin.firestore.FieldValue.arrayUnion(userID),
        listenerCount: admin.firestore.FieldValue.increment(1)
      }).then(() => {
        return "Updated Listeners";
      });
    });
  }
  else {
    return "Not Authorised";
  }
});

//function for adding Listeners (friends)
exports.removeListener = functions.https.onCall((data, context) => {
  //get variables
  const userID = context.auth.uid;
  const friendID = data.id;

  if (typeof context.auth !== 'undefined') {
    return db.collection("UserData").doc(`${userID}`).update({
      listeningTo: admin.firestore.FieldValue.arrayRemove(friendID)
    }).then(() => {
      return db.collection("UserData").doc(`${friendID}`).update({
        listeners: admin.firestore.FieldValue.arrayRemove(userID),
        listenerCount: admin.firestore.FieldValue.increment(-1) //decrement
      }).then(() => {
        return "Updated Listeners";
      });
    });
  }
  else {
    return "Not Authorised";
  }
});

exports.getListeningTo = functions.https.onCall((data, context) => {
  if (typeof context.auth !== 'undefined') {
    const ID = context.auth.uid;

    let friendData = [];

    return db.collection("UserData").where("listeners", "array-contains", ID).get().then((users) => {
      users.forEach((user) => {
        friendData.push({
          username: user.data()["username"],
          pfpURL: user.data()["pfpURL"],
          id: user.data()["id"]
        });
      });

      return friendData;
    });
  }
  else {
    return "Not Authorised";
  }
});

//recommend an artists to everyone who is listening to your recommendations
exports.broadcastToListeners = functions.https.onCall((data, context) => {
  if (typeof context.auth !== 'undefined') {
    const id = context.auth.uid;
    const artist = data.artist;

    return db.collection("UserData").doc(`${id}`).get().then((docSnap) => {
      docSnap.data()["listeners"].forEach((userID) => {
        let docRef = db.collection("UserData").doc(`${userID}`);

        docRef.get().then((userData) => {
          let recArts = userData.data()["recommendedArtists"];  //this is the users currents recommended artists

          //if they havent been recommended it before
          if (!(recArts.find(entry => entry.id === artist.id))) {
            recArts.push(artist);

            //update the users profile with the new artist
            docRef.update({
              recommendedArtists: recArts
            });
          }

        })

      });

      return "Broadcasted to Listeners";
    });
  }
  else {
    return "Not Authorised";
  }
});


/*
--SPOTIFY API FUNCTIONS--
*/

//gets a new token
//the token will be in the response.data.access_token json header
exports.getSpotifyToken = functions.https.onRequest((req, res) => {
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
      res.send({ data: result.data });
    }).catch((error) => {
      res.send({ data: error.data });
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

    if (token === null) {
      res.send({ data: "No Token Provided" });
      return;
    }

    let options = {
      method: 'GET',
      url: `https://api.spotify.com/v1/search?q=${term}&type=artist&limit=${limit}`,
      headers: { 'Authorization': `Bearer ${token}` },
    };

    //make the request
    axios(options).then((result) => {
      res.send({ data: result.data });
    }).catch((error) => {
      res.send({ data: error.data });
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

    if (token === null) {
      res.send({ data: "No Token Provided" });
      return;
    }

    if (id === null) {
      res.send({ data: "No ID Provided" });
      return;
    }

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

    if (token === null) {
      res.send({ data: "No Token Provided" });
      return;
    }

    //genres sorted by their similarity to each other
    //Thanks to ChatGPT for this
    const similarGenres = [
      "electronic", "edm", "electro", "minimal-techno", "techno", "trance",
      "house", "deep-house", "progressive-house",
      "hip-hop", "r&b",
      "pop", "power-pop", "pop-film", "indie-pop",
      "dance", "club", "dancehall", "disco", "dub", "dubstep", "funk", "groove", "hardcore", "hardstyle", "house", "j-dance", "j-idol", "j-pop", "j-rock", "k-pop", "party",
      "rock", "alt-rock", "punk-rock", "grunge", "psych-rock",
      "metal", "heavy-metal", "black-metal", "metalcore", "grindcore",
      "jazz", "blues",
      "alternative", "cantopop", "british", "indie",
      "folk", "country", "bluegrass",
      "forro", "gospel", "honky-tonk", "pagode",
      "latin", "salsa", "samba", "reggae", "reggaeton",
      "world-music", "african", "afrobeat", "brazilian", "french", "german", "indian", "iranian", "malay", "spanish", "swedish", "tango", "turkish",
      "ambient", "chill", "new-age", "study",
      "singer-songwriter", "acoustic", "guitar", "soul",
      "classical", "opera",
      "anime", "children", "filmi", "show-tunes",
    ];

    let searchGenre = ""; //the genre search filter
    genres.forEach(genre => {
      genre = genre.toLowerCase();
      if (similarGenres.includes(genre)) {
        do {
          let index = Math.floor(Math.random() * (similarGenres.length - 1));
          searchGenre = similarGenres[index];
        } while (Math.abs(similarGenres.indexOf(searchGenre) - similarGenres.indexOf(genre)) < 30);  //the higher the number the more "different" the result will be but also the longer it could potentially take to find a result
        return;
      }
    });

    //avoids a case of returning an empty array
    if (searchGenre == undefined || searchGenre == "") {
      do {
        let index = Math.floor(Math.random() * (similarGenres.length - 1));
        searchGenre = similarGenres[index];
      } while (Math.abs(similarGenres.indexOf(searchGenre) - similarGenres.indexOf(backupGenre)) < 40 || searchGenre == undefined);  //the higher the number the more "different" the result will be but also the longer it could potentially take to find a result
    }

    //specify request options
    let options = {
      method: 'GET',
      url: `https://api.spotify.com/v1/search?q=genre:${searchGenre}&type=artist&limit=${limit}`,
      headers: { 'Authorization': `Bearer ${token}` },
    };

    axios(options).then((result) => {
      res.send({ data: { genre: searchGenre, artists: result.data.artists.items } });
    }).catch((error) => {
      res.send({ data: error });
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

    if (token === null) {
      res.send({ data: "No Token Provided" });
      return;
    }

    if (id === null) {
      res.send({ data: "No ID Provided" });
      return;
    }

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

    if (token === null) {
      res.send({ data: "No Token Provided" });
      return;
    }

    let options = {
      method: 'GET',
      url: `https://api.spotify.com/v1/artists/3jOstUTkEu2JkjvRdBA5Gu`,
      headers: { 'Authorization': `Bearer ${token}` }
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

    if (token === null) {
      res.send({ data: "No Token Provided" });
      return;
    }

    if (id === null) {
      res.send({ data: "No ID Provided" });
      return;
    }

    // specify the options
    let options = {
      method: 'GET',
      url: `https://api.spotify.com/v1/artists/${id}/albums?include_groups=album,single&limit=50`,
      headers: { 'Authorization': `Bearer ${token}` }
    };

    // make the request for a RANDOM artist
    axios(options).then((result) => {
      res.send({ data: result.data });
    }).catch((error) => {
      res.send({ data: error.data });
    });
  });
});

exports.recommendArtists = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const token = req.body.data.token;
    const user = req.body.data.user;
    const threshold = req.body.data.threshold;  // this is new too


    let genres = [];

    user.likedArtists.forEach((artist) => {
      artist.genres.forEach((genre) => {
        genres.push(genre);
      });
    });


    //get a random search query
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const randomSearch = alphabet.charAt(Math.floor(Math.random() * 25));
    const randomUserGenre = genres.length > 0 ? genres[Math.floor(Math.random() * genres.length)] : "";
    const randomOffset = Math.floor(Math.random(12345)) % 90;
    //search the spotify API for a random artist

    //specify request options
    let options = {
      method: 'GET',
      url: `https://api.spotify.com/v1/search?q="${randomSearch}"genre:${randomUserGenre}&type=artist&limit=5&offset=${randomOffset}`,
      headers: { 'Authorization': `Bearer ${token}` },
    };

    //make request
    axios(options).then((result) => {
      //return first result
      let potentialArtist = result.data.artists.items[0];

      if (user.likedArtists.includes(potentialArtist) || user.suggestedArtists.includes(potentialArtist)) {
        res.send({ data: { result: "Failure - Artist already liked", artist: potentialArtist, code: 1 } });
        return;
      }

      let probPos = 1;
      let probNeg = 1;
      let currProb = 0;
      let finalProb = 0;

      let countSugg = 0;  // the suggested new artist
      let countComp = 0;  // the artist being compared
      let countBoth = 0;  // instances of the intersection

      let similarArtists = [];        // array of the most similar artists     
      let sim_prob = [];              // their associated probability         
      let dis_prob = [];              // same again for negative

      const dbRef = db.collection("UserData");
      let n = dbRef.length;

      //get the probability that a user will like this album
      dbRef.get().then((dbSnap) => {
        dbSnap.forEach((doc) => {
          doc.data().suggestedArtists.forEach((artist) => {    //for each of each users liked artists

            dbSnap.forEach((user) => {
              let liked = user.data().likedArtists;
              if (liked.find(entry => entry.id == artist.id)) {
                countComp++;
                if (liked.find(entry => entry.id == potentialArtist.id)) {
                  countBoth++;
                }
              }
              else if (liked.find(entry => entry.id == potentialArtist.id)) {
                countSugg++;
              }
            });

            currProb = (countComp / n) * (countBoth / countComp) / (countSugg / n);
            if (currProb > 0.5 && sim_prob.length < 11) {
              similarArtists.push(artist.id);
              sim_pos.push(currProb);
            }

            countSugg = 0;
            countComp = 0;
            countEither = 0;

            dbSnap.forEach((user) => {
              let seen = user.data().suggestedArtists;
              if (seen.find(entry => entry.id == artist.id)) {
                countComp++;
                if (seen.find(entry => entry.id == potentialArtist.id)) {
                  countBoth++;
                }
              }
              else if (seen.find(entry => entry.id == potentialArtist.id)) {
                countSugg++;
              }
            })

            for (let i = 0; i < dis_prob.length; i++) {
              probNeg *= dis_prob[i];
            }

            // console.log(probPos - (probNeg *0.5));
          });
        });

        for (let i = 0; i < sim_prob.length; i++) {
          probPos *= sim_prob[i];
        }

        for (let i = 0; i < dis_prob.length; i++) {
          probNeg *= dis_prob[i];
        }

        finalProb = probPos - (probNeg * 0.5);

        // also adding the "because you liked" array
        if (finalProb > 0.45 || finalProb === 0) {
          res.send({ data: { result: "Success", artist: potentialArtist, prob: finalProb, similar: similarArtists, code: 0 } });
        }
        else {
          res.send({ data: { result: "Failure", artist: potentialArtist, prob: finalProb, code: 1 } });
        }
      });
    });
  });
});


/* WIKIPEDIA API CALLS */

exports.getArtistInfo = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const artist = req.body.data.artist;
    const numSentences = req.body.data.sentences

    const options = {
      method: 'GET',
      url: `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exsentences=${numSentences}&exlimit=1&explaintext=1&formatversion=2&titles=${artist}&utf8=1&origin=*`,
    };

    axios(options).then((ret) => {
      let text = ret.data.query.pages[0].extract;
      console.log(text.length);

      if(text.length > 0){
        res.send({data: { code: 0, info: text}});
      }
      else{
        res.send({data: {code: 1, errorMessage: "No info on artist"}});
      }
      
    }).catch((error) => {
      res.send({data: { code: 1, errorMessage: error}});
    });
  });
});
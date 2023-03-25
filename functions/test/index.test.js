const chai = require('chai');
const chaiHTTP = require('chai-http');

chai.use(chaiHTTP);
const expect = chai.expect;

//spotify token used to do tests
//paste https://us-central1-test-project-3d277.cloudfunctions.net/getSpotifyToken into the browser url bar for this
const testToken = 'BQDDP2MtDAlt3yc5LTdzHSfk4E1ERh8qkfA5TJ0hb_bIdQ6V9j00OQeC_ox5C-dBM4PTM1hJ2tfEtjV4LUd5VTADZa9Gsw8GQU5n3vm-F7nmQHA1xLs9';

/* ON REQUEST FUNCTION TESTS */

//checkUniqueUsername
describe("Tests Unique Username Checker", function() {
    this.timeout(10000);
    it("Tests if the server can verify a taken username is taken", async () => {
        const result = await chai.request('https://us-central1-test-project-3d277.cloudfunctions.net')
        .post('/checkUniqueUsername')
        .set('content-type', 'application/json')
        .send({data: {username: 'liam'}});
        expect(result.statusCode).to.equal(200);
        expect(result.body.data.isTaken).to.be.a('boolean');
        expect(result.body.data.isTaken).to.equal(true);
    });

    it("Tests handling null data", async () => {
        const result = await chai.request('https://us-central1-test-project-3d277.cloudfunctions.net')
        .post('/checkUniqueUsername')
        .set('content-type', 'application/json')
        .send({data: {username: null}});
        expect(result.statusCode).to.equal(200);
        expect(result.body.data.isTaken).to.be.a('boolean');
        expect(result.body.data.isTaken).to.equal(true);
    });
});

//getting a spotify token
describe("Tests Spotify Token Retrieval", function() {
    this.timeout(10000);
    it('Tests if a token is returned', async () => {
        const result = await chai.request('https://us-central1-test-project-3d277.cloudfunctions.net')
        .get('/getSpotifyToken');
        expect(result.statusCode).to.equal(200);
        expect(result.body.data.access_token).to.be.a('string');
    });
});

//searching an artist
describe("Tests Searching Artists on Spotify", function() {
    this.timeout(10000);
    it('Tests a search', async () => {
        const result = await chai.request('https://us-central1-test-project-3d277.cloudfunctions.net')
        .post('/searchArtist')
        .set('content-type', 'application/json')
        .send({data: {token: testToken, term: 'a', limit: 1}});
        expect(result.statusCode).to.equal(200);
        expect(result.body.data.artists.items).to.be.an('Array');
    });

    it('Tests null token handling', async () => {
        const result = await chai.request('https://us-central1-test-project-3d277.cloudfunctions.net')
        .post('/searchArtist')
        .set('content-type', 'application/json')
        .send({data: {token: null, term: 'a', limit: 1}});
        expect(result.statusCode).to.equal(200);
        expect(result.body.data).to.be.a('string');
    })
});

//getting related artists
describe("Tests Getting Related Artists", function() {
    this.timeout(10000);
    it('Tests good function call', async () => {
        const result = await chai.request('https://us-central1-test-project-3d277.cloudfunctions.net')
        .post('/getRelatedArtists')
        .set('content-type', 'application/json')
        .send({data: {token: testToken, id: '053q0ukIDRgzwTr4vNSwab'}});
        expect(result.statusCode).to.equal(200);
        expect(result.body.data.artists).to.be.an('Array');
    });

    it('Tests null token handling', async () => {
        const result = await chai.request('https://us-central1-test-project-3d277.cloudfunctions.net')
        .post('/getRelatedArtists')
        .set('content-type', 'application/json')
        .send({data: {token: null, id: '053q0ukIDRgzwTr4vNSwab'}});
        expect(result.statusCode).to.equal(200);
        expect(result.body.data).to.be.a('string');
    });

    it('Tests null ID handling', async () => {
        const result = await chai.request('https://us-central1-test-project-3d277.cloudfunctions.net')
        .post('/getRelatedArtists')
        .set('content-type', 'application/json')
        .send({data: {token: testToken, id: null}});
        expect(result.statusCode).to.equal(200);
        expect(result.body.data).to.be.a('string');
    });
});

//getting unrelated artists
describe("Tests Getting Unrelated Artists", function() {
    this.timeout(10000);
    it('Tests good function call', async () => {
        const result = await chai.request('https://us-central1-test-project-3d277.cloudfunctions.net')
        .post('/getUnrelatedArtists')
        .set('content-type', 'application/json')
        .send({data: {token: testToken, limit: 5, genres: ['rock'], backupGenre: 'disco'}});
        expect(result.statusCode).to.equal(200);
        expect(result.body.data.artists).to.be.an('Array');
    });

    it('Tests null token handling', async () => {
        const result = await chai.request('https://us-central1-test-project-3d277.cloudfunctions.net')
        .post('/getUnrelatedArtists')
        .set('content-type', 'application/json')
        .send({data: {token: null, limit: 5, genres: ['rock'], backupGenre: 'disco'}});
        expect(result.statusCode).to.equal(200);
        expect(result.body.data).to.be.a('string');
    });
});

//getting an artist
describe("Tests Getting an Artist", function() {
    this.timeout(10000);
    it('Tests good function call', async () => {
        const result = await chai.request('https://us-central1-test-project-3d277.cloudfunctions.net')
        .post('/getArtist')
        .set('content-type', 'application/json')
        .send({data: {token: testToken, id: '053q0ukIDRgzwTr4vNSwab'}});
        expect(result.statusCode).to.equal(200);
        expect(result.body.data.genres).to.be.an('Array');
    });

    it('Tests null token handling', async () => {
        const result = await chai.request('https://us-central1-test-project-3d277.cloudfunctions.net')
        .post('/getArtist')
        .set('content-type', 'application/json')
        .send({data: {token: null, id: '053q0ukIDRgzwTr4vNSwab'}});
        expect(result.statusCode).to.equal(200);
        expect(result.body.data).to.be.a('string');
    });

    it('Tests null id handling', async () => {
        const result = await chai.request('https://us-central1-test-project-3d277.cloudfunctions.net')
        .post('/getArtist')
        .set('content-type', 'application/json')
        .send({data: {token: testToken, id: null}});
        expect(result.statusCode).to.equal(200);
        expect(result.body.data).to.be.a('string');
    });
});

//getting an artists albums
describe("Tests Getting an Artists Albums", function() {
    this.timeout(10000);
    it('Tests good function call', async () => {
        const result = await chai.request('https://us-central1-test-project-3d277.cloudfunctions.net')
        .post('/getAlbums')
        .set('content-type', 'application/json')
        .send({data: {token: testToken, id: '053q0ukIDRgzwTr4vNSwab'}});
        expect(result.statusCode).to.equal(200);
        expect(result.body.data.items).to.be.an('Array');
    });

    it('Tests null token handling', async () => {
        const result = await chai.request('https://us-central1-test-project-3d277.cloudfunctions.net')
        .post('/getAlbums')
        .set('content-type', 'application/json')
        .send({data: {token: null, id: '053q0ukIDRgzwTr4vNSwab'}});
        expect(result.statusCode).to.equal(200);
        expect(result.body.data).to.be.a('string');
    });

    it('Tests null id handling', async () => {
        const result = await chai.request('https://us-central1-test-project-3d277.cloudfunctions.net')
        .post('/getAlbums')
        .set('content-type', 'application/json')
        .send({data: {token: testToken, id: null}});
        expect(result.statusCode).to.equal(200);
        expect(result.body.data).to.be.a('string');
    });
});

//getting an recommendations
describe("Tests Getting Recommendations", function() {
    this.timeout(10000);
    
    it('Tests null token handling', async () => {
        const result = await chai.request('https://us-central1-test-project-3d277.cloudfunctions.net')
        .post('/recommendArtists')
        .set('content-type', 'application/json')
        .send({data: {token: null, user: null}});
        expect(result.statusCode).to.equal(200);
        expect(result.body.data).to.be.a('string');
    });

    it('Tests null user handling', async () => {
        const result = await chai.request('https://us-central1-test-project-3d277.cloudfunctions.net')
        .post('/recommendArtists')
        .set('content-type', 'application/json')
        .send({data: {token: testToken, user: null}});
        expect(result.statusCode).to.equal(200);
        expect(result.body.data).to.be.a('string');
    });

    it('Tests empty user handling', async () => {
        const result = await chai.request('https://us-central1-test-project-3d277.cloudfunctions.net')
        .post('/recommendArtists')
        .set('content-type', 'application/json')
        .send({data: {token: testToken, user: {}}});
        expect(result.statusCode).to.equal(200);
        expect(result.body.data).to.be.a('string');
    });
});
import{g as y,a as _,h as n,b as v,i as d,o,c as x,d as w,e as r,s as k,T as g,f as p}from"./TheFooter-7aa9b582.js";import{_ as I,o as u,c as h,a,b as i,d as j,p as A,e as S,f as l,F as P}from"./index-a68657c6.js";const z="/assets/CreateAccount-8dbc6bff.png",B="/assets/Search-20801383.png",T="/assets/LikingTheBeatles-6cd65875.jpg",$="/assets/TheBeatlesAddedToP-e561fe1d.jpg",F="/assets/LikingAlbums-e8f47a4d.jpg",V="/assets/AlbumsAddedTop-e4dd0afe.jpg";const m=y(v),C=_(v),E=n(m,"getProfileInfo");n(m,"updateProfile");const N={data(){return{email:"",password:"",uid:"",loggedIn:d(),accountInfo:{},newBio:"",newURL:""}},created(){this.refresh()},watch:{"$route.params":{handler(){this.refresh()}}},methods:{opensignin(){o(0)},opensignup(){o(1)},openProfileEdit(){o(2)},closeProfileEdit(){x(2)},refresh(){this.accountInfo={},w(C,s=>{this.uid=s?s.uid:this.$route.params.uid,d()&&this.uid!=null&&JSON.stringify(r())=="{}"?(console.log("Getting Profile From Server"),E({id:this.uid}).then(t=>{k(t.data),this.accountInfo=t.data,console.log(this.accountInfo)}).catch(t=>{console.log(t.code),console.log(t.message)})):this.accountInfo=r()})(),this.loggedIn=d()}}},L=e=>(A("data-v-0cb99036"),e=e(),S(),e),M={class:"px-4 pt-5 text-center"},U=L(()=>a("h1",{class:"display-4 fw-bold"},[i("Making the world a better place,"),a("br"),i(" one recommendation at a time")],-1)),q={class:"col-lg-6 mx-auto"},G={class:"lead mb-4"},O={style:{display:"inline"}},W={style:{display:"inline"}},Y=j('<div class="container col-xxl-8 px-4 py-5" data-v-0cb99036><div class="row flex-lg-row-reverse align-items-center g-5 py-5" data-v-0cb99036><div class="col-10 col-sm-8 col-lg-6" data-v-0cb99036><img src="'+z+'" class="d-block mx-lg-auto img-fluid" width="300" height="300" loading="lazy" data-v-0cb99036></div><div class="col-lg-6" data-v-0cb99036><h1 class="display-5 fw-bold lh-1 mb-3" data-v-0cb99036>First create an account</h1><p class="lead" data-v-0cb99036>Register an account using your email and chose a suitable email and password.</p><div class="d-grid gap-2 d-md-flex justify-content-md-start" data-v-0cb99036></div></div></div></div><div class="container col-xxl-8 px-4 py-5" data-v-0cb99036><div class="row flex-lg-row-reverse align-items-center g-5 py-5" data-v-0cb99036><div class="col-10 col-sm-8 col-lg-6" data-v-0cb99036><h1 class="display-5 fw-bold lh-1 mb-3" data-v-0cb99036>Search for your favourite the artist</h1><p class="lead" data-v-0cb99036>Go to the search page and search for your favourite artists. </p></div><div class="col-lg-6" data-v-0cb99036><img src="'+B+'" class="d-block mx-lg-auto img-fluid" width="700" height="500" loading="lazy" data-v-0cb99036><div class="d-grid gap-2 d-md-flex justify-content-md-start" data-v-0cb99036></div></div></div></div><div class="container col-xxl-8 px-4 py-5" data-v-0cb99036><div class="row flex-lg-row-reverse align-items-center g-5 py-5" data-v-0cb99036><div class="col-10 col-sm-8 col-lg-6" data-v-0cb99036><img src="'+T+'" class="d-block mx-lg-auto img-fluid" width="300" height="300" loading="lazy" data-v-0cb99036></div><div class="col-lg-6" data-v-0cb99036><h1 class="display-5 fw-bold lh-1 mb-3" data-v-0cb99036>View their profile</h1><p class="lead" data-v-0cb99036>Here you can see what genre of music they make, related artists and unrelated artists. You can favourite this artist and scroll through their entire discography and favourite your favourite albums</p><div class="d-grid gap-2 d-md-flex justify-content-md-start" data-v-0cb99036></div></div></div></div><div class="container col-xxl-8 px-4 py-5" data-v-0cb99036><div class="row flex-lg-row-reverse align-items-center g-5 py-5" data-v-0cb99036><div class="col-10 col-sm-8 col-lg-6" data-v-0cb99036><h1 class="display-5 fw-bold lh-1 mb-3" data-v-0cb99036>View your favourite artists</h1><p class="lead" data-v-0cb99036>Once you favourite an artist they will be saved to yourn profile page. You can click on the artists profile picture to view their profile </p></div><div class="col-lg-6" data-v-0cb99036><img src="'+$+'" class="d-block mx-lg-auto img-fluid" width="700" height="500" loading="lazy" data-v-0cb99036><div class="d-grid gap-2 d-md-flex justify-content-md-start" data-v-0cb99036></div></div></div></div><div class="container col-xxl-8 px-4 py-5" data-v-0cb99036><div class="row flex-lg-row-reverse align-items-center g-5 py-5" data-v-0cb99036><div class="col-10 col-sm-8 col-lg-6" data-v-0cb99036><img src="'+F+'" class="d-block mx-lg-auto img-fluid" width="300" height="300" loading="lazy" data-v-0cb99036></div><div class="col-lg-6" data-v-0cb99036><h1 class="display-5 fw-bold lh-1 mb-3" data-v-0cb99036>Favourite their albums</h1><p class="lead" data-v-0cb99036>When scrolling through the artists discography you can favourite their albums</p><div class="d-grid gap-2 d-md-flex justify-content-md-start" data-v-0cb99036></div></div></div></div><div class="px-4 pt-5 text-center" data-v-0cb99036><h1 class="display-4 fw-bold" data-v-0cb99036>View your favourite albums</h1><div class="col-lg-6 mx-auto" data-v-0cb99036><p class="lead mb-4" data-v-0cb99036>Your profile will now display all your favourited artists and albums</p></div><div data-v-0cb99036><div class="container px-5" data-v-0cb99036><img src="'+V+'" class="img-fluid rounded-3 shadow-lg mb-4" alt="Example image" width="700" height="500" loading="lazy" data-v-0cb99036></div></div></div><div class="px-4 pt-5 text-center" data-v-0cb99036><h1 class="display-4 fw-bold" data-v-0cb99036>Most importantly we recommend you artists!</h1><div class="col-lg-6 mx-auto" data-v-0cb99036><p class="lead mb-4" data-v-0cb99036>Go to recommedations and start liking and disliking artists as they appear on the screen</p></div><div data-v-0cb99036><div class="container px-5" data-v-0cb99036><img src="https://townsquare.media/site/50/files/2016/09/superlike-2.jpg?w=1200&amp;h=0&amp;zc=1&amp;s=0&amp;a=t&amp;q=89" class="img-fluid rounded-3 shadow-lg mb-4" alt="Example image" width="700" height="500" loading="lazy" data-v-0cb99036></div></div></div>',7);function H(e,s,t,D,K,c){return u(),h("body",null,[a("div",M,[U,a("div",q,[a("p",G,[a("strong",null,[a("h4",O,[a("a",{onClick:s[0]||(s[0]=f=>c.opensignin())},"Sign in")])]),i(" or "),a("strong",null,[a("h4",W,[a("a",{onClick:s[1]||(s[1]=f=>c.opensignup())},"register")])]),i(" to get started. We’re your home for logging your favourite artists and albums. We also recommend you artists based on your favourite artists and albums")])])]),Y])}const b=I(N,[["render",H],["__scopeId","data-v-0cb99036"]]),R={class:"wrapper"},J={name:"AboutUs",components:{TheHeader:g,AboutUsBody:b,TheFooter:p}},Z=Object.assign(J,{setup(e){return(s,t)=>(u(),h(P,null,[a("header",null,[l(g),a("div",R,[l(b)])]),a("main",null,[l(p)])],64))}});export{Z as default};

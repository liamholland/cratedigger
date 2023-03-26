import{g as C,a as B,h as f,b as U,d as F,o as y,c as S,e as P,s as r,j as w,k as d,T as R,f as L}from"./TheFooter-69edb0b3.js";import{_ as E,o as i,a as l,b as e,w as I,v as b,t as u,F as p,i as _,g as O,f as A,p as N,h as V,d as k}from"./index-792b736c.js";const g=C(U),q=B(U),D=f(g,"getProfileInfo"),x=f(g,"updateProfile"),z=f(g,"getUser"),M=f(g,"addListener"),j=f(g,"removeListener"),m=f(g,"getListeningTo"),G={data(){return{email:"",password:"",loggedIn:!1,displayAlbums:!1,displayRecs:!1,accountInfo:{},listeningTo:[],searchedUser:{},hasResult:!1,message:"",input:"",typing:!1,newBio:"",newURL:""}},created(){F(q,t=>{t?this.loggedIn=!0:this.loggedIn=!1})()},watch:{loggedIn(){this.refresh()},"$route.params":{handler(){this.refresh()}}},methods:{opensignin(){y(0)},opensignup(){y(1)},openProfileEdit(){y(2)},closeProfileEdit(){S(2)},refresh(){this.accountInfo={},this.$route.params.name&&JSON.stringify(P())=="{}"?(this.loggedIn=!0,console.log("Getting Profile From Server"),D({field:null}).then(s=>{r(s.data),this.accountInfo=s.data,m().then(t=>{this.listeningTo=t.data,console.log(this.listeningTo)}).catch(t=>{console.log(t)})}).catch(s=>{console.log(s.code),console.log(s.message)})):this.$route.params.name?(this.loggedIn=!0,this.accountInfo=P(),m().then(s=>{this.listeningTo=s.data,console.log(this.listeningTo)}).catch(s=>{console.log(s)})):this.loggedIn=!1},showAlbums(s){this.displayAlbums=s,this.displayRecs=!1},showRecommendations(){console.log(this.accountInfo.recommendedArtists),this.displayAlbums=!1,this.displayRecs=!0},updateProfile(){w(this),this.newBio.length>0&&this.newURL.length>0?(this.updateBio(),this.updatePFP()):this.newBio.length>0?this.updateBio():this.newURL.length>0&&this.updatePFP(),this.closeProfileEdit(),this.refresh()},updateBio(){x({field:"bio",value:this.newBio}).then(s=>{console.log(s.data.body),this.accountInfo.bio=this.newBio,r(this.accountInfo),this.newBio="",d()}).catch(s=>{console.log(s.code,s.message)})},updatePFP(){x({field:"pfpURL",value:this.newURL}).then(s=>{console.log(s.data.body),this.accountInfo.pfpURL=this.newURL,r(this.accountInfo),this.newURL="",d()}).catch(s=>{console.log(s.code,s.message)})},search(s){this.typing||(this.typing=!0,setTimeout(()=>this.sendSearchRequest(s),150))},sendSearchRequest(s){this.typing=!1,s.length>0?z({username:s}).then(t=>{if(t.data.code===1){console.log(t.data.body),this.hasResult=!1,this.searchedUser=={};return}else t.data.code===0&&(console.log(t.data.userData),this.searchedUser=t.data.userData,this.accountInfo.listeningTo.find(c=>c==this.searchedUser.id)?(this.message=`Already Listening to ${this.searchedUser.username}`,this.hasResult=!1):(this.hasResult=!0,this.message="No Such User"))}).catch(t=>{console.log(t)}):(this.message="",this.hasResult=!1,this.searchedUser={})},follow(){this.hasResult&&(w(this),this.accountInfo.hasOwnProperty("listeningTo")||(this.accountInfo.listeningTo=[]),this.hasResult=!1,this.accountInfo.listeningTo.push(this.searchedUser.id),r(this.accountInfo),M({id:this.searchedUser.id}).then(s=>{console.log(s),this.searchedUser={},m().then(t=>{this.listeningTo=t.data,d()}).catch(t=>{console.log(t),d()})}).catch(s=>{console.log(s),d()}))},unfollow(s){w(this),this.accountInfo.listeningTo.splice(this.accountInfo.listeningTo.indexOf(s),1),this.listeningTo=this.accountInfo.listeningTo,r(this.accountInfo),j({id:s}).then(t=>{console.log(t.data),m().then(c=>{this.listeningTo=c.data,d()}).catch(c=>{console.log(c),d()})}).catch(t=>{console.log(t),d()})},notAlreadyLiked(s){return!this.accountInfo.likedArtists.find(t=>t.id==s)},viewArtist(s){let t=[];this.accountInfo.recommendedArtists.length==1?this.accountInfo.recommendedArtists=[]:t=this.accountInfo.recommendedArtists.splice(this.accountInfo.recommendedArtists.indexOf(this.accountInfo.recommendedArtists.find(c=>c.id==s)),1),r(this.accountInfo),x({field:"recommendedArtists",value:t}).then(c=>{console.log(c)}),this.$router.push({name:"ArtistPage",params:{aid:s}})},getOtherPFP(s){return s==""?"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png":s}},computed:{pfpURL(){return JSON.stringify(this.accountInfo)=="{}"||this.accountInfo.pfpURL==""?"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png":this.accountInfo.pfpURL}}},a=s=>(N("data-v-5fdafaad"),s=s(),V(),s),J={key:0},H={id:"myModal1",class:"modal"},K={style:{"align-items":"center"},class:"modal-content"},W=a(()=>e("h1",{class:"h3 mb-3 fw-normal",style:{color:"white","font-size":"40px"}},"Edit Profile",-1)),X={class:"form-floating"},Y=a(()=>e("label",{for:"floatingInput"},"Edit Bio",-1)),Q=a(()=>e("br",null,null,-1)),Z={class:"form-floating"},$=a(()=>e("label",{for:"floatingInput"},"Change Profile Picture",-1)),ee=a(()=>e("br",null,null,-1)),te=a(()=>e("br",null,null,-1)),se=a(()=>e("head",null,[e("meta",{charset:"UTF-8"}),e("meta",{"http-equiv":"X-UA-Compatible",content:"IE=edge"}),e("meta",{name:"viewport",content:"width=device-width, initial-scale=1.0"})],-1)),oe={class:"header__wrapper",style:{"background-color":"black"}},ne={class:"rounded-top text-white cols__container",style:{"background-color":"#151515"}},ie={class:"left__col"},le={class:"right__col"},ae={class:"row"},ce={class:"col d-flex flex-row"},de={class:"pfpBio",style:{"background-color":"#151515"}},he={class:"pfp"},re=["src"],ue={class:"bio"},fe={class:"display-5 fw-bold",style:{"font-size":"225%"}},ge={class:"col"},pe={class:"listeningTo"},_e=a(()=>e("h4",null,"Listening To:",-1)),me={class:"listenList"},ve=["onClick"],ye=["src"],we={class:"col"},Ie={key:0,class:"search"},be=["src"],ke={key:1,class:"mx-auto"},xe=a(()=>e("br",null,null,-1)),Pe={class:"row"},Ae={class:"col"},Ue={style:{"text-indent":"20px",cursor:"pointer"}},Re={style:{"text-indent":"20px",cursor:"pointer"}},Le={style:{"text-indent":"20px",cursor:"pointer"}},Te=a(()=>e("br",null,null,-1)),Ce={class:"row"},Be={class:"col"},Fe={key:0,class:"photos"},Se=["src","alt","onClick"],Ee={key:1,class:"photos"},Oe=["src","alt","onClick"],Ne={key:2,class:"photos"},Ve=["src","alt","onClick"],qe=a(()=>e("div",{class:"col-lg-6 mx-auto",style:{"padding-top":"10%",width:"100vw",height:"60vh","background-color":"#151515"}},null,-1)),De={key:1},ze={class:"px-4 py-5 text-center",style:{width:"100vw",height:"100vh",color:"white","background-color":"black"}},Me={class:"col-lg-6 mx-auto",style:{"padding-top":"10%"}},je={class:"lead mb-4",style:{color:"white"}},Ge={style:{display:"inline"}},Je={style:{display:"inline"}},He=a(()=>e("div",{class:"d-grid gap-2 d-sm-flex justify-content-sm-center"},null,-1));function Ke(s,t,c,Ye,h,n){return this.loggedIn?(i(),l("div",J,[e("div",H,[e("div",K,[e("span",{class:"close",onClick:t[0]||(t[0]=o=>n.closeProfileEdit())},"×"),W,e("div",X,[I(e("input",{class:"form-control",id:"floatingInput",required:"","onUpdate:modelValue":t[1]||(t[1]=o=>h.newBio=o)},null,512),[[b,h.newBio]]),Y]),Q,e("div",Z,[I(e("input",{class:"form-control",id:"floatingInput",required:"","onUpdate:modelValue":t[2]||(t[2]=o=>h.newURL=o)},null,512),[[b,h.newURL]]),$]),ee,e("a",{onClick:t[3]||(t[3]=(...o)=>n.updateProfile&&n.updateProfile(...o)),class:"btn-get-started"},"Submit"),te])]),se,e("body",null,[e("div",oe,[e("div",ne,[e("div",ie,[e("div",le,[e("div",ae,[e("div",ce,[e("div",de,[e("div",he,[e("img",{src:this.pfpURL,alt:"Generic placeholder image",class:"img-fluid img-thumbnail mt-4 mb-2",style:{height:"150px",width:"150px","z-index":"1"}},null,8,re),e("button",{type:"button",style:{"z-index":"1","background-color":"white","border-radius":"4px",border:"none",width:"150px"},onClick:t[4]||(t[4]=o=>n.openProfileEdit())}," Edit profile ")]),e("div",ue,[e("h2",fe,u(this.accountInfo.username),1),e("p",null,u(this.accountInfo.bio),1),e("h5",null,"Listeners: "+u(this.accountInfo.listenerCount),1)])])]),e("div",ge,[e("div",pe,[_e,e("div",me,[(i(!0),l(p,null,_(this.listeningTo,o=>(i(),l("div",{onClick:v=>n.unfollow(o.id)},[e("img",{src:n.getOtherPFP(o.pfpURL),style:{height:"50px",width:"50px"},alt:"PFP"},null,8,ye),e("h4",null,u(o.username),1)],8,ve))),256))])])]),e("div",we,[I(e("input",{class:"input-search mx-auto","onUpdate:modelValue":t[5]||(t[5]=o=>h.input=o),onKeyup:t[6]||(t[6]=o=>n.search(this.input)),placeholder:"Whos recommendations do you want to listen to?",style:{"max-width":"90%",height:"50px"}},null,544),[[b,h.input]]),h.hasResult?(i(),l("div",Ie,[e("div",{onClick:t[7]||(t[7]=(...o)=>n.follow&&n.follow(...o))},[e("img",{src:n.getOtherPFP(this.searchedUser.pfp),style:{height:"50px",width:"50px"},alt:"PFP"},null,8,be),e("h4",null,u(this.searchedUser.username),1)])])):(i(),l("div",ke,[e("h4",null,u(this.message),1)]))])])]),xe,e("div",Pe,[e("div",Ae,[e("nav",null,[e("ul",null,[e("li",Ue,[e("a",{onClick:t[8]||(t[8]=o=>n.showAlbums(!0))},"Liked Albums")]),e("li",Re,[e("a",{onClick:t[9]||(t[9]=o=>n.showAlbums(!1))},"Liked Artists")]),e("li",Le,[e("a",{onClick:t[10]||(t[10]=(...o)=>n.showRecommendations&&n.showRecommendations(...o))},"Recommended Artists")])]),Te])])]),e("div",Ce,[e("div",Be,[this.displayAlbums?(i(),l("div",Fe,[(i(!0),l(p,null,_(this.accountInfo.likedAlbums,o=>(i(),l("img",{src:o.images[0].url,alt:o.name,onClick:v=>this.$router.push({name:"ArtistPage",params:{aid:o.artists[0].id}})},null,8,Se))),256))])):this.displayRecs?(i(),l("div",Ee,[(i(!0),l(p,null,_(this.accountInfo.recommendedArtists,o=>(i(),l("div",null,[n.notAlreadyLiked(o.id)?(i(),l("img",{key:0,src:o.images[0].url,alt:o.name,onClick:v=>n.viewArtist(o.id)},null,8,Oe)):O("",!0)]))),256))])):(i(),l("div",Ne,[(i(!0),l(p,null,_(this.accountInfo.likedArtists,o=>(i(),l("img",{src:o.images[0].url,alt:o.name,onClick:v=>this.$router.push({name:"ArtistPage",params:{aid:o.id}})},null,8,Ve))),256))]))])])])])]),qe])])):(i(),l("div",De,[e("section",ze,[e("div",Me,[e("h4",je,[A("You are not logged into your account. To login click "),e("h3",Ge,[e("strong",null,[e("a",{onClick:t[11]||(t[11]=o=>n.opensignin())},"here")])]),A(" or to create an account click "),e("h3",Je,[e("strong",null,[e("a",{onClick:t[12]||(t[12]=o=>n.opensignup())},"here")])])]),He])])]))}const T=E(G,[["render",Ke],["__scopeId","data-v-5fdafaad"]]),We={class:"wrapper"},Xe={name:"AboutUs",components:{TheHeader:R,AccountPageBody:T,TheFooter:L}},$e=Object.assign(Xe,{setup(s){return(t,c)=>(i(),l(p,null,[e("header",null,[k(R),e("div",We,[k(T)])]),e("main",null,[k(L)])],64))}});export{$e as default};

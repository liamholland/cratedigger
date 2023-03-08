import{g as y,b as x,c as P,d as f,o as A,h as c,T as w,a as v}from"./TheFooter-9eeb639d.js";import{_ as B,o as p,c as u,b as t,w as g,v as m,t as b,a as L,p as S,h as j,d as r,F as I}from"./index-a92b22b3.js";const n=y(f),_=x(f);P(n,"localhost",5001);const R={data(){return{email:"",username:"",password:"",uid:"",isLoggedIn:!1,name:"",bio:"",pfp:"",likedAlbums:[],likedArtists:[],newBio:"",newURL:"",loadingBar:""}},created(){this.refresh()},watch:{"$route.params":{handler(){this.refresh()}}},methods:{opensignin(){let i=document.querySelectorAll(".modal");i[0].style.display="flex"},opensignup(){let i=document.querySelectorAll(".modal");i[1].style.display="flex"},openProfileEdit(){let i=document.querySelectorAll(".modal");i[2].style.display="flex"},closeProfileEdit(){let i=document.querySelectorAll(".modal");i[2].style.display="none"},refresh(){console.log(this.uid),A(_,e=>{this.uid=e?e.uid:this.$route.params.uid,this.isLoggedIn=!!e,this.isLoggedIn&&this.uid!=null&&(console.log(this.uid),c(n,"getProfileInfo")({id:this.uid}).then(a=>{console.log(a.data),this.name=a.data.username,this.bio=a.data.bio,this.pfp=a.data.pfpURL,this.likedAlbums=a.data.likedAlbums,this.likedArtists=a.data.likedArtists}).catch(a=>{console.log(a.code),console.log(a.message)}))})(),this.loadingBar!=""&&this.loadingBar.hide()},logout(){this.loadingBar=this.$loading.show(),_.signOut(),this.uid="",this.isLoggedIn=!1,this.loadingBar.hide()},updateProfile(){this.loadingBar=this.$loading.show(),this.newBio.length>0&&this.newURL.length>0?(this.updateBio(),this.updatePFP()):this.newBio.length>0?this.updateBio():this.newURL.length>0&&this.updatePFP(),this.closeProfileEdit()},updateBio(){const i=c(n,"updateProfile");console.log(this.uid),i({id:this.uid,field:"bio",value:this.newBio}).then(e=>{console.log(e.data.body),this.newBio="",this.refresh()}).catch(e=>{console.log(e.code,e.message)})},updatePFP(){const i=c(n,"updateProfile");console.log(this.uid),i({id:this.uid,field:"pfpURL",value:this.newURL}).then(e=>{console.log(e.data.body),this.newURL="",this.refresh()}).catch(e=>{console.log(e.code,e.message)})}},computed:{pfpURL(){return this.pfp==""?"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png":this.pfp}}},o=i=>(S("data-v-7cbfba13"),i=i(),j(),i),U={key:0},C={id:"myModal1",class:"modal"},D={style:{"align-items":"center"},class:"modal-content"},E=o(()=>t("h1",{class:"h3 mb-3 fw-normal",style:{color:"white","font-size":"40px"}},"Edit Profile",-1)),M={class:"form-floating"},F=o(()=>t("label",{for:"floatingInput"},"Edit Bio",-1)),q=o(()=>t("br",null,null,-1)),z={class:"form-floating"},T=o(()=>t("label",{for:"floatingInput"},"Change Profile Picture",-1)),V=o(()=>t("br",null,null,-1)),G=o(()=>t("br",null,null,-1)),K=o(()=>t("head",null,[t("meta",{charset:"UTF-8"}),t("meta",{"http-equiv":"X-UA-Compatible",content:"IE=edge"}),t("meta",{name:"viewport",content:"width=device-width, initial-scale=1.0"})],-1)),N={class:"header__wrapper",style:{"background-color":"black"}},W={class:"cols__container",style:{"background-color":"#151515"}},O={class:"right__col",style:{"background-color":"#151515"}},$={class:"left__col",style:{"background-color":"#151515"}},H={class:"card",style:{"background-color":"#151515"}},X={class:"rounded-top text-white d-flex flex-row",style:{"background-color":"#151515",height:"200px"}},J=o(()=>t("div",{class:"dropdown"},null,-1)),Q={class:"ms-4 mt-5flex-column",style:{width:"150px","background-color":"#151515"}},Y=["src"],Z={class:"ms-3",style:{"margin-top":"30px"}},tt={style:{"text-align":"left","font-size":"50px"}},et=L('<br data-v-7cbfba13><div class="p-4 text-black" style="text-align:left;background-color:#151515;" data-v-7cbfba13><nav data-v-7cbfba13><ul data-v-7cbfba13><li data-v-7cbfba13><a href="" data-v-7cbfba13>Liked Albums</a></li></ul><br data-v-7cbfba13></nav><div class="photos" data-v-7cbfba13><img src="https://upload.wikimedia.org/wikipedia/en/6/6d/Dire_Straits_-_Alchemy_Dire_Straits_Live.jpg" alt="Photo" data-v-7cbfba13><img src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Random_Access_Memories.jpg/220px-Random_Access_Memories.jpg" data-v-7cbfba13><img src="https://mixdownmag.com.au/wp-content/uploads/2020/11/mixdown-magazine-kanye-west-mbdtf.jpg" data-v-7cbfba13><img src="https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png" data-v-7cbfba13><img src="https://upload.wikimedia.org/wikipedia/en/7/70/Graduation_%28album%29.jpg" data-v-7cbfba13><img src="https://americansongwriter.com/wp-content/uploads/2022/07/Kanye-West-album-cover-kids-see-ghosts.jpg" data-v-7cbfba13><img src="https://upload.wikimedia.org/wikipedia/en/6/6d/Dire_Straits_-_Alchemy_Dire_Straits_Live.jpg" alt="Photo" data-v-7cbfba13><img src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Random_Access_Memories.jpg/220px-Random_Access_Memories.jpg" data-v-7cbfba13><img src="https://mixdownmag.com.au/wp-content/uploads/2020/11/mixdown-magazine-kanye-west-mbdtf.jpg" data-v-7cbfba13><img src="https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png" data-v-7cbfba13><img src="https://upload.wikimedia.org/wikipedia/en/7/70/Graduation_%28album%29.jpg" data-v-7cbfba13><img src="https://americansongwriter.com/wp-content/uploads/2022/07/Kanye-West-album-cover-kids-see-ghosts.jpg" data-v-7cbfba13><img src="https://upload.wikimedia.org/wikipedia/en/6/6d/Dire_Straits_-_Alchemy_Dire_Straits_Live.jpg" alt="Photo" data-v-7cbfba13><img src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Random_Access_Memories.jpg/220px-Random_Access_Memories.jpg" data-v-7cbfba13><img src="https://mixdownmag.com.au/wp-content/uploads/2020/11/mixdown-magazine-kanye-west-mbdtf.jpg" data-v-7cbfba13><img src="https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png" data-v-7cbfba13><img src="https://upload.wikimedia.org/wikipedia/en/7/70/Graduation_%28album%29.jpg" data-v-7cbfba13><img src="https://americansongwriter.com/wp-content/uploads/2022/07/Kanye-West-album-cover-kids-see-ghosts.jpg" data-v-7cbfba13></div></div>',2),it=o(()=>t("br",null,null,-1)),st={key:1};function at(i,e,h,a,d,l){return this.isLoggedIn?(p(),u("div",U,[t("div",C,[t("div",D,[t("span",{class:"close",onClick:e[0]||(e[0]=s=>l.closeProfileEdit())},"×"),E,t("div",M,[g(t("input",{class:"form-control",id:"floatingInput",required:"","onUpdate:modelValue":e[1]||(e[1]=s=>d.newBio=s)},null,512),[[m,d.newBio]]),F]),q,t("div",z,[g(t("input",{class:"form-control",id:"floatingInput",required:"","onUpdate:modelValue":e[2]||(e[2]=s=>d.newURL=s)},null,512),[[m,d.newURL]]),T]),V,t("a",{onClick:e[3]||(e[3]=(...s)=>l.updateProfile&&l.updateProfile(...s)),class:"btn-get-started"},"Submit"),G,t("a",{onClick:e[4]||(e[4]=(...s)=>l.logout&&l.logout(...s)),class:"btn-get-started"},"Sign out")])]),K,t("body",null,[t("div",N,[t("div",W,[t("div",O,[t("div",$,[t("div",H,[t("div",X,[J,t("div",Q,[t("img",{src:this.pfpURL,alt:"Generic placeholder image",class:"img-fluid img-thumbnail mt-4 mb-2",style:{width:"150px","z-index":"1"}},null,8,Y),t("button",{type:"button",style:{"z-index":"1","background-color":"white","border-radius":"4px",border:"none",width:"150px"},onClick:e[5]||(e[5]=s=>l.openProfileEdit())}," Edit profile ")]),t("div",Z,[t("h2",tt,b(this.name),1),t("p",null,b(this.bio),1)])]),et])]),it])])])])])):(p(),u("div",st,[t("a",{onClick:e[6]||(e[6]=s=>l.opensignin()),class:"btn-get-started",style:{color:"black"}},"Log In"),t("a",{onClick:e[7]||(e[7]=s=>l.opensignup()),class:"btn-get-started",style:{color:"black"}},"Create")]))}const k=B(R,[["render",at],["__scopeId","data-v-7cbfba13"]]),ot={class:"wrapper"},lt={name:"AboutUs",components:{TheHeader:w,AccountPageBody:k,TheFooter:v}},ct=Object.assign(lt,{setup(i){return(e,h)=>(p(),u(I,null,[t("header",null,[r(w),t("div",ot,[r(k)])]),t("main",null,[r(v)])],64))}});export{ct as default};

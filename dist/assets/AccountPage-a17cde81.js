import{g as U,b as S,h as y,c as x,o as c,d as A,e as B,s as p,f as b,i as l,j as h,k as M,T as I,a as P}from"./TheFooter-1b93a497.js";import{_ as D,o as f,c as u,b as t,w as _,v as g,t as m,e as v,a as L,p as C,h as E,d as r,F}from"./index-2d47d71a.js";const j=U(x),w=S(x),z=y(j,"getProfileInfo"),k=y(j,"updateProfile"),T={data(){return{email:"",password:"",uid:"",isLoggedIn:!1,accountInfo:{},newBio:"",newURL:""}},created(){this.refresh()},watch:{"$route.params":{handler(){this.refresh()}}},methods:{opensignin(){c(0)},opensignup(){c(1)},openProfileEdit(){c(2)},closeProfileEdit(){A(2)},refresh(){this.accountInfo={},B(w,e=>{this.uid=e?e.uid:this.$route.params.uid,this.isLoggedIn=!!e,this.isLoggedIn&&this.uid!=null&&JSON.stringify(h())=="{}"?(console.log("Getting Profile From Server"),z({id:this.uid}).then(n=>{l(n.data),this.accountInfo=n.data}).catch(n=>{console.log(n.code),console.log(n.message)})):this.accountInfo=h()})()},logout(){p(this),w.signOut(),M(""),l({}),this.isLoggedIn=!1,b(),this.$router.push({path:"/AccountPage/"})},updateProfile(){p(this),this.newBio.length>0&&this.newURL.length>0?(this.updateBio(),this.updatePFP()):this.newBio.length>0?this.updateBio():this.newURL.length>0&&this.updatePFP(),this.closeProfileEdit(),this.refresh()},updateBio(){k({id:this.uid,field:"bio",value:this.newBio}).then(s=>{console.log(s.data.body),this.accountInfo.bio=this.newBio,l(this.accountInfo),this.newBio="",b()}).catch(s=>{console.log(s.code,s.message)})},updatePFP(){k({id:this.uid,field:"pfpURL",value:this.newURL}).then(s=>{console.log(s.data.body),this.accountInfo.pfpURL=this.newURL,l(this.accountInfo),this.newURL="",b()}).catch(s=>{console.log(s.code,s.message)})}},computed:{pfpURL(){return this.accountInfo.pfpURL?this.accountInfo.pfpURL:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}}},o=s=>(C("data-v-c7bbfbf0"),s=s(),E(),s),V={key:0},G={id:"myModal1",class:"modal"},N={style:{"align-items":"center"},class:"modal-content"},q=o(()=>t("h1",{class:"h3 mb-3 fw-normal",style:{color:"white","font-size":"40px"}},"Edit Profile",-1)),K={class:"form-floating"},O=o(()=>t("label",{for:"floatingInput"},"Edit Bio",-1)),W=o(()=>t("br",null,null,-1)),H={class:"form-floating"},J=o(()=>t("label",{for:"floatingInput"},"Change Profile Picture",-1)),X=o(()=>t("br",null,null,-1)),Y=o(()=>t("br",null,null,-1)),$=o(()=>t("head",null,[t("meta",{charset:"UTF-8"}),t("meta",{"http-equiv":"X-UA-Compatible",content:"IE=edge"}),t("meta",{name:"viewport",content:"width=device-width, initial-scale=1.0"})],-1)),Q={class:"header__wrapper",style:{"background-color":"black"}},Z={class:"cols__container",style:{"background-color":"#151515"}},tt={class:"right__col",style:{"background-color":"#151515"}},et={class:"left__col",style:{"background-color":"#151515"}},ot={class:"card",style:{"background-color":"#151515"}},st={class:"rounded-top text-white d-flex flex-row",style:{"background-color":"#151515",height:"200px"}},it=o(()=>t("div",{class:"dropdown"},null,-1)),at={class:"ms-4 mt-5flex-column",style:{width:"150px","background-color":"#151515"}},nt=["src"],dt={class:"ms-3",style:{"margin-top":"30px"}},lt={style:{"text-align":"left","font-size":"50px"}},ct=L('<br data-v-c7bbfbf0><div class="p-4 text-black" style="text-align:left;background-color:#151515;" data-v-c7bbfbf0><nav data-v-c7bbfbf0><ul data-v-c7bbfbf0><li data-v-c7bbfbf0><a href="" data-v-c7bbfbf0>Liked Albums</a></li></ul><br data-v-c7bbfbf0></nav><div class="photos" data-v-c7bbfbf0><img src="https://upload.wikimedia.org/wikipedia/en/6/6d/Dire_Straits_-_Alchemy_Dire_Straits_Live.jpg" alt="Photo" data-v-c7bbfbf0><img src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Random_Access_Memories.jpg/220px-Random_Access_Memories.jpg" data-v-c7bbfbf0><img src="https://mixdownmag.com.au/wp-content/uploads/2020/11/mixdown-magazine-kanye-west-mbdtf.jpg" data-v-c7bbfbf0><img src="https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png" data-v-c7bbfbf0><img src="https://upload.wikimedia.org/wikipedia/en/7/70/Graduation_%28album%29.jpg" data-v-c7bbfbf0><img src="https://americansongwriter.com/wp-content/uploads/2022/07/Kanye-West-album-cover-kids-see-ghosts.jpg" data-v-c7bbfbf0><img src="https://upload.wikimedia.org/wikipedia/en/6/6d/Dire_Straits_-_Alchemy_Dire_Straits_Live.jpg" alt="Photo" data-v-c7bbfbf0><img src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Random_Access_Memories.jpg/220px-Random_Access_Memories.jpg" data-v-c7bbfbf0><img src="https://mixdownmag.com.au/wp-content/uploads/2020/11/mixdown-magazine-kanye-west-mbdtf.jpg" data-v-c7bbfbf0><img src="https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png" data-v-c7bbfbf0><img src="https://upload.wikimedia.org/wikipedia/en/7/70/Graduation_%28album%29.jpg" data-v-c7bbfbf0><img src="https://americansongwriter.com/wp-content/uploads/2022/07/Kanye-West-album-cover-kids-see-ghosts.jpg" data-v-c7bbfbf0><img src="https://upload.wikimedia.org/wikipedia/en/6/6d/Dire_Straits_-_Alchemy_Dire_Straits_Live.jpg" alt="Photo" data-v-c7bbfbf0><img src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Random_Access_Memories.jpg/220px-Random_Access_Memories.jpg" data-v-c7bbfbf0><img src="https://mixdownmag.com.au/wp-content/uploads/2020/11/mixdown-magazine-kanye-west-mbdtf.jpg" data-v-c7bbfbf0><img src="https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png" data-v-c7bbfbf0><img src="https://upload.wikimedia.org/wikipedia/en/7/70/Graduation_%28album%29.jpg" data-v-c7bbfbf0><img src="https://americansongwriter.com/wp-content/uploads/2022/07/Kanye-West-album-cover-kids-see-ghosts.jpg" data-v-c7bbfbf0></div></div>',2),bt=o(()=>t("br",null,null,-1)),rt={key:1},ft={id:"hero",class:"hero",style:{height:"100%"}},ut=o(()=>t("br",null,null,-1)),pt=o(()=>t("br",null,null,-1)),ht=o(()=>t("br",null,null,-1)),_t=o(()=>t("br",null,null,-1)),gt=o(()=>t("br",null,null,-1)),mt=o(()=>t("br",null,null,-1)),vt=o(()=>t("br",null,null,-1)),wt=o(()=>t("br",null,null,-1)),kt=o(()=>t("br",null,null,-1)),yt={style:{color:"white"}},xt={style:{display:"inline"}},It={style:{display:"inline"}},Pt=L("<br data-v-c7bbfbf0><br data-v-c7bbfbf0><br data-v-c7bbfbf0><br data-v-c7bbfbf0><br data-v-c7bbfbf0><br data-v-c7bbfbf0><br data-v-c7bbfbf0><br data-v-c7bbfbf0><br data-v-c7bbfbf0><br data-v-c7bbfbf0><br data-v-c7bbfbf0><br data-v-c7bbfbf0><br data-v-c7bbfbf0><br data-v-c7bbfbf0><br data-v-c7bbfbf0><br data-v-c7bbfbf0><br data-v-c7bbfbf0><br data-v-c7bbfbf0><br data-v-c7bbfbf0><br data-v-c7bbfbf0><br data-v-c7bbfbf0><br data-v-c7bbfbf0>",22);function Lt(s,e,n,Ut,d,a){return this.isLoggedIn?(f(),u("div",V,[t("div",G,[t("div",N,[t("span",{class:"close",onClick:e[0]||(e[0]=i=>a.closeProfileEdit())},"×"),q,t("div",K,[_(t("input",{class:"form-control",id:"floatingInput",required:"","onUpdate:modelValue":e[1]||(e[1]=i=>d.newBio=i)},null,512),[[g,d.newBio]]),O]),W,t("div",H,[_(t("input",{class:"form-control",id:"floatingInput",required:"","onUpdate:modelValue":e[2]||(e[2]=i=>d.newURL=i)},null,512),[[g,d.newURL]]),J]),X,t("a",{onClick:e[3]||(e[3]=(...i)=>a.updateProfile&&a.updateProfile(...i)),class:"btn-get-started"},"Submit"),Y,t("a",{onClick:e[4]||(e[4]=(...i)=>a.logout&&a.logout(...i)),class:"btn-get-started"},"Sign out")])]),$,t("body",null,[t("div",Q,[t("div",Z,[t("div",tt,[t("div",et,[t("div",ot,[t("div",st,[it,t("div",at,[t("img",{src:this.pfpURL,alt:"Generic placeholder image",class:"img-fluid img-thumbnail mt-4 mb-2",style:{width:"150px","z-index":"1"}},null,8,nt),t("button",{type:"button",style:{"z-index":"1","background-color":"white","border-radius":"4px",border:"none",width:"150px"},onClick:e[5]||(e[5]=i=>a.openProfileEdit())}," Edit profile ")]),t("div",dt,[t("h2",lt,m(this.accountInfo.username),1),t("p",null,m(this.accountInfo.bio),1)])]),ct])]),bt])])])])])):(f(),u("div",rt,[t("section",ft,[ut,pt,ht,_t,gt,mt,vt,wt,kt,t("h5",yt,[v("You are not logged into your account. To login click "),t("h4",xt,[t("strong",null,[t("a",{onClick:e[6]||(e[6]=i=>a.opensignin())},"here")])]),v(" or to create an account click "),t("h4",It,[t("strong",null,[t("a",{onClick:e[7]||(e[7]=i=>a.opensignup())},"here")])])]),Pt])]))}const R=D(T,[["render",Lt],["__scopeId","data-v-c7bbfbf0"]]),jt={class:"wrapper"},Rt={name:"AboutUs",components:{TheHeader:I,AccountPageBody:R,TheFooter:P}},Bt=Object.assign(Rt,{setup(s){return(e,n)=>(f(),u(F,null,[t("header",null,[r(I),t("div",jt,[r(R)])]),t("main",null,[r(P)])],64))}});export{Bt as default};

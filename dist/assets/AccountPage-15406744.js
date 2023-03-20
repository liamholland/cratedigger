import{g as E,a as S,h as k,b as x,d as A,o as r,c as F,i as u,j as T,e as g,s as d,k as _,l as h,m as f,T as P,f as U}from"./TheFooter-2fd6c9df.js";import{_ as N,o as i,c as a,a as t,w as m,v as b,t as v,F as L,i as V,b as w,p as q,e as z,f as p}from"./index-794929be.js";const B=E(x),y=S(x),D=k(B,"getProfileInfo"),I=k(B,"updateProfile"),M={data(){return{email:"",password:"",uid:"",loggedIn:!1,accountInfo:{},newBio:"",newURL:""}},created(){A(y,o=>{o?(f(o.uid),this.loggedIn=!0):this.loggedIn=!1})()},watch:{loggedIn(){this.refresh()},"$route.params":{handler(){this.refresh()}}},methods:{opensignin(){r(0)},opensignup(){r(1)},openProfileEdit(){r(2)},closeProfileEdit(){F(2)},refresh(){this.accountInfo={},u()&&T()!=""&&JSON.stringify(g())=="{}"?(console.log("Getting Profile From Server"),D({field:null}).then(e=>{d(e.data),this.accountInfo=e.data,console.log(this.accountInfo)}).catch(e=>{console.log(e.code),console.log(e.message)})):this.accountInfo=g(),this.loggedIn=u()},logout(){_(this),y.signOut(),f(""),d({}),this.loggedIn=u(),h(),this.$router.push({path:"/AccountPage/"})},updateProfile(){_(this),this.newBio.length>0&&this.newURL.length>0?(this.updateBio(),this.updatePFP()):this.newBio.length>0?this.updateBio():this.newURL.length>0&&this.updatePFP(),this.closeProfileEdit(),this.refresh()},updateBio(){I({field:"bio",value:this.newBio}).then(e=>{console.log(e.data.body),this.accountInfo.bio=this.newBio,d(this.accountInfo),this.newBio="",h()}).catch(e=>{console.log(e.code,e.message)})},updatePFP(){I({field:"pfpURL",value:this.newURL}).then(e=>{console.log(e.data.body),this.accountInfo.pfpURL=this.newURL,d(this.accountInfo),this.newURL="",h()}).catch(e=>{console.log(e.code,e.message)})}},computed:{pfpURL(){return JSON.stringify(this.accountInfo)!="{}"&&this.accountInfo.pfpURL!=null?this.accountInfo.pfpURL:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}}},n=e=>(q("data-v-fc1763d4"),e=e(),z(),e),O={key:0},j={id:"myModal1",class:"modal"},G={style:{"align-items":"center"},class:"modal-content"},J=n(()=>t("h1",{class:"h3 mb-3 fw-normal",style:{color:"white","font-size":"40px"}},"Edit Profile",-1)),H={class:"form-floating"},X=n(()=>t("label",{for:"floatingInput"},"Edit Bio",-1)),Y=n(()=>t("br",null,null,-1)),K={class:"form-floating"},Q=n(()=>t("label",{for:"floatingInput"},"Change Profile Picture",-1)),W=n(()=>t("br",null,null,-1)),Z=n(()=>t("br",null,null,-1)),$=n(()=>t("head",null,[t("meta",{charset:"UTF-8"}),t("meta",{"http-equiv":"X-UA-Compatible",content:"IE=edge"}),t("meta",{name:"viewport",content:"width=device-width, initial-scale=1.0"})],-1)),tt={class:"header__wrapper",style:{"background-color":"black"}},et={class:"cols__container",style:{"background-color":"#151515"}},ot={class:"right__col",style:{"background-color":"#151515"}},st={class:"left__col",style:{"background-color":"#151515"}},nt={class:"card",style:{"background-color":"#151515"}},lt={class:"rounded-top text-white d-flex flex-row",style:{"background-color":"#151515",height:"200px"}},it=n(()=>t("div",{class:"dropdown"},null,-1)),at={class:"ms-4 mt-5flex-column",style:{width:"150px","background-color":"#151515"}},ct=["src"],dt={class:"ms-3",style:{"margin-top":"30px"}},rt={class:"display-5 fw-bold",style:{"font-size":"225%"}},ut=n(()=>t("br",null,null,-1)),ht={class:"p-4 text-black",style:{"text-align":"left","background-color":"#151515"}},pt=n(()=>t("nav",null,[t("ul",null,[t("li",null,[t("a",{href:""},"Liked Albums")])]),t("br")],-1)),gt={class:"photos"},_t=["src","alt"],ft=n(()=>t("br",null,null,-1)),mt=n(()=>t("div",{class:"col-lg-6 mx-auto",style:{"padding-top":"10%",width:"100vw",height:"60vh","background-color":"#151515"}},null,-1)),bt={key:1},vt={class:"px-4 py-5 text-center",style:{width:"100vw",height:"100vh",color:"white","background-color":"black"}},wt={class:"col-lg-6 mx-auto",style:{"padding-top":"10%"}},yt={class:"lead mb-4",style:{color:"white"}},It={style:{display:"inline"}},kt={style:{display:"inline"}},xt=n(()=>t("div",{class:"d-grid gap-2 d-sm-flex justify-content-sm-center"},null,-1));function Pt(e,o,C,Bt,c,l){return this.loggedIn?(i(),a("div",O,[t("div",j,[t("div",G,[t("span",{class:"close",onClick:o[0]||(o[0]=s=>l.closeProfileEdit())},"×"),J,t("div",H,[m(t("input",{class:"form-control",id:"floatingInput",required:"","onUpdate:modelValue":o[1]||(o[1]=s=>c.newBio=s)},null,512),[[b,c.newBio]]),X]),Y,t("div",K,[m(t("input",{class:"form-control",id:"floatingInput",required:"","onUpdate:modelValue":o[2]||(o[2]=s=>c.newURL=s)},null,512),[[b,c.newURL]]),Q]),W,t("a",{onClick:o[3]||(o[3]=(...s)=>l.updateProfile&&l.updateProfile(...s)),class:"btn-get-started"},"Submit"),Z,t("a",{onClick:o[4]||(o[4]=(...s)=>l.logout&&l.logout(...s)),class:"btn-get-started"},"Sign out")])]),$,t("body",null,[t("div",tt,[t("div",et,[t("div",ot,[t("div",st,[t("div",nt,[t("div",lt,[it,t("div",at,[t("img",{src:this.pfpURL,alt:"Generic placeholder image",class:"img-fluid img-thumbnail mt-4 mb-2",style:{height:"150px",width:"150px","z-index":"1"}},null,8,ct),t("button",{type:"button",style:{"z-index":"1","background-color":"white","border-radius":"4px",border:"none",width:"150px"},onClick:o[5]||(o[5]=s=>l.openProfileEdit())}," Edit profile ")]),t("div",dt,[t("h2",rt,v(this.accountInfo.username),1),t("p",null,v(this.accountInfo.bio),1)])]),ut,t("div",ht,[pt,t("div",gt,[(i(!0),a(L,null,V(this.accountInfo.likedAlbums,s=>(i(),a("img",{src:s.images[0].url,alt:s.name},null,8,_t))),256))])])])]),ft])])]),mt])])):(i(),a("div",bt,[t("section",vt,[t("div",wt,[t("h4",yt,[w("You are not logged into your account. To login click "),t("h3",It,[t("strong",null,[t("a",{onClick:o[6]||(o[6]=s=>l.opensignin())},"here")])]),w(" or to create an account click "),t("h3",kt,[t("strong",null,[t("a",{onClick:o[7]||(o[7]=s=>l.opensignup())},"here")])])]),xt])])]))}const R=N(M,[["render",Pt],["__scopeId","data-v-fc1763d4"]]),Ut={class:"wrapper"},Lt={name:"AboutUs",components:{TheHeader:P,AccountPageBody:R,TheFooter:U}},Et=Object.assign(Lt,{setup(e){return(o,C)=>(i(),a(L,null,[t("header",null,[p(P),t("div",Ut,[p(R)])]),t("main",null,[p(U)])],64))}});export{Et as default};
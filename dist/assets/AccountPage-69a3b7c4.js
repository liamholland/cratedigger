import{g as R,a as C,h as y,b as I,d as E,o as r,c as S,e as p,s as d,j as g,k as u,T as k,f as x}from"./TheFooter-2c478b53.js";import{_ as A,o as i,c as a,a as t,w as _,v as f,t as m,F as P,i as F,b,p as T,e as N,f as h}from"./index-df78512b.js";const U=R(I),v=C(I),V=y(U,"getProfileInfo"),w=y(U,"updateProfile"),q={data(){return{email:"",password:"",loggedIn:!1,accountInfo:{},newBio:"",newURL:""}},created(){E(v,o=>{o?this.loggedIn=!0:this.loggedIn=!1})()},watch:{loggedIn(){this.refresh()},"$route.params":{handler(){this.refresh()}}},methods:{opensignin(){r(0)},opensignup(){r(1)},openProfileEdit(){r(2)},closeProfileEdit(){S(2)},refresh(){this.accountInfo={},this.$route.params.name&&JSON.stringify(p())=="{}"?(this.loggedIn=!0,console.log("Getting Profile From Server"),V({field:null}).then(e=>{d(e.data),this.accountInfo=e.data,console.log(this.accountInfo)}).catch(e=>{console.log(e.code),console.log(e.message)})):this.$route.params.name?(this.loggedIn=!0,this.accountInfo=p()):this.loggedIn=!1},logout(){g(this),v.signOut(),d({}),this.loggedIn=!1,u(),this.$router.push({path:"/AccountPage/"})},updateProfile(){g(this),this.newBio.length>0&&this.newURL.length>0?(this.updateBio(),this.updatePFP()):this.newBio.length>0?this.updateBio():this.newURL.length>0&&this.updatePFP(),this.closeProfileEdit(),this.refresh()},updateBio(){w({field:"bio",value:this.newBio}).then(e=>{console.log(e.data.body),this.accountInfo.bio=this.newBio,d(this.accountInfo),this.newBio="",u()}).catch(e=>{console.log(e.code,e.message)})},updatePFP(){w({field:"pfpURL",value:this.newURL}).then(e=>{console.log(e.data.body),this.accountInfo.pfpURL=this.newURL,d(this.accountInfo),this.newURL="",u()}).catch(e=>{console.log(e.code,e.message)})}},computed:{pfpURL(){return JSON.stringify(this.accountInfo)!="{}"&&this.accountInfo.pfpURL!=null?this.accountInfo.pfpURL:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}}},n=e=>(T("data-v-ed504ce0"),e=e(),N(),e),z={key:0},M={id:"myModal1",class:"modal"},O={style:{"align-items":"center"},class:"modal-content"},j=n(()=>t("h1",{class:"h3 mb-3 fw-normal",style:{color:"white","font-size":"40px"}},"Edit Profile",-1)),D={class:"form-floating"},G=n(()=>t("label",{for:"floatingInput"},"Edit Bio",-1)),J=n(()=>t("br",null,null,-1)),$={class:"form-floating"},H=n(()=>t("label",{for:"floatingInput"},"Change Profile Picture",-1)),X=n(()=>t("br",null,null,-1)),Y=n(()=>t("br",null,null,-1)),K=n(()=>t("head",null,[t("meta",{charset:"UTF-8"}),t("meta",{"http-equiv":"X-UA-Compatible",content:"IE=edge"}),t("meta",{name:"viewport",content:"width=device-width, initial-scale=1.0"})],-1)),Q={class:"header__wrapper",style:{"background-color":"black"}},W={class:"cols__container",style:{"background-color":"#151515"}},Z={class:"right__col",style:{"background-color":"#151515"}},tt={class:"left__col",style:{"background-color":"#151515"}},et={class:"card",style:{"background-color":"#151515"}},ot={class:"rounded-top text-white d-flex flex-row",style:{"background-color":"#151515",height:"200px"}},st=n(()=>t("div",{class:"dropdown"},null,-1)),nt={class:"ms-4 mt-5flex-column",style:{width:"150px","background-color":"#151515"}},lt=["src"],it={class:"ms-3",style:{"margin-top":"30px"}},at={class:"display-5 fw-bold",style:{"font-size":"225%"}},ct=n(()=>t("br",null,null,-1)),dt={class:"p-4 text-black",style:{"text-align":"left","background-color":"#151515"}},rt=n(()=>t("nav",null,[t("ul",null,[t("li",null,[t("a",{href:""},"Liked Albums")])]),t("br")],-1)),ut={class:"photos"},ht=["src","alt"],pt=n(()=>t("br",null,null,-1)),gt=n(()=>t("div",{class:"col-lg-6 mx-auto",style:{"padding-top":"10%",width:"100vw",height:"60vh","background-color":"#151515"}},null,-1)),_t={key:1},ft={class:"px-4 py-5 text-center",style:{width:"100vw",height:"100vh",color:"white","background-color":"black"}},mt={class:"col-lg-6 mx-auto",style:{"padding-top":"10%"}},bt={class:"lead mb-4",style:{color:"white"}},vt={style:{display:"inline"}},wt={style:{display:"inline"}},yt=n(()=>t("div",{class:"d-grid gap-2 d-sm-flex justify-content-sm-center"},null,-1));function It(e,o,B,Pt,c,l){return this.loggedIn?(i(),a("div",z,[t("div",M,[t("div",O,[t("span",{class:"close",onClick:o[0]||(o[0]=s=>l.closeProfileEdit())},"×"),j,t("div",D,[_(t("input",{class:"form-control",id:"floatingInput",required:"","onUpdate:modelValue":o[1]||(o[1]=s=>c.newBio=s)},null,512),[[f,c.newBio]]),G]),J,t("div",$,[_(t("input",{class:"form-control",id:"floatingInput",required:"","onUpdate:modelValue":o[2]||(o[2]=s=>c.newURL=s)},null,512),[[f,c.newURL]]),H]),X,t("a",{onClick:o[3]||(o[3]=(...s)=>l.updateProfile&&l.updateProfile(...s)),class:"btn-get-started"},"Submit"),Y,t("a",{onClick:o[4]||(o[4]=(...s)=>l.logout&&l.logout(...s)),class:"btn-get-started"},"Sign out")])]),K,t("body",null,[t("div",Q,[t("div",W,[t("div",Z,[t("div",tt,[t("div",et,[t("div",ot,[st,t("div",nt,[t("img",{src:this.pfpURL,alt:"Generic placeholder image",class:"img-fluid img-thumbnail mt-4 mb-2",style:{height:"150px",width:"150px","z-index":"1"}},null,8,lt),t("button",{type:"button",style:{"z-index":"1","background-color":"white","border-radius":"4px",border:"none",width:"150px"},onClick:o[5]||(o[5]=s=>l.openProfileEdit())}," Edit profile ")]),t("div",it,[t("h2",at,m(this.accountInfo.username),1),t("p",null,m(this.accountInfo.bio),1)])]),ct,t("div",dt,[rt,t("div",ut,[(i(!0),a(P,null,F(this.accountInfo.likedAlbums,s=>(i(),a("img",{src:s.images[0].url,alt:s.name},null,8,ht))),256))])])])]),pt])])]),gt])])):(i(),a("div",_t,[t("section",ft,[t("div",mt,[t("h4",bt,[b("You are not logged into your account. To login click "),t("h3",vt,[t("strong",null,[t("a",{onClick:o[6]||(o[6]=s=>l.opensignin())},"here")])]),b(" or to create an account click "),t("h3",wt,[t("strong",null,[t("a",{onClick:o[7]||(o[7]=s=>l.opensignup())},"here")])])]),yt])])]))}const L=A(q,[["render",It],["__scopeId","data-v-ed504ce0"]]),kt={class:"wrapper"},xt={name:"AboutUs",components:{TheHeader:k,AccountPageBody:L,TheFooter:x}},Bt=Object.assign(xt,{setup(e){return(o,B)=>(i(),a(P,null,[t("header",null,[h(k),t("div",kt,[h(L)])]),t("main",null,[h(x)])],64))}});export{Bt as default};

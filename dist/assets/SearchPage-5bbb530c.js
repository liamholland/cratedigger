import{g,h as i,c as k,T as _,a as h}from"./TheFooter-2b55af18.js";import{_ as f,o,c,b as t,w as v,v as y,F as u,i as S,t as x,p as B,h as T,d as r}from"./index-61ddf6ad.js";const d=g(k),w=i(d,"searchArtist"),I={data(){return{token:"",input:"",results:[]}},created(){i(d,"getSpotifyToken")().then(s=>{this.token=s.data.access_token,console.log(this.token)}).catch(s=>{console.log(s)})},methods:{search(n){n.length>0?w({token:this.token,term:n,limit:10}).then(s=>{this.results=s.data.artists.items}).catch(s=>{console.log(s)}):this.results=[]},setImage(n){return n.length>0?n[0].url:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}}},e=n=>(B("data-v-ad607121"),n=n(),T(),n),$={id:"SearchBar",class:"SearchPage"},F={class:"center"},A=e(()=>t("br",null,null,-1)),C={id:"results"},V=["onClick"],D=["src","alt"],N=e(()=>t("br",null,null,-1)),O=e(()=>t("br",null,null,-1)),P=e(()=>t("br",null,null,-1)),j=e(()=>t("br",null,null,-1)),E=e(()=>t("br",null,null,-1)),H=e(()=>t("br",null,null,-1)),K=e(()=>t("br",null,null,-1)),L=e(()=>t("br",null,null,-1)),M=e(()=>t("br",null,null,-1)),R=e(()=>t("br",null,null,-1)),U=e(()=>t("br",null,null,-1)),W=e(()=>t("br",null,null,-1)),q=e(()=>t("br",null,null,-1)),z=e(()=>t("br",null,null,-1)),G=e(()=>t("br",null,null,-1)),J=e(()=>t("br",null,null,-1)),Q=e(()=>t("section",null,null,-1));function X(n,s,m,tt,a,b){return o(),c(u,null,[t("section",$,[t("h2",F,[v(t("input",{"onUpdate:modelValue":s[0]||(s[0]=l=>a.input=l),onKeyup:s[1]||(s[1]=l=>b.search(this.input)),placeholder:"What artist do you want to see?",type:"search",style:{width:"50%",height:"50px"}},null,544),[[y,a.input]])]),A,t("ul",C,[(o(!0),c(u,null,S(a.results,l=>(o(),c("li",null,[t("div",{class:"artistResult",onClick:et=>this.$router.push({name:"ArtistPage",params:{aid:l.id}})},[t("img",{src:this.setImage(l.images),alt:l.name},null,8,D),t("h1",null,x(l.name),1)],8,V)]))),256))]),N,O,P,j,E,H,K,L,M,R,U,W,q,z,G,J]),Q],64)}const p=f(I,[["render",X],["__scopeId","data-v-ad607121"]]),Y={class:"wrapper"},Z={name:"BlogOne",components:{TheHeader:_,SearchBody:p,TheFooter:h}},lt=Object.assign(Z,{setup(n){return(s,m)=>(o(),c(u,null,[t("header",null,[r(_),t("div",Y,[r(p)])]),t("main",null,[r(h)])],64))}});export{lt as default};

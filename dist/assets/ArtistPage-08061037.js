import{g as A,h as u,c as v,r as m,u as p,T as b,a as f}from"./TheFooter-765efb3e.js";import{_ as w,o as c,c as h,b as e,t as i,F as R,i as y,g as N,p as x,h as T,d as g}from"./index-ae510b85.js";const _=A(v),$=u(_,"getSpotifyToken"),C=u(_,"getArtist"),S=u(_,"getAlbums"),B=u(_,"getRelatedArtists"),F=u(_,"getUnrelatedArtists"),P={data(){return{artistName:"",genres:"",albums:[],mostRelated:"",leastRelated:""}},created(){this.refresh(this.$route.params.aid)},methods:{refresh(s){$().then(t=>{C({token:t.data.access_token,id:s}).then(a=>{this.artistName=a.data.name,this.genres="",a.data.genres.forEach(o=>{this.genres+=o+"   "}),S({token:t.data.access_token,id:s}).then(o=>{this.albums=o.data.items.sort(this.compareDates),B({token:t.data.access_token,id:s}).then(n=>{let l=0;do if(this.mostRelated=n.data.artists[l],l++,l==20){this.refresh(n.data.artists[19].id);return}while(m(this.mostRelated.name));p(this.mostRelated.name)}).catch(n=>{console.log(n)}),F({token:t.data.access_token,limit:5,genres:a.data.genres}).then(n=>{console.log(n.data);let l=0;do this.leastRelated=n.data[l],l++;while(m(this.leastRelated.name));p(this.leastRelated.name)}).catch(n=>{console.log(n)})}).catch(o=>{console.log(o)})}).catch(a=>{console.log(a)})}).catch(t=>{console.log(t)})},isRepeat(s){let t=this.albums.indexOf(s);if(t==0)return!1;if(t!=-1){let a=this.albums[t-1];return s.name==a.name}},compareDates(s,t){let a=new Date(s.release_date),o=new Date(t.release_date);return a<o?-1:a>o?1:0},goToNewArtist(s){this.$router.push({name:"ArtistPage",params:{aid:s}}),this.refresh(s)}}},d=s=>(x("data-v-27ebed0b"),s=s(),T(),s),D={class:"body"},I=d(()=>e("br",null,null,-1)),U={class:"artistName"},V={class:"artistGenre"},E=d(()=>e("br",null,null,-1)),O=d(()=>e("br",null,null,-1)),j=d(()=>e("br",null,null,-1)),z=d(()=>e("br",null,null,-1)),G={style:{"background-color":"black"}},H={key:0,class:"albumResult"},L=["src"],M={class:"albumInfo"},q=d(()=>e("button",{type:"button",class:"btn btn-outline-danger",style:{position:"absolute",left:"72.5%"}},[e("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",class:"bi bi-heart-fill",viewBox:"0 0 16 16"},[e("path",{"fill-rule":"evenodd",d:"M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"})])],-1));function J(s,t,a,o,n,l){return c(),h("section",D,[I,e("p",U,i(this.artistName),1),e("p",V,i(this.genres),1),e("button",{class:"btn-get-started",onClick:t[0]||(t[0]=r=>l.goToNewArtist(this.mostRelated.id))},"Related Artist: "+i(this.mostRelated.name),1),e("button",{class:"btn-get-started",onClick:t[1]||(t[1]=r=>l.goToNewArtist(this.leastRelated.id))},"Unrelated Artist: "+i(this.leastRelated.name),1),E,O,j,z,e("ul",G,[(c(!0),h(R,null,y(this.albums,r=>(c(),h("li",null,[this.isRepeat(r)?N("",!0):(c(),h("div",H,[e("img",{src:r.images[0].url,alt:"Album Cover"},null,8,L),e("div",M,[q,e("h1",null,i(r.name),1),e("h3",null,i(r.release_date),1)])]))]))),256))])])}const k=w(P,[["render",J],["__scopeId","data-v-27ebed0b"]]),K={class:"wrapper"},Q={name:"ArtistPage",components:{TheHeader:b,ArtistPageBody:k,TheFooter:f}},Y=Object.assign(Q,{setup(s){return(t,a)=>(c(),h(R,null,[e("header",null,[g(b),e("div",K,[g(k)])]),e("main",null,[g(f)])],64))}});export{Y as default};

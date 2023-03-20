function loadPage(component) {
    // '@' is aliased to src/components
    return () => import(/* webpackChunkName: "[request]" */
        `@/pages/${component}.vue`)
}
export default [
    { path: '/', component: loadPage('HomePage') },
    { path: '/Search', component: loadPage('SearchPage') },
    { path: '/AboutUs', component: loadPage('AboutUs') },
    { path: '/Account/:name/', name: "AccountPage", component: loadPage('AccountPage'), props: (route) => { name: route.params.name } },
    { path: '/Account/', component: loadPage('AccountPage') },
    { path: '/Artist/:aid/', name: "ArtistPage", component: loadPage('ArtistPage'), props: (route) => { aid: route.params.aid } },
    { path: '/New', component: loadPage('WhatsNew') },
    { path: '/Recommend', component: loadPage('RecommendingPage') },
]
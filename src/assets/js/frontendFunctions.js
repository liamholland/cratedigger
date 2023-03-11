let loadingBar = "";
let loadingInstances = -1;

export function startLoad(component){
    loadingInstances++;
    loadingBar = component.$loading.show();
}

export function endLoad(){
    if(loadingInstances >= 0){
        loadingBar.hide();
        loadingInstances--;
    }
}

//these functions still have to have a method to call them in the methods section
//opens the popup windows on the page
export function openModal(modal) {
    //gets an array of all the popups in the order they are defined on the page
    let elms = document.querySelectorAll('.modal');
    //shows the one you want to show
    elms[modal].style.display = "flex";
}

//closes the popup windows on the page
export function closeModal(modal){
    //gets an array of all the popups in the order they are defined on the page
    let elms = document.querySelectorAll('.modal');
    //hides the one you want to hide
    elms[modal].style.display = "none";
}

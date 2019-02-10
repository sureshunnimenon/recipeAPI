// Global app controller
// import x from './test';
// const num = 23; 
// console.log(`I imported ${x} from another module, variable x is: ${num}`);

// API Key: e4ce8fb2652de0f6b50993918a105252 
// API query:  https://www.food2fork.com/api/search
global._babelPolyfill = false;

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes'
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';
// global state of app, where all data resides in one object
// Search object
// current recipe object
// shopping list object
// liked recipes

const state = {}

// search controller 

const controlSearch = async () => {
    // 1. get query from the view
    const query = searchView.getInput();

    // const query = 'pizza';
    // console.log(query); //TODO
    if(query){
        // 2. new search object and add to state
        state.search = new Search(query)

        //3. prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        
        //4. search for recipes
        await state.search.getResults();
        console.log(state.search.getResults());

        //5. rrender results on UI
        // console.log(state.search.result);
        clearLoader();
        searchView.renderResults(state.search.result);
    }

}
elements.searchQuery.addEventListener('submit', (e) => {
    e.preventDefault();
    controlSearch();
})

// testing

window.addEventListener('load', (e) => {
    e.preventDefault();
    controlSearch();
})

elements.searchResPages.addEventListener('click', e => {
    // console.log(e.target);
    const btn = e.target.closest('.btn-inline');
    console.log(btn);
    if(btn){
        const gotoPage = parseInt(btn.dataset.goto,10);
        searchView.clearResults();
        searchView.renderResults(state.search.result,gotoPage)
        console.log(gotoPage);
    }

})

// reciepe controller

// below is just for testing initially 

// const r = new Recipe(54454)
// r.getRecipe();
// console.log(r)

// testing over

const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');
    // console.log(id);

    if (id){
        // prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //highlight the selected recipe
        // if(state.search) {searchView.highlightSelected(id)};


        // create new recipe object
        try {
            state.recipe = new Recipe(id);

            // for testing only
            // window.r = state.recipe;

            // Get recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // calc servings and time
            state.recipe.calcServings();
            state.recipe.calcTime();


            // render the recipe
            console.log(state.recipe);
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked());
        }
        catch(err){
            console.log(err);
       }       

    }
}

window.addEventListener('hashchange', controlRecipe);
window.addEventListener('load', controlRecipe);

// List controller

const controlList = () => {
    // create a new list if none exist
    if(!state.list) state.list = new List();

    // add each ingredient in the list
    state.recipe.ingredients.forEach( el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient)
        listView.renderItem(item);
    })
}

// handle update and delete

elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //handle delete event
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        state.list.deleteItem(id);

        // delete from UI
        listView.deleteItem(id);
    }
    // handle count update
    else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value)
        state.list.updateCount(id, val);
    }
})

// LIKES Controller
// state.likes = new Likes(); // for testing only... will be removed after data persistence done
// likesView.toggleLikeMenu(state.likes.getNumLikes()); // testing time only
const controlLike = () => {
    console.log('Like clicked!')
    if (!state.likes){
        state.likes = new Likes();
    }
    
    const currentID = state.recipe.id;
    // user hasnt yet liked current receipt
    if(!state.likes.isLiked(currentID)){
        // add like to data state
        const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.author, state.recipe.img)

        // toggle like buton
        likesView.toggleLikeBtn(true);

        // add like to UI list
        console.log(state.likes)
        likesView.renderLike(newLike);
    }
    // user has liked curent receipt
    else {
        // remove like from state
        state.likes.deleteLike(currentID);

        // toggle like button
        likesView.toggleLikeBtn(false);

        // remove like from UI list
        console.log('like removed')
        console.log(state.likes);
        likesView.deleteLike(currentID);
    }   
}

// handle reloading of page, where localstorage data is stored into the state object

window.addEventListener('load', () => {
    state.likes = new Likes(); 
    console.log("inside page load event listener, am I working?")

    // restore the data
    state.likes.readStorage();
    console.log(state.likes);

    //toggle button- like menu
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // render existing likes 
    state.likes.likes.forEach(like => likesView.renderLike(like));
})

// handling recipe button clicks 
elements.recipe.addEventListener('click', (e) => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        // decrease button is pressed
        if (state.recipe.servings > 1){
        state.recipe.updateServings('dec')
        console.log("minus clicked!!!")
        recipeView.updateServingsIngredients(state.recipe)        
        }
    }
    
    else if(e.target.matches('.btn-increase, .btn-increase *')) {
        // console.log("where the f am I")
         // increase btn is pressed
         state.recipe.updateServings('inc')
         console.log("Plus cllicked!!!")
         recipeView.updateServingsIngredients(state.recipe)
    }

    else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // add ingredients to shopping list
        controlList();
        console.log('inside shoppping list add btn')
    }

    else if(e.target.matches('.recipe__love, .recipe__love *')){
        // like controller

        controlLike();
    }

    else {
        console.log("where the f am I")
        controlList();
    }

    // console.log(state.recipe)
})

// const l = new List();
window.l = new List();



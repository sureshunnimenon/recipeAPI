import { elements } from "./base";

export const getInput = () => {
    return elements.searchInput.value;
}

export const clearInput = () => {
    elements.searchInput.value = '';
}

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
}

// export const highlightSelected = (id) => {
//     document.querySelector(`a[href*="${id}"]`).classList.add('results__link--active')
//     // check later  above is not working
// }

const limitTitle = (title, limit=17) => {
    const newTitle = [];
    if(title.length  > limit){
        title.split(' ').reduce((acc, curr) => {
            if(acc + curr.length <= limit ){
                newTitle.push(curr);
            }

            return acc + curr.length;
        },0);
        // return the result
        return `${newTitle.join(' ')}...`;

    }
    return title;
}
const renderRecipe = (recipe) => {
    const markup = `
        <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
        </li>    
    `;

    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

// type can be prev or next both strings
const createBtn = (page, type) => `            
            <button class="btn-inline results__btn--${type}" data-goto = ${type == 'prev' ? page-1: page+1}>
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-triangle-${type == 'prev' ? 'left' : 'right'}"></use>
                </svg>
                <span>Page ${type == 'prev' ? page-1: page+1 }</span>
            </button>
            
`;

const renderButtons = (page, numResults, resPerPage) => {
    const noPages = Math.ceil(numResults/ resPerPage);
    console.log("No of pages, current page, and total results are :", noPages, page, numResults )

    let button;
    if(page===1 && noPages > 1 ){
        //button to go to next page 
        console.log('first page')
        button = createBtn(page, 'next')
    }

    else if (page < noPages){
        // both pages 
        button = `
        ${button = createBtn(page, 'next')}
        ${button = createBtn(page, 'prev')};
        `;
        console.log('mid pages', page)
    }
    else if (page === noPages && noPages > 1){
        // only button to go to previous page   
        button = createBtn(page, 'prev');
        console.log('last page')
    }

    else { console.log('where am i man :)', "current page" , page, "No of pages" , noPages)}
    
    elements.searchResPages.insertAdjacentHTML('afterbegin', button)
}

export const renderResults = (recipes, page=2, resPerPage=5) => {

    // render results of current page 
    const start = (page-1) * resPerPage;
    const end = page * resPerPage;
    console.log(recipes.length, start, end, resPerPage)
    // take part of array
    recipes.slice(start,end).forEach(renderRecipe);
    console.log(recipes.slice(start,end).length)
    console.log("now the length of recipes array is:", 
    recipes.length);
    // render pagination buttons
    renderButtons(page, recipes.length, resPerPage)
}
import { elements } from './base';
export const toggleLikeBtn = (isLiked) => {
    // icons heart outlined
    // icons.svg#icon-heart-outlined
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';

    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
}

export const toggleLikeMenu = (numLikes) => {
    elements.likesMenu.style.visibiity = numLikes>0 ? 'visible' : 'hidden';
}

export const renderLike = like => {
    const markup = `
            <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.image}" alt="Test">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${like.title}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
            </li>   
    `;
    elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = id => {
    const el = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
    console.log(el);
    if (el) el.parentElement.removeChild(el)
}
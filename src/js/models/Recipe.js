import axios from 'axios';
import { keys } from '../config/keys';

export default class Recipe{
    constructor(id){
        this.id = id;
    };

    async getRecipe() {
        try {
            const res = await axios(`https://www.food2fork.com/api/get?key=${keys.APIKey}&rId=${this.id}`)
            // console.log(res);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        }
        catch(err) {
            console.log(err);
            alert('Something went wrong :(')
        }
    }

    calcTime(){
        const noIngredients = this.ingredients.length; 
        const periods = Math.ceil(noIngredients / 3);  // 15 mins for 3 ingredients 
        this.time=periods * 15; 
    }

    calcServings(){
        this.servings = 4; 
    }

    parseIngredients(){
        const newIngredients = this.ingredients.map(el => {

            const unitsLong = ["canola", 'tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'cup','pounds']
            const unitsShort = ["cnl",'tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'lb']

            const units = [...unitsShort, 'kg', 'g']
            // 1.uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit,i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            //2. remove parenthesis
            ingredient = ingredient.replace('/\s*\([^)]*\)/', " ");

            //3. parse ingredients nto count, unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));
            let objIng;
            if (unitIndex > -1){
                    // there is a unit
                    const arrCount = arrIng.slice(0, unitIndex);

                    let count;
                    if(arrCount.length === 1){
                        count = eval(arrIng[0].replace('-', '+'));
                    }
                    else {
                        count = eval(arrIng.slice(0, unitIndex).join('+'));
                    }
            objIng = {
                count,
                unit: arrIng[unitIndex],
                ingredient: arrIng.slice(unitIndex+1).join(' ')
            }
            }


            else if (parseInt(arrIng[0],10)){
                // there is no unit linked element measure, but 1st element is number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                         }

            }
            else if(unitIndex === -1){
                //there is no unit and no number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient, // ES6 style equal to ingredient : ingredient

                }

            }

            return objIng;
        });
        this.ingredients = newIngredients;
    }

    updateServings(type){
        // servings
        const newServings = type === 'dec' ? this.servings-1: this.servings+1;

        //ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings/ this.servings);
        });
        this.servings = newServings
    }
}
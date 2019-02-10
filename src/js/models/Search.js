import axios from 'axios';
import { keys } from '../config/keys';

export default class Search {
    constructor(query){
        this.query = query;
    }
    
    async getResults(){
    
    try {
        
        const res = await axios(`https://www.food2fork.com/api/search?key=${keys.APIKey}&q=${this.query}`);
        // console.log(res);
        this.result = res.data.recipes;
        // console.log(this.result);
    }
    catch(error) {
        alert(error);
        // console.log(error);
    }    
}
}


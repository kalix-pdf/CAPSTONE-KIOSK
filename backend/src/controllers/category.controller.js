import * as categoryServices from '../services/category.services.js';

export const CategoryAdd = async(req, res) => {
    try {
        const result = await categoryServices.addNewCategory(req.body);
        res.status(200).json(result);
    } catch(error) {
        throw error;
    }
}

export const categoryDelete = async(req, res) => {
    try {
        const result = await categoryServices.deleteCategoryByID(req.params.category_id);
        res.status(200).json(result);

    } catch(error){
        throw error;
    }
}
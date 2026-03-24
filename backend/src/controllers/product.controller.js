import { parse } from 'dotenv';
import * as productService from '../services/product.service.js';


export const ProductUpdate = async (req, res) => {
    try {
        const result = await productService.updateProduct(req.body);
        res.status(200).json(result);

    } catch (error) {
        throw error;
    }
}

export const AddNewProduct = async (req, res) => {
    try {
        const result = await productService.addProduct(req.body);
        res.status(200).json(result);

    } catch (error) {
        throw error;
    }
}

export const ProductDeactivate = async (req, res) => {
    try {
        const result = await productService.deactivateProduct(req.body);
        res.status(200).json(result);

    } catch (error) {
        throw error;
    }
}
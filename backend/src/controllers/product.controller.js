import { parse } from 'dotenv';
import * as productService from '../services/product.service.js';
import { deleteFromCloudinary, uploadToCloudinary } from "../config/cloudinary.config.js";

export const ProductUpdate = async (req, res) => {
    try {
        let imageUrl;
        let publicId;

        if (req.file) {
            const { public_id = "" } = req.body;

            if (public_id) {
                await deleteFromCloudinary(public_id);
            }

            const cloudinaryResult = await uploadToCloudinary(
                req.file.buffer,
                "events",
                public_id ?? null  
            );
            imageUrl = cloudinaryResult.secure_url;
            publicId = cloudinaryResult.public_id;
        }
        
        const result = await productService.updateProduct(req.body, imageUrl, publicId);
        res.status(200).json(result);

    } catch (error) {
        throw error;
    }
}

export const AddNewProduct = async (req, res) => {
    try {
        let image_url = "";
        let public_id = ""

        if (req.file){
            const cloudinaryResult = await uploadToCloudinary(req.file.buffer); 
            image_url = cloudinaryResult.secure_url;
            public_id = cloudinaryResult.public_id;
        } else {
            image_url = req.body.image;
            public_id = req.body.public_id;
        }

        const result = await productService.addProduct(req.body, image_url, public_id);
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
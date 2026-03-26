import { parse } from 'dotenv';
import * as productService from '../services/product.service.js';
import { deleteFromCloudinary, uploadToCloudinary } from "../config/cloudinary.config.js";

export const ProductUpdate = async (req, res) => {
    try {
        let imageUrl;
        let publicId;

        if (req.file) {
            const { existingPublicId = "" } = req.body;

            if (existingPublicId) {
                await deleteFromCloudinary(existingPublicId);
            }

            const cloudinaryResult = await uploadToCloudinary(
                req.file.buffer,
                "events",
                existingPublicId ?? null  
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
        if (!req.file) return res.status(400).json({ message: "Image upload failed" });
        
        const cloudinaryResult = await uploadToCloudinary(req.file.buffer); 
        const image = cloudinaryResult.secure_url;
        const public_id = cloudinaryResult.public_id;

        const result = await productService.addProduct(req.body, image, public_id);
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
import db from "../config/db.js";
import bcrypt from "bcrypt";


export const updateProduct = async(productData, image_url, public_id) => {
    const { id, name, dosage, prescriptionrequired, manufacturer, barcode, price, 
            stock, type, active_ingredients } = productData
        
    if (!id) throw new Error("Product ID is required");

    const client = await db.connect();

    const category = parseInt(productData.category);

    try {
        const query = `UPDATE product SET name = $1, category = $2, dosage = $3, prescriptionrequired = $4, manufacturer = $5,
                    barcode = $6, price = $7, stock = $8 WHERE id = $9`;
    
        await client.query("BEGIN");
        const result = await client.query(query, [name, category, dosage, prescriptionrequired, manufacturer, barcode, price, stock, id]);
        
        if (result.rowCount === 0) {
            return { success: false, message: "No product found with that ID" };
        }

        if (id) {
            const descriptipQuery = `UPDATE product_description SET active_ingredients = $1, 
                                    type = $2, image_url = $3, public_id = $4 WHERE product_id = $5`;
            const descriptionResult = await client.query(descriptipQuery, [active_ingredients, type, image_url, public_id, id]);
        
            if (descriptionResult.rowCount === 0) {
                await client.query("ROLLBACK");
                return { success: false, message: "No product description found with that ID" };
            }
        }
        
        await client.query("COMMIT");

        return { success: true, message: "Updated successfully", product_id: id }

    } catch (error) {
        await client.query("ROLLBACK");
        return { success: false, message: error }

    } finally {
        client.release();
    }
    
}

export const addProduct = async(newProduct, image_url, public_id) => {
    const { name, dosage, prescriptionrequired, manufacturer, barcode, price, active_ingredients,
            stock, type  } = newProduct

    const isEmpty = (val) => val === null || val === undefined || val === '';

    if (isEmpty(name) || isEmpty(dosage) || isEmpty(prescriptionrequired) || 
        isEmpty(manufacturer) || isEmpty(barcode) || isEmpty(price) || 
        isEmpty(stock) || isEmpty(type)) {
        throw new Error("All fields are Required!");
    }

    const client = await db.connect();
    
    const category = parseInt(newProduct.category)

    try {
        const addProductQuery = `INSERT INTO product(name, category, dosage, prescriptionrequired, manufacturer, barcode, price, stock, status) 
                                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, '1') RETURNING id`
        await client.query("BEGIN");
        const result = await client.query(addProductQuery, [name, category, dosage, prescriptionrequired, manufacturer, barcode, price, stock]);

        if (result.rowCount === 0) {
            return { success: false, message: "Failed to save" }
        }

        const product_id = result.rows[0].id;

        if (product_id) {
            const descriptionQuery = `INSERT INTO product_description(product_id, active_ingredients, type, image_url, public_id)
                                     VALUES($1, $2, $3, $4, $5)`;
                
            const descriptionResult = await client.query(descriptionQuery, [product_id, active_ingredients, type, image_url, public_id]);
            
            if (descriptionResult.rowCount === 0) {
                await client.query("ROLLBACK");
                return { success: false, message: "Failed to save product description" };
            }
        }

        await client.query("COMMIT");

        return { success: true, message: "Successfully added Product", product_id: product_id }
    } catch(error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

export const deactivateProduct = async(reqbody) => {
    const { product_id } = reqbody;

    if (!product_id) {
        throw new Error("Product ID is required");
    }

    try {
        const productID = parseInt(product_id);
        const queryProduct = `UPDATE product SET status = 0 WHERE id = $1 RETURNING name`;
        const result = await db.query(queryProduct, [productID]);
        
        if (result.rowCount === 0) {
            return {success: false, message: "Failed to Deactivate product"};
        }
        const Pname = result.rows[0].name;

        return {success: true, message: "Successfully Deactivated Product", product_name: Pname};

    } catch (error) {
        throw error
    }

}

// Loop through each recognized med and query individually
export const getProduct = async (product_name) => {
    try {
        const search = `SELECT id, name, dosage, price, stock, manufacturer 
            FROM product WHERE name ILIKE $1`;

        const { rows } = await db.query(search, [`%${product_name}%`]); 
        return rows;

    } catch (error) {
        throw error;
    }
}
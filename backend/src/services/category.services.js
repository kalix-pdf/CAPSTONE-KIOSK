import db from "../config/db.js";


export const addNewCategory = async(categoryData) => {
    const { icon, color, name } = categoryData;

    if (!name || name == "") {
        throw new Error("Category name is required!");
    }

    const client = await db.connect();

    try {
        const addCategoryQuery = `INSERT INTO categories(name, status, icon, color) 
                VALUES($1, 1, $2, $3) RETURNING id, name`;

        await client.query("BEGIN");
        const result = await client.query(addCategoryQuery, [name, icon, color]);

        if (result.rowCount === 0) {
            return {success: false, message: "Something went wrong with server, please try again"};
        }

        const { id: category_id, name: category_Name } = result.rows[0];

        await client.query("COMMIT");
        return {success: true, message: "Category Added Successfully!", categoryId: category_id, category_name: category_Name};

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

export async function deleteCategoryByID(categoryID) {
    if (!categoryID) throw new Error("ID is required");
    
    const query = `UPDATE categories SET status = 0 WHERE id = $1 RETURNING name`;
    const result = await db.query(query, [categoryID]);

    if (result.rowCount === 0) {
        return { success: false, message: "Something went wrong"};
    }
    
    const name = result.rows[0].name;  

    return { success: true, message: `Successfully deleted ${name}`};
}
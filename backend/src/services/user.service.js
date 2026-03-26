import db from "../config/db.js";
import bcrypt from "bcrypt";

export const getAllCategories = async () => {
  const { rows } = await db.query(`SELECT c.id, c.name, c.icon, c.color, COUNT(p.id)::int as medications_per_category 
                              FROM categories c LEFT JOIN product p ON c.id = p.category AND p.status =1 
                              WHERE c.status = 1 GROUP BY c.id, c.name, c.icon, c.color ORDER BY c.id`);
  return rows;
};


export const getActiveCategories = async() => {
  const { rows } = await db.query(`SELECT c.id, c.name, c.icon, c.color, COUNT(p.id)::int as medications_per_category 
                              FROM categories c INNER JOIN product p ON c.id = p.category WHERE c.status = 1 AND p.status = 1
                              GROUP BY c.id, c.name, c.icon, c.color ORDER BY c.id`);
  return rows;
}

export const getProductsByCategoryId = async (categoryId) => {
  const query = `SELECT p.id, p.name, p.price, p.dosage, p.prescriptionrequired, p.manufacturer, 
                  pd.image_url, pd.type, pd.description, pd.side_effects, pd.active_ingredients, 
                  p.stock, p.barcode, c.id AS categoryId, c.name AS category 
                FROM product p
                JOIN categories c ON p.category = c.id
                LEFT JOIN product_description pd ON p.id = pd.product_id
                WHERE p.category = $1 AND p.status = 1`;
  
  const { rows } = await db.query(query, [categoryId]);
  return rows;
}

export const createOrder = async (orderData) => {

  const { items, phone_number, total_amount, scannedID, extractedText } = orderData;
  const client = await db.connect();

  try {
    await client.query("BEGIN"); 
    const orderInsertQuery = `INSERT INTO orders (phone_number, status, total_amount, image_data_id) VALUES ($1, 1, $2, $3) RETURNING id`;
    const orderResult = await client.query(orderInsertQuery, [phone_number, total_amount, scannedID]);
    const orderId = orderResult.rows[0].id;

    for (const item of items) {
      const orderItemsInsertQuery = `INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)`;
      await client.query(orderItemsInsertQuery, [orderId, item.product_id, item.quantity]);
    }
    

    if (extractedText) {
      const ScannedImage = `UPDATE scanned_image SET extracted_text = $1 WHERE id = $2`;
      await client.query(ScannedImage, [extractedText, scannedID])
    }

    await client.query("COMMIT");

    const queueNumberQuery = `SELECT COALESCE((SELECT MIN(queue_number) + 1 FROM orders o1 
      WHERE status = 1 AND NOT EXISTS (SELECT 1 FROM orders o2 WHERE o2.queue_number = o1.queue_number + 1 
        AND o2.status = 1)), (SELECT COALESCE(MAX(queue_number), 0) + 1 FROM orders WHERE status = 1),
         1) as next_queue`;

    const queueNumberResult = await client.query(queueNumberQuery);
    const queueNumber = parseInt(queueNumberResult.rows[0].next_queue);

    await client.query('UPDATE orders SET queue_number = $1 WHERE id = $2', [queueNumber, orderId]);

    return { 
      success: true, message: "Order created successfully", 
      QueueNumber: queueNumber, order_ID: orderId };

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;

  } finally {
    client.release();
  }
}


export const saveOCRImage = async (imageUrl, ocrTypeNum) => {
  const client = await db.connect();
  
  try {
    await client.query("BEGIN");
    
    const query = `INSERT INTO scanned_image (image_url, ocr_type) VALUES ($1, $2) RETURNING id`;
    const { rows } = await client.query(query, [imageUrl, ocrTypeNum]);
    
    await client.query("COMMIT");
    return rows[0].id;
    
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release(); 
  }
  
}

//admin
//login
export const checkCredentials = async (credentialsData) => {
  try {
    const { username, password } = credentialsData;

    const query = "SELECT * FROM admin_users WHERE username = $1";
    const result = await db.query(query, [username]);

    if (result.rows.length === 0) {
      return {success: false, message: "Invalid Username or Password"};
    }

    const admin_user = result.rows[0];
    const isMatch = await bcrypt.compare(password, admin_user.password);

    if (!isMatch) {
      return {success: false, message: "Invalid Username or Password"};
    }

    return {
      success: true, message: "Login Successful", user: {
        id: admin_user.id,
        username: admin_user.username,
        role: admin_user.role
      }
    }

  } catch (error) {
    throw error;
  }
}

export const getTotalTotalDashboardPage = async() => {
  const query = `WITH product_stats AS (SELECT COUNT(*) AS total_medication FROM product),
              product_stats_value AS (SELECT SUM(price) AS total_value_price FROM product),
              total_order_stats AS (SELECT COUNT(*) AS total_order FROM orders)
              SELECT product_stats.total_medication, product_stats_value.total_value_price, total_order_stats.total_order
              FROM product_stats, product_stats_value, total_order_stats`;

  const { rows } = await db.query(query);
  return rows;
}

export const getAllProducts = async() => {
  const { rows } = await db.query(`SELECT p.id, p.name, p.category, p.dosage, p.prescriptionrequired,
      p.manufacturer, p.barcode, p.price, p.stock, p.status, pd.type, pd.description,
      pd.active_ingredients, pd.side_effects, c.name as category_name FROM product p 
      JOIN categories c ON p.category = c.id LEFT JOIN product_description pd ON p.id = pd.product_id WHERE p.status = 1
       ORDER BY p.id DESC`);
  
  return rows;
}

export const saveActivityLogs = async(ActivityLogsData) => {
  const { user_id, type, action, description, metadata } = ActivityLogsData;
  const client = await db.connect();

  try {
    const queryInsert = `INSERT INTO activity_logs (user_id, type, action, description, metadata)
                    VALUES ($1, $2, $3, $4, $5) RETURNING *`
    await client.query("BEGIN");
    const result = await client.query(queryInsert, [user_id, type, action, description, JSON.stringify(metadata)]);

    await client.query("COMMIT");

    return { 
      success: true, message: "activity logs added!", 
      activity: result.rows[0].id };

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

}

export const getActivityLogs = async() => {
  const queryActivityLogs = `SELECT a.*, p.name as product_name, c.name as category_name 
            FROM activity_logs a LEFT JOIN product p ON p.id = (a.metadata->>'productId')::int
            LEFT JOIN categories c ON c.id = p.category`;
  
  const { rows } = await db.query(queryActivityLogs);

  return rows;
}

export const getOrders = async(statuses) => {
  const query = `SELECT o.queue_number, o.id AS order_id, o.total_amount, o.created_at,
              o.status, json_agg(
                json_build_object(
                  'product_id', p.id,
                  'dosage', p.dosage,
                  'product_name', p.name, 
                  'quantity', oi.quantity, 
                  'price', p.price, 
                  'manufacturer', p.manufacturer, 
                  'barcode', p.barcode
                )) AS items,
              json_build_object(
                'image_url', si.image_url, 
                'extractedText', si.extracted_text
              ) AS prescriptionData
            FROM orders o LEFT JOIN order_items oi ON o.id = oi.order_id 
            LEFT JOIN product p ON p.id = oi.product_id 
            LEFT JOIN scanned_image si ON si.id = o.image_data_id 
            WHERE o.status = ANY($1::int[])
            GROUP BY o.id, o.queue_number, si.image_url, si.extracted_text, si.accuracy
            ORDER BY o.created_at ASC`;
  
  const { rows } = await db.query(query, [statuses]);
  return rows;
}

export const getOrdersById = async(id) => {
  const orderID = parseInt(id);

  const query = `SELECT o.queue_number, o.id AS order_id, o.total_amount, o.created_at,
              o.status, json_agg(
                json_build_object(
                  'product_id', p.id,
                  'dosage', p.dosage,
                  'product_name', p.name, 
                  'quantity', oi.quantity, 
                  'price', p.price, 
                  'manufacturer', p.manufacturer, 
                  'barcode', p.barcode
                )) AS items,
              json_build_object(
                'image_url', si.image_url, 
                'extractedText', si.extracted_text, 
                'accuracy', si.accuracy
              ) AS prescriptionData
            FROM orders o LEFT JOIN order_items oi ON o.id = oi.order_id 
            LEFT JOIN product p ON p.id = oi.product_id 
            LEFT JOIN scanned_image si ON si.id = o.image_data_id WHERE o.id = $1
            GROUP BY o.id, o.queue_number, si.image_url, si.extracted_text, si.accuracy`;
  
  const { rows } = await db.query(query, [orderID]);

  return rows;
}

export const getTotalCompletedToday = async() => {
  const query = `SELECT COUNT(*) AS total FROM orders WHERE status = 3 AND DATE(created_at) = CURRENT_DATE`;

  const { rows } = await db.query(query);

  return rows;
}


export const getAllOrdersForQueueDisplay = async() => {
  const query = `SELECT id AS order_id, created_at, queue_number, status FROM orders WHERE DATE(created_at) = CURRENT_DATE`;

  const { rows } = await db.query(query);

  return rows;
}


export const updateOrder = async(req_body) => {
  const { order_id, status_type } = req_body;

  if (!order_id || order_id == null) throw new Error("Order ID is Required");
  
  try {
    const query = `UPDATE orders SET status = $1 WHERE id = $2`;
    const orderID = parseInt(order_id);
    const type = parseInt(status_type);

    const result = await db.query(query, [type, orderID]);

    if (result.rowCount === 0) {
        return {success: false, message: "Failed to update order"};
    }

    return {success: true, message: "Successfully Mark as Completed", order_ID: orderID};
  } catch (error) {
    throw error;
  }

}
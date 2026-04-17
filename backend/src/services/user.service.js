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
                  pd.image_url, pd.type, pd.description, pd.side_effects, pd.active_ingredients, pd.image_url AS image, 
                  p.stock, p.barcode, c.id AS categoryId, c.name AS category 
                FROM product p
                JOIN categories c ON p.category = c.id
                LEFT JOIN product_description pd ON p.id = pd.product_id
                WHERE p.category = $1 AND p.status = 1`;
  
  const { rows } = await db.query(query, [categoryId]);
  return rows;
}

//check existing scanned prescription by patient name and date issued
export const checkExistingScannedPrescription = async(scanned_id) => {
  const query = `SELECT id FROM orders WHERE image_data_id = $1`;
  const { rows } = await db.query(query, [scanned_id]);

  return rows.length > 0 ? true : false;
}

//check if reaching the maximum quantity of medicine ordered for a specific product in an order
export const checkMaxQuantityOrdered = async(orderId, productId, quantity) => {
  const { rows } = await db.query(`SELECT total_ordered_medicine_quantity FROM order_items WHERE order_id = $1 AND product_id = $2`, [orderId, productId]);
  const currentTotalOrderedQuantity = rows.length > 0 ? rows[0].total_ordered_medicine_quantity : 0;

  const totalLimitMedicineQuantity = `SELECT total_limit_medicine_quantity FROM product_description WHERE product_id = $1`;
  const { rows: limitRows } = await db.query(totalLimitMedicineQuantity, [productId]);
  
  const totalLimit = limitRows[0].total_limit_medicine_quantity;

  const { rows: scannedRows } = await db.query(`SELECT elem->>'quantity' AS prescribed_quantity, 
      elem->>'refills' AS refills FROM scanned_image, LATERAL jsonb_array_elements(ordered_medicine) AS elem 
      WHERE (elem->>'product_id')::int = $1 ORDER BY id DESC LIMIT 1`, [productId]);

  const prescribedQuantity = parseInt(scannedRows[0].prescribed_quantity ?? '0', 10);
  const refills = parseInt(scannedRows[0].refills ?? '0', 10);

  const projectedTotal = currentTotalOrderedQuantity + quantity;

  if (prescribedQuantity > 0) {
    const totalAllowedQuantity = prescribedQuantity * (1 + refills);
    console.log("total allowed quantity (prescription):", totalAllowedQuantity);

    if (projectedTotal > totalAllowedQuantity) return true;
    return false;
  }

  if (totalLimit === 0) return false;
  if (totalLimit > 0 && projectedTotal > totalLimit) return true; 

  return false;
}

export const createOrder = async (orderData) => {
  // console.log("Received order data:", orderData);
  const { items, phone_number, total_amount, scannedID, extractedText } = orderData;
  const client = await db.connect();

  try {
    await client.query("BEGIN"); 
    
    const existing = await checkExistingScannedPrescription(scannedID);
    let orderId;

    if (existing) {
      const updateOrderQuery = `UPDATE orders SET phone_number = $1, total_amount = $2, status = 1 WHERE image_data_id = $3 RETURNING id`;
      const updateResult = await client.query(updateOrderQuery, [phone_number, total_amount, scannedID]);
      orderId = updateResult.rows[0].id;

      for (const item of items) {
        if (await checkMaxQuantityOrdered(orderId, item.product_id, item.quantity)) {
          await client.query("ROLLBACK");
          return { success: false, message: `Maximum quantity for the ${item.item_name} has been reached. You cannot add it to the order.` };
        }
        
        const updateItemQuery = `UPDATE order_items SET total_ordered_medicine_quantity = total_ordered_medicine_quantity + $1, 
          quantity = $2 WHERE order_id = $3 AND product_id = $4`;
        const result = await client.query(updateItemQuery, [item.quantity, item.quantity, orderId, item.product_id]);

        if (result.rowCount === 0) {
          const insertItemQuery = `INSERT INTO order_items (order_id, product_id, quantity, total_ordered_medicine_quantity) 
            VALUES ($1, $2, $3, $4)`;
          await client.query(insertItemQuery, [orderId, item.product_id, item.quantity, item.quantity]);
        }
      }

    } else {
      const orderInsertQuery = `INSERT INTO orders (phone_number, status, total_amount, image_data_id) VALUES ($1, 1, $2, $3) RETURNING id`;
      const orderResult = await client.query(orderInsertQuery, [phone_number, total_amount, scannedID]);
      orderId = orderResult.rows[0].id;
  
      for (const item of items) {
        const orderItemsInsertQuery = `INSERT INTO order_items (order_id, product_id, quantity, total_ordered_medicine_quantity) VALUES ($1, $2, $3, $4)`;
        await client.query(orderItemsInsertQuery, [orderId, item.product_id, item.quantity, item.quantity]);
      }

    }    

    //update the scanned image from the database to add the extracted text, patient info and and medicine dosage
    if (extractedText && scannedID > 0) {
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

export const updateOCRImageData = async(scannedID, matchedProducts = []) => {
  const query = `UPDATE scanned_image SET ordered_medicine = $1 WHERE id = $2`;

  const medicationJson = JSON.stringify(
      matchedProducts.map(product => ({
        product_id: product.product_id, 
        name: product.product_name, 
        quantity: product.quantity ?? 0,
        refills: product.refills ?? 0,
      }))
    );
    
  const result = await db.query(query, [medicationJson, scannedID]);

  if (result.rowCount === 0) {
    throw new Error("Failed to update scanned image data");
  }

  return scannedID;
}

export const saveOCRImage = async (imageUrl, ocrTypeNum, patientInfo, dateIssued, matchedProducts = []) => {
  const client = await db.connect();
  console.log(matchedProducts);
  try {
    await client.query("BEGIN");
    
    const query = `INSERT INTO scanned_image (image_url, ocr_type, patient_name, rx_date, ordered_medicine) 
      VALUES ($1, $2, $3, $4, $5::jsonb) RETURNING id`;

    const medicationJson = JSON.stringify(
      matchedProducts.map(product => ({
        product_id: product.product_id, 
        name: product.product_name, 
        quantity: product.quantity ?? 0,
        refills: product.refills ?? 0,
      }))
    );

    const { rows } = await client.query(query, [imageUrl, ocrTypeNum, patientInfo, dateIssued, medicationJson]);
    
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

export const getAllProducts = async (page, limit) => {
  const offset = (page - 1) * limit;

  const { rows } = await db.query(`
    SELECT p.id, p.name, p.category, p.dosage, p.prescriptionrequired,
    p.manufacturer, p.barcode, p.price, p.stock, p.status,
    pd.type, pd.image_url AS image, pd.public_id,
    pd.active_ingredients, pd.total_limit_medicine_quantity, pd.side_effects,
    c.name as category_name
    FROM product p
    JOIN categories c ON p.category = c.id
    LEFT JOIN product_description pd ON p.id = pd.product_id
    WHERE p.status = 1
    ORDER BY p.id DESC
    LIMIT $1 OFFSET $2
  `, [limit, offset]);

  const totalResult = await db.query(`
    SELECT COUNT(*) FROM product WHERE status = 1
  `);

  return {
    data: rows,
    total: parseInt(totalResult.rows[0].count)
  };
};

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
            LEFT JOIN categories c ON c.id = p.category ORDER BY a.date DESC`;
  
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
            GROUP BY o.id, o.queue_number, si.image_url, si.extracted_text
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
                'extractedText', si.extracted_text
              ) AS prescriptionData
            FROM orders o LEFT JOIN order_items oi ON o.id = oi.order_id 
            LEFT JOIN product p ON p.id = oi.product_id 
            LEFT JOIN scanned_image si ON si.id = o.image_data_id WHERE o.id = $1
            GROUP BY o.id, o.queue_number, si.image_url, si.extracted_text`;
  
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

export const fetchOrders = async() => {

  const { rows } = await db.query(`SELECT o.id AS order_id, o.image_data_id, o.queue_number, o.created_at, o.total_amount, o.status,
    JSON_AGG(JSON_BUILD_OBJECT(
      'product_id', p.id,
      'product_name', p.name, 
      'dosage', p.dosage, 
      'price', p.price, 
      'manufacturer', p.manufacturer, 
      'barcode', p.barcode,
      'quantity', oi.quantity
    ))AS products, SUM(oi.quantity) AS total_quantity
    FROM orders o LEFT JOIN order_items oi ON oi.order_id = o.id 
    LEFT JOIN product p ON p.id = oi.product_id WHERE o.status = 3 OR o.status = 4
    GROUP BY o.id, oi.quantity`);

    return rows;
}
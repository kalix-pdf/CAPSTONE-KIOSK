import { parse } from 'dotenv';
import * as userService from '../services/user.service.js';
import { broadcast } from '../websocket.js';

export const getCategories = async (req, res, next) => {
    try {
        const categories = await userService.getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
};

export const getProductsByCategory = async (req, res, next) => {
    try {
        const products = await userService.getProductsByCategoryId(req.params.categoryid);
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
}

export const createOrder = async (req, res, next) => {
    try {
        const orderData = req.body;
        const order = await userService.createOrder(orderData);

        res.status(201).json(order);

        if (order.success) {
            const updatedOrder = await userService.getOrdersById(order.order_ID);
            broadcast('ORDER_CREATED', updatedOrder[0]);
        }

    } catch (error) {
        next(error);
    }
}


export const processOCRImage = async (req, res) => {
    try {
        // const ocrType = req.body.ocr_type || 0;
        if (!req.file) {
            return 0;
        }
        
        if (!req.file) {
            console.log('ERROR: No file uploaded');
            return 0;
        }

        const imagePath = req.file.path; 

        const imageUrl = `/${req.file.path}`; 
        // const filename = req.file.filename;
        const ocrTypeNum = 0;
        
        const scannedID = await userService.saveOCRImage(imageUrl, ocrTypeNum);

        if (!scannedID) {
            return 0;
        }

        return scannedID;

    } catch (error) {
        if (req.file && req.file.path) {
        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Error deleting file:', err);
        });
        }
    throw error;
  }
};

// admin
//login 
export const adminLogin = async (req, res, next) => {
  try {
    const result = await userService.checkCredentials(req.body);

    if (!result.success) {
        return res.status(401).json({success: false, message: result.message});
    }

    // const token = jwt.sign({id: result.user.id, username: result.user.username}, 
    //     process.ENV.JWT_SECRET, {expiresIn: "1d"};

    return res.status(200).json({success: true, message: result.message, user: result.user});

  } catch (error) {
    return res.status(500).json({message: "Internal server Error"});
  } 
};

export const fetchTotalDashboard = async (req, res, next) => {
    try {
        const result = await userService.getTotalTotalDashboardPage();
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
}

export const fetchAllProducts = async (req, res, next) => {
    try {
        const result = await userService.getAllProducts();
        res.status(200).json(result);

    } catch (error) {
        throw error;
    }
}

export const addActivityLogs = async (req, res, next) => { 
    try {
        const result = await userService.saveActivityLogs(req.body);
        res.status(200).json(result);

    } catch (error) {
        throw error;
    }
}

export const fetchAllActivityLogs = async (req, res, next) => {
    try {
        const result = await userService.getActivityLogs();
        res.status(200).json(result);

    } catch (error) {
        throw error
    }
}

export const fetchOrders = async(req, res) => {
    try {
        const statuses = [].concat(req.query.status).map(Number);
        const result = await userService.getOrders(statuses);
        res.status(200).json(result);

    } catch (error) {
        throw error;
    }
}

export const fetchTotalCompletedToday = async(req, res) => {
    try {
        const result = await userService.getTotalCompletedToday();
        res.status(200).json(result);

    } catch (error) {
        throw error;
    }
}

export const OrderUpdate = async(req, res) => {
    try {
        const result = await userService.updateOrder(req.body);
        res.status(200).json(result);

        if (result.success) {
            const updatedOrder = await userService.getOrdersById(result.order_ID);
            broadcast('ORDER_UPDATED', updatedOrder[0]);
        }

    } catch (error) {
        throw error;
    }
}

export const AllOrdersQeueueDisplay = async(req, res) => {
    try {
        const result = await userService.getAllOrdersForQueueDisplay();
        res.status(200).json(result);

    } catch (error) {
        throw error;
    }
}
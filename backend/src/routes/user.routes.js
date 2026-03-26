import express from "express";
import { getCategories, getProductsByCategory, createOrder, processOCRImage, adminLogin,
  fetchTotalDashboard, fetchAllProducts, addActivityLogs, fetchAllActivityLogs, fetchOrders, 
  fetchTotalCompletedToday, OrderUpdate, AllOrdersQeueueDisplay, getActiveCategory } 
from "../controllers/user.controller.js";
import { ProductUpdate, AddNewProduct, ProductDeactivate } from "../controllers/product.controller.js";
import { CategoryAdd, categoryDelete } from "../controllers/category.controller.js";
import { AIPoweredProductDetails, PrescriptionAIPowered, MedinceScannerAIPowered } from "../controllers/generativeAI.controller.js";


import path from 'path';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/ocr-images');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'ocr-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});


router.get("/categories", getCategories);
router.get("/activeCategories", getActiveCategory);
router.get("/category/:categoryid/products", getProductsByCategory);
router.post("/order", createOrder);
router.post("/ocr/process", upload.single('prescription'), processOCRImage);

//OCR AI powered
router.post("/ocr/product/scan", upload.single('medicine'), MedinceScannerAIPowered)
router.post("/ocr/readPrescription", upload.single('prescription'), PrescriptionAIPowered);

//admin
router.post("/admin/login", adminLogin);
router.post("/admin/add/ActivityLogs", addActivityLogs);
router.get("/admin/fetchTotalDashboard", fetchTotalDashboard);
router.get("/products", fetchAllProducts);
router.get("/admin/ActivityLogs", fetchAllActivityLogs);

router.get("/admin/orders", fetchOrders)
router.get("/admin/AllOrders", AllOrdersQeueueDisplay)

router.post("/admin/delete/category/:category_id", categoryDelete)

router.get("/admin/completedToday", fetchTotalCompletedToday)
router.post("/admin/update/product", upload.single('image'), ProductUpdate);

router.post("/admin/add/product", upload.single('image'), AddNewProduct);

router.post("/admin/add/category", CategoryAdd);
router.post("/admin/deactivate/product", ProductDeactivate)
router.post("/admin/update/order", OrderUpdate)

//Generative AI
router.post("/generate/product/details", AIPoweredProductDetails);

// const clients = new Set();

// router.get('/queue/stream', (req, res) => {
//   res.setHeader('Content-Type', 'text/event-stream');
//   res.setHeader('Cache-Control', 'no-cache');
//   res.setHeader('Connection', 'keep-alive');
//   res.flushHeaders();

//   const heartbeat = setInterval(() => res.write(': ping\n\n'), 30000);

//   clients.add(res);

//   req.on('close', () => {
//     clearInterval(heartbeat);
//     clients.delete(res);
//   });
// });

// export function broadcastQueueUpdate(data) {
//   const payload = `data: ${JSON.stringify(data)}\n\n`;
//   clients.forEach(client => client.write(payload));
// }

export default router;
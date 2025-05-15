const admin = require('firebase-admin');

// **สำคัญ:** แทนที่ด้วยข้อมูลการตั้งค่า Firebase Admin SDK ของคุณ
const serviceAccount = require('./lapas.json');

admin.initializeApp({
credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const apiUrl = 'http://it2.sut.ac.th/labexample/product.php';

async function fetchProductsFromApi(page = 1, allProducts = []) {
try {
const response = await fetch(`${apiUrl}?pageno=${page}`);
const data = await response.json();

if (!data.products || data.products.length === 0) {
return allProducts;
}

const newProducts = [...allProducts, ...data.products];
return fetchProductsFromApi(page + 1, newProducts);
} catch (error) {
console.error('Error fetching page', page, ':', error);
return allProducts;
}
}

async function uploadProductsToFirestore() {
console.log('กำลังดึงข้อมูลสินค้าจาก API...');
const productsFromApi = await fetchProductsFromApi();
console.log(`พบสินค้าทั้งหมด ${productsFromApi.length} รายการ`);

if (productsFromApi.length > 0) {
console.log('กำลังอัปโหลดข้อมูลไปยัง Firestore...');
const productsCollection = db.collection('products');
let uploadCount = 0;

for (const product of productsFromApi) {
try {
await productsCollection.add({
name: product.name,
price: parseFloat(product.price), // แปลงเป็น Number
stock: parseInt(product.stock), // แปลงเป็น Number
pic: product.pic,
cate: product.cate,
});
uploadCount++;
} catch (error) {
console.error('Error adding product:', product.name, error);
}
}
console.log(`อัปโหลดสินค้า ${uploadCount} รายการไปยัง Firestore สำเร็จ`);
} else {
console.log('ไม่มีสินค้าที่ดึงมาจาก API');
}
}

uploadProductsToFirestore().then(() => {
console.log('การแปลงข้อมูลเสร็จสมบูรณ์');
process.exit();
}).catch(error => {
console.error('เกิดข้อผิดพลาดในการแปลงข้อมูล:', error);
process.exit(1);
});
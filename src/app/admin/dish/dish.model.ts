export interface Dish {
    _id: String;
    name: String;
    products: ProductsModel;
    price: String;
    price_p: String;
};


export interface ProductsModel {
    sum: String;
    name: String;
    id: String;
   
} 
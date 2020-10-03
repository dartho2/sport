export interface Dish {
    _id: String;
    name: String;
    products: ProductsModel;
    price: String;
    price_p: String;
    image: string;
};


export interface ProductsModel {
    sum: String;
    name: String;
    id: String;
   
} 
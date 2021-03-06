export interface Recipe {
    _id: string;
    name: string;
    bruttoPrice: string;
    productDate: string;
    losses: string;
    lossesPriceNetto: string;
    nettoPrice: string;
    description: string;
    label: string;
    logo: string;
    image: string;
    style: string;
    supplier: string;
    active: Boolean;
    price: string;
    unit: string;
    weight: string;
    vat: Number;
    totalPrice: string;
    product_data: Date;
    history: History[];
};
export interface History {
    nettoPrice: string;
    productDate: string;
}


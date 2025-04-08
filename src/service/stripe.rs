use std::str::FromStr;

use stripe::{
    CheckoutSession, CheckoutSessionMode, CreateCheckoutSession, CreateCheckoutSessionLineItems,
    CreateCustomer, CreatePrice, CreateProduct, Currency, Customer, CustomerId, IdOrCreate, Price,
    Product, ProductId, UpdatePrice, UpdateProduct,
};

use crate::models::{event::Event, ticket::ShoppingCartItem, user::User};

// TODO: DO a little more defensive programming here. What if there is no default price? What if , what if, what if?

pub async fn generate_checkout(
    user: &User,
    shopping_cart: Vec<ShoppingCartItem>,
) -> CheckoutSession {
    let customer = get_customer(user).await;

    let mut create_checkout = CreateCheckoutSession::new();
    create_checkout.cancel_url = Some("http://localhost:3000/cancel");
    create_checkout.success_url = Some("http://localhost:3000/success");
    create_checkout.customer = Some(customer.id);
    create_checkout.mode = Some(CheckoutSessionMode::Payment);
    create_checkout.line_items = Some(
        shopping_cart
            .iter()
            .map(|item| CreateCheckoutSessionLineItems {
                quantity: Some(item.count.unwrap() as u64),
                price: Some(item.price_id.clone().unwrap()),
                ..CreateCheckoutSessionLineItems::default()
            })
            .collect(),
    );

    let client = get_client();
    CheckoutSession::create(&client, create_checkout)
        .await
        .unwrap()
}

pub async fn create_product(event: &Event, image_uri: String) -> Product {
    let client = get_client();

    let mut create_product = CreateProduct::new(event.name.as_str());
    create_product.images = Some(vec![image_uri]);
    create_product.default_price_data = Some(stripe::CreateProductDefaultPriceData {
        currency: Currency::EUR,
        currency_options: None,
        recurring: None,
        tax_behavior: None,
        unit_amount: Some((event.price * 100_f32) as i64),
        unit_amount_decimal: None,
    });
    // TODO: Implement tax code
    Product::create(&client, create_product).await.unwrap()
}

pub async fn update_product(event: &Event, image_uri: String) -> Product {
    let client = get_client();
    let product_id = ProductId::from_str(event.price_id.clone().unwrap().as_str()).unwrap();

    let mut update_product = UpdateProduct::new();
    update_product.name = Some(event.name.as_str());
    update_product.images = Some(vec![image_uri]);
    // TODO: Implement tax code
    let mut product = Product::update(&client, &product_id, update_product)
        .await
        .unwrap();

    let default_price = product.clone().default_price.unwrap();
    let price_id = default_price.id();
    let price = Price::retrieve(&client, &price_id, &[]).await.unwrap();
    if price.unit_amount.unwrap() != (event.price * 100_f32) as i64 {
        let mut create_price = CreatePrice::new(Currency::EUR);
        create_price.unit_amount = Some((event.price * 100_f32) as i64);
        create_price.product = Some(IdOrCreate::Id(&product_id));

        let new_price = Price::create(&client, create_price).await.unwrap();
        let mut new_price_update = UpdateProduct::new();
        new_price_update.default_price = Some(new_price.id.as_str());
        product = Product::update(&client, &product_id, new_price_update)
            .await
            .unwrap();

        let mut old_price = UpdatePrice::new();
        old_price.active = Some(false);
        Price::update(&client, &price_id, old_price).await;
    }
    product
}

pub async fn create_customer(user: &User) -> Customer {
    let client = get_client();
    let mut params = CreateCustomer::new();
    params.name = Some(&user.username);
    params.email = match &user.email {
        Some(email) => Some(email.as_str()),
        None => None,
    };
    Customer::create(&client, params).await.unwrap()
}

pub async fn get_customer(user: &User) -> Customer {
    let client = get_client();
    let customer_id = CustomerId::from_str(user.customer_id.clone().unwrap().as_str()).unwrap();
    Customer::retrieve(&client, &customer_id, &[])
        .await
        .unwrap()
}

fn get_client() -> stripe::Client {
    let secret = std::env::var("STRIPE_SECRET").expect("Missing STRIPE_SECRET in env");
    stripe::Client::new(secret)
}

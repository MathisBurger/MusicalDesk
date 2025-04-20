use std::str::FromStr;

use chrono::{DateTime, Utc};
use log::error;
use stripe::{
    CheckoutSession, CheckoutSessionId, CheckoutSessionMode, CreateCheckoutSession,
    CreateCheckoutSessionLineItems, CreateCustomer, CreatePrice, CreateProduct, Currency, Customer,
    CustomerId, IdOrCreate, Price, PriceId, Product, ProductId, UpdatePrice, UpdateProduct,
};

use crate::models::{event::Event, generic::Error, ticket::ShoppingCartItem, user::User};

pub async fn generate_checkout(
    user: &User,
    shopping_cart: Vec<ShoppingCartItem>,
    expires_at: DateTime<Utc>,
    cancel_url: String,
    success_url: String,
) -> Result<CheckoutSession, Error> {
    let customer = get_customer(user).await?;
    let mut create_checkout = CreateCheckoutSession::new();
    create_checkout.cancel_url = Some(cancel_url.as_str());
    create_checkout.success_url = Some(success_url.as_str());
    create_checkout.customer = Some(customer.id);
    create_checkout.expires_at = Some(expires_at.timestamp());
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
        .map_err(|_x| {
            println!("{}", _x.to_string());
            Error::BadRequest
        })
}

pub async fn get_checkout_session(session_id: &String) -> Result<CheckoutSession, Error> {
    let client = get_client();
    let checkout_session_id =
        CheckoutSessionId::from_str(session_id.as_str()).expect("Invalid session id");
    CheckoutSession::retrieve(&client, &checkout_session_id, &[])
        .await
        .map_err(|_x| Error::NotFound)
}

pub async fn create_product(event: &Event, image_uri: String) -> Result<Product, Error> {
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
    Product::create(&client, create_product)
        .await
        .map_err(|_x| Error::BadRequest)
}

pub async fn update_product(event: &Event, image_uri: String) -> Result<Product, Error> {
    let client = get_client();

    if event.price_id.is_none() {
        return Err(Error::BadRequest);
    }

    let product_id = ProductId::from_str(event.price_id.clone().unwrap().as_str())
        .expect("product ID has invalid format");

    let mut update_product = UpdateProduct::new();
    update_product.name = Some(event.name.as_str());
    update_product.images = Some(vec![image_uri]);
    // TODO: Implement tax code

    let product = Product::update(&client, &product_id, update_product)
        .await
        .map_err(|_x| Error::BadRequest)?;

    update_product_price(product, &event).await
}

pub async fn create_customer(user: &User) -> Result<Customer, Error> {
    let client = get_client();
    let mut params = CreateCustomer::new();
    params.name = Some(&user.username);
    params.email = match &user.email {
        Some(email) => Some(email.as_str()),
        None => None,
    };
    Customer::create(&client, params)
        .await
        .map_err(|_x| Error::BadRequest)
}

pub async fn get_customer(user: &User) -> Result<Customer, Error> {
    let client = get_client();
    if user.customer_id.is_none() {
        return Err(Error::BadRequest);
    }
    let customer_id = CustomerId::from_str(user.customer_id.clone().unwrap().as_str())
        .expect("Invalid customer ID");
    Customer::retrieve(&client, &customer_id, &[])
        .await
        .map_err(|e| {
            error!(target: "stripe", "{}", e.to_string());
            Error::BadRequest
        })
}

async fn update_product_price(mut product: Product, event: &Event) -> Result<Product, Error> {
    let client = get_client();

    if product.default_price.is_none() {
        return create_new_default_price_for_product(product, event, None).await;
    }
    let default_price = product.clone().default_price.unwrap();
    let price_id = default_price.id();
    let price = Price::retrieve(&client, &price_id, &[]).await.unwrap();

    // Only update price if the price has changed
    if price.unit_amount.unwrap() != (event.price * 100_f32) as i64 {
        product = create_new_default_price_for_product(product, event, Some(price_id)).await?;
    }
    Ok(product)
}

async fn create_new_default_price_for_product(
    mut product: Product,
    event: &Event,
    price_id: Option<PriceId>,
) -> Result<Product, Error> {
    let client = get_client();

    let mut create_price = CreatePrice::new(Currency::EUR);
    create_price.unit_amount = Some((event.price * 100_f32) as i64);
    create_price.product = Some(IdOrCreate::Id(&product.id));

    let new_price = Price::create(&client, create_price)
        .await
        .map_err(|_x| Error::BadRequest)?;
    let mut new_price_update = UpdateProduct::new();
    new_price_update.default_price = Some(new_price.id.as_str());
    product = Product::update(&client, &product.id, new_price_update)
        .await
        .map_err(|_x| Error::BadRequest)?;

    // Archive old default price if exists
    if let Some(price_id_unwrap) = price_id {
        let mut old_price = UpdatePrice::new();
        old_price.active = Some(false);
        Price::update(&client, &price_id_unwrap, old_price)
            .await
            .map_err(|_x| Error::BadRequest)?;
    }

    Ok(product)
}

fn get_client() -> stripe::Client {
    let secret = std::env::var("STRIPE_SECRET").expect("Missing STRIPE_SECRET in env");
    stripe::Client::new(secret)
}

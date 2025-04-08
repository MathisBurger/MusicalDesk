use std::str::FromStr;

use stripe::{
    CreatePrice, CreateProduct, Currency, IdOrCreate, Price, Product, ProductId, UpdatePrice,
    UpdateProduct,
};

use crate::models::event::Event;

// TODO: DO a little more defensive programming here. What if there is no default price? What if , what if, what if?

/// Creates an product for an event
pub async fn create_product(event: &Event, image_uri: String) {
    let client = get_client();
    let product_id = format!("musicaldesk_{}", event.id);

    let mut create_product = CreateProduct::new(event.name.as_str());
    create_product.id = Some(product_id.as_str());
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
    Product::create(&client, create_product).await.unwrap();
}

pub async fn update_product(event: &Event, image_uri: String) {
    let client = get_client();
    let product_id = ProductId::from_str(format!("musicaldesk_{}", event.id).as_str()).unwrap();

    let mut update_product = UpdateProduct::new();
    update_product.name = Some(event.name.as_str());
    update_product.images = Some(vec![image_uri]);
    // TODO: Implement tax code
    let product = Product::update(&client, &product_id, update_product)
        .await
        .unwrap();

    println!("{:?}", product);

    let default_price = product.default_price.unwrap();
    let price_id = default_price.id();
    let price = Price::retrieve(&client, &price_id, &[]).await.unwrap();
    if price.unit_amount.unwrap() != (event.price * 100_f32) as i64 {
        let mut create_price = CreatePrice::new(Currency::EUR);
        create_price.unit_amount = Some((event.price * 100_f32) as i64);
        create_price.product = Some(IdOrCreate::Id(&product_id));

        let new_price = Price::create(&client, create_price).await.unwrap();
        let mut new_price_update = UpdateProduct::new();
        new_price_update.default_price = Some(new_price.id.as_str());
        Product::update(&client, &product_id, new_price_update).await;

        let mut old_price = UpdatePrice::new();
        old_price.active = Some(false);
        Price::update(&client, &price_id, old_price).await;
    }
}

fn get_client() -> stripe::Client {
    let secret = std::env::var("STRIPE_SECRET").expect("Missing STRIPE_SECRET in env");
    stripe::Client::new(secret)
}

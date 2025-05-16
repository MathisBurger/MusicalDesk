use serde::Serialize;
use serde_json::Value;

use crate::{
    models::{expense::expense::Expense, image::Image},
    serialize::Serializer,
};

use super::SerializerHelper;

#[derive(Serialize)]
pub struct ExpenseDto {
    pub id: i32,
    pub expense_transaction: Option<Value>,
    pub balancing_transaction: Option<Value>,
    pub name: String,
    pub description: String,
    pub status: String,
    pub total_amount: i32,
    pub requestor: Value,
}

impl SerializerHelper for ExpenseDto {}

impl Serializer<Expense> for ExpenseDto {
    async fn serialize_from(
        cache: &mut std::collections::HashMap<String, serde_json::Value>,
        input: &Expense,
        db: &sqlx::PgPool,
    ) -> Self {
        let expense_transaction =
            Self::get_transaction_option(cache, input.expense_transaction_id, db).await;
        let balancing_transaction =
            Self::get_transaction_option(cache, input.balancing_transaction_id, db).await;
        let requestor = Self::get_user(cache, input.requestor_id, db).await;

        ExpenseDto {
            id: input.id,
            expense_transaction,
            balancing_transaction,
            name: input.name.clone(),
            description: input.description.clone(),
            status: input.status.clone(),
            total_amount: input.total_amount,
            requestor,
        }
    }
}

#[derive(Serialize)]
pub struct ExpenseWithImagesDto {
    pub expense: ExpenseDto,
    pub images: Vec<Image>,
}

impl SerializerHelper for ExpenseWithImagesDto {}

impl Serializer<Expense> for ExpenseWithImagesDto {
    async fn serialize_from(
        cache: &mut std::collections::HashMap<String, serde_json::Value>,
        input: &Expense,
        db: &sqlx::PgPool,
    ) -> Self {
        let images = Expense::find_images_for_id(input.id, db).await;
        let expense = ExpenseDto::serialize_from(cache, input, db).await;

        ExpenseWithImagesDto { expense, images }
    }
}

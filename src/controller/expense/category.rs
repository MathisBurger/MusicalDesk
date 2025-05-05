use crate::{
    models::{
        expense::category::Category,
        generic::{Error, UserRole},
        user::User,
    },
    AppState,
};
use actix_web::{
    get, post,
    web::{Data, Json, Path},
    HttpResponse,
};
use serde::Deserialize;

#[get("/expense/categories")]
pub async fn get_categories(user: User, state: Data<AppState>) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::Accountant) {
        return Err(Error::Forbidden);
    }
    let categories = Category::find_all(&state.database).await;
    Ok(HttpResponse::Ok().json(categories))
}

#[derive(Deserialize)]
pub struct CreateCategoryRequest {
    pub name: String,
    pub hex_color: String,
    pub is_income: bool,
}

#[post("/expense/categories")]
pub async fn create_category(
    user: User,
    state: Data<AppState>,
    req: Json<CreateCategoryRequest>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::Accountant) {
        return Err(Error::Forbidden);
    }
    let category = Category::create(&req, &state.database).await;
    Ok(HttpResponse::Ok().json(category))
}

#[derive(Deserialize)]
pub struct UpdateCategoryRequest {
    pub name: String,
    pub hex_color: String,
}

#[post("/expense/categories/{id}")]
pub async fn update_category(
    user: User,
    state: Data<AppState>,
    path: Path<(i32,)>,
    req: Json<UpdateCategoryRequest>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::Accountant) {
        return Err(Error::Forbidden);
    }
    let category = Category::update(path.0, &req, &state.database)
        .await
        .ok_or(Error::NotFound)?;
    Ok(HttpResponse::Ok().json(category))
}

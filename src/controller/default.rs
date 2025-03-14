use actix_web::{get, HttpResponse, Responder};

#[get("/")]
pub async fn default() -> impl Responder {
    HttpResponse::Ok().body("MusicalDesk server is up and running.")
}

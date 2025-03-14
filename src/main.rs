use actix_cors::Cors;
use actix_web::http::header;
use actix_web::{middleware, App, HttpServer};

mod controller;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let log_level = std::env::var("RUST_LOG").unwrap_or_else(|_e| "info".to_string());
    std::env::set_var("RUST_LOG", log_level);
    pretty_env_logger::init();

    HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin(
                &std::env::var("CORS_ORIGIN").unwrap_or("http://localhost:3000".to_string()),
            )
            .allowed_methods(vec!["GET", "POST", "DELETE", "PUT"])
            .allowed_headers(vec![
                header::SET_COOKIE,
                header::ACCEPT,
                header::CONTENT_TYPE,
                header::AUTHORIZATION,
            ])
            .send_wildcard()
            .supports_credentials()
            .max_age(3600);
        App::new()
            .wrap(middleware::Logger::default())
            .wrap(cors)
            .configure(controller::init_controllers)
    })
    .bind("0.0.0.0:8080")
    .expect("Port already in use")
    .run()
    .await
}

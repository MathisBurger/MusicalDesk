use actix_cors::Cors;
use actix_web::http::header;
use actix_web::web::Data;
use actix_web::{middleware, App, HttpServer};
use bcrypt::{hash, DEFAULT_COST};
use models::generic::UserRole;
use sqlx::postgres::PgPoolOptions;
use sqlx::{Pool, Postgres};

mod controller;
mod models;
mod session;
mod util;

#[derive(Clone)]
pub struct AppState {
    pub database: Pool<Postgres>,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let log_level = std::env::var("RUST_LOG").unwrap_or_else(|_e| "info".to_string());
    std::env::set_var("RUST_LOG", log_level);
    pretty_env_logger::init();

    let db_uri = std::env::var("DATABASE_URL")
        .unwrap_or("postgres://musicaldesk:musicaldesk@127.0.0.1:5432/musicaldesk".to_string());
    let db_pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&db_uri)
        .await
        .expect("Cannot connect to database");

    let _ = sqlx::migrate!("./migrations/").run(&db_pool).await;

    create_admin_user(&db_pool)
        .await
        .expect("Cannot create admin user");

    let state = AppState { database: db_pool };

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
            .app_data(Data::new(state.clone()))
            .wrap(middleware::Logger::default())
            .wrap(cors)
            .configure(controller::init_controllers)
    })
    .bind("0.0.0.0:8080")
    .expect("Port already in use")
    .run()
    .await
}

/// Creates the admin user if it does not exist yet.
async fn create_admin_user(pool: &Pool<Postgres>) -> Result<(), sqlx::Error> {
    let result = sqlx::query!("SELECT COUNT(*) as count FROM users WHERE username = 'admin'")
        .fetch_one(pool)
        .await?;
    if result.count.unwrap_or(0) == 0 {
        let password_hash = hash("admin", DEFAULT_COST).unwrap();
        sqlx::query("INSERT INTO users (username, password, roles) VALUES ($1, $2, $3)")
            .bind("admin")
            .bind(password_hash)
            .bind(vec![UserRole::Admin.to_string()])
            .execute(pool)
            .await?;
    }
    Ok(())
}

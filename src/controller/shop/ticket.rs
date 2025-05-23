use crate::{
    dto::ticket::UserTicketWithQrContent,
    models::{event::ticket::UserTicket, generic::Error, user::User},
    AppState,
};
use actix_web::{get, web::Data, HttpResponse};

#[get("/shop/tickets/current")]
pub async fn get_current_user_tickets(
    user: User,
    state: Data<AppState>,
) -> Result<HttpResponse, Error> {
    let tickets_without_code = UserTicket::get_current_user_tickets(user.id, &state.database).await;
    let tickets_with_code: Vec<UserTicketWithQrContent> = tickets_without_code
        .iter()
        .map(|user_ticket| UserTicketWithQrContent::from_user_ticket(user_ticket))
        .collect();
    Ok(HttpResponse::Ok().json(tickets_with_code))
}

#[get("/shop/tickets/old")]
pub async fn get_old_user_tickets(
    user: User,
    state: Data<AppState>,
) -> Result<HttpResponse, Error> {
    let tickets_without_code = UserTicket::get_old_user_tickets(user.id, &state.database).await;
    let tickets_with_code: Vec<UserTicketWithQrContent> = tickets_without_code
        .iter()
        .map(|user_ticket| UserTicketWithQrContent::from_user_ticket(user_ticket))
        .collect();
    Ok(HttpResponse::Ok().json(tickets_with_code))
}

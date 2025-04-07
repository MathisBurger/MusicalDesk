use std::path::PathBuf;

use actix_files::NamedFile;
use actix_multipart::form::{json::Json, tempfile::TempFile, MultipartForm};
use actix_web::{
    get, post,
    web::{Data, Path},
    HttpRequest, HttpResponse,
};
use serde::Deserialize;

use crate::{
    models::{
        generic::{Error, UserRole},
        image::Image,
        user::User,
    },
    AppState,
};

#[derive(Deserialize)]
struct ImageMeta {
    pub name: String,
    pub private: bool,
    pub required_roles: Option<Vec<String>>,
}

#[derive(MultipartForm)]
struct UploadFileMultipart {
    pub meta: Json<ImageMeta>,
    #[multipart(limit = "10MB")]
    pub file: TempFile,
}

#[post("/images")]
pub async fn upload_image(
    state: Data<AppState>,
    user: User,
    MultipartForm(form): MultipartForm<UploadFileMultipart>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::Default) {
        return Err(Error::Forbidden);
    }
    if !form
        .file
        .content_type
        .clone()
        .unwrap()
        .to_string()
        .starts_with("image/")
    {
        return Err(Error::BadRequest);
    }
    let image = Image::create(
        &form.meta.name,
        form.file,
        form.meta.private,
        form.meta.required_roles.clone(),
        &state.database,
    )
    .await;
    Ok(HttpResponse::Ok().json(image))
}

#[get("/images/{image_id}")]
pub async fn get_image(
    state: Data<AppState>,
    user_option: Option<User>,
    path: Path<(i32,)>,
    req: HttpRequest,
) -> Result<HttpResponse, Error> {
    let image = Image::find_by_id(path.0, &state.database).await?;
    if !image.private {
        return get_file(&image, &req);
    }
    let user = match user_option {
        Some(x) => Ok(x),
        None => Err(Error::Forbidden),
    }?;
    if let Some(required_roles) = image.required_roles.clone() {
        if required_roles
            .iter()
            .filter(|role| user.has_role_or_admin(UserRole::from((*role).clone())))
            .count()
            > 0
        {
            return get_file(&image, &req);
        }
    }
    if user.has_role_or_admin(UserRole::Default) {
        return get_file(&image, &req);
    }
    Err(Error::Forbidden)
}

fn get_file(image: &Image, req: &HttpRequest) -> Result<HttpResponse, Error> {
    let file_path = PathBuf::from(image.local_file_name.clone());
    if file_path.exists() {
        let file = NamedFile::open(file_path).expect("Cannot open file");
        return Ok(file.into_response(req));
    }
    Err(Error::BadRequest)
}

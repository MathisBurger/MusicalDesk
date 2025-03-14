pub enum UserRole {
    Admin,
}

impl ToString for UserRole {
    fn to_string(&self) -> String {
        match self {
            Self::Admin => "admin".to_string(),
        }
    }
}

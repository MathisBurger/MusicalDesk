use crate::models::generic::{Error, UserRole};

pub fn validate_roles(input: &Vec<String>) -> Result<(), Error> {
    for role in input {
        UserRole::try_from(role)?;
    }
    Ok(())
}

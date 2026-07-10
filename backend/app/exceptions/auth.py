class AuthenticationError(Exception):
    """Raised when user authentication fails."""


class UserAlreadyExistsError(Exception):
    """Raised when email or username already exists."""


class InvalidCredentialsError(Exception):
    """Raised when login credentials are invalid."""


class UserNotFoundError(Exception):
    """Raised when a user cannot be found."""
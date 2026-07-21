from pathlib import Path
import shutil
import uuid

from fastapi import HTTPException, UploadFile, status


ALLOWED_EXTENSIONS = {".txt", ".csv", ".json"}

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

UPLOAD_DIRECTORY = Path("storage/uploads")

def validate_extension(filename: str) -> str:
    extension = Path(filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file type. Only .txt, .csv and .json are allowed.",
        )

    return extension

def get_file_size(upload_file: UploadFile) -> int:
    """
    Calculate the size of the uploaded file in bytes.
    The file pointer is reset after reading.
    """
    upload_file.file.seek(0, 2)  # Move to end of file
    size = upload_file.file.tell()
    upload_file.file.seek(0)     # Reset pointer to beginning
    return size

def validate_file_size(file_size: int) -> None:
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds the maximum limit of 10 MB.",
        )
    
def generate_filename(extension: str) -> str:
    return f"{uuid.uuid4()}{extension}"

def ensure_upload_directory() -> None:
    UPLOAD_DIRECTORY.mkdir(parents=True, exist_ok=True)

def save_file(
    upload_file: UploadFile,
    stored_filename: str,
) -> str:

    ensure_upload_directory()

    destination = UPLOAD_DIRECTORY / stored_filename

    with destination.open("wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)

    return str(destination)

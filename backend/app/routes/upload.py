# app/routes/upload.py
from fastapi import APIRouter, File, UploadFile, HTTPException
from pathlib import Path
import shutil
import uuid
from datetime import datetime

router = APIRouter(prefix="/upload", tags=["Upload"])

# Directory untuk menyimpan file upload
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

@router.post("/image")
async def upload_image(file: UploadFile = File(...)):
    """
    Upload gambar untuk limbah
    """
    # Validasi extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Format file tidak didukung. Gunakan: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # Validasi ukuran file
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="Ukuran file terlalu besar. Maksimal 5MB"
        )

    # Generate unique filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    unique_id = str(uuid.uuid4())[:8]
    filename = f"{timestamp}_{unique_id}{file_ext}"
    file_path = UPLOAD_DIR / filename

    # Save file
    try:
        with open(file_path, "wb") as f:
            f.write(contents)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Gagal menyimpan file: {str(e)}"
        )

    # Return URL
    file_url = f"/uploads/{filename}"
    return {
        "filename": filename,
        "url": file_url,
        "size": len(contents)
    }

package handlers

import (
	"fmt"
	"image"
	_ "image/jpeg" // Register JPEG decoder
	_ "image/png"  // Register PNG decoder
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"path"
	"path/filepath"

	"github.com/HugoSmits86/nativewebp"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

func fileNameForId(settings *HandlerSettings, imageId uuid.UUID) string {
	return path.Join(filepath.ToSlash(settings.ImagesDir), imageId.String()+".webp")
}

func isValidImageType(contentType string) bool {
	validTypes := []string{
		"image/jpeg",
		"image/jpg",
		"image/png",
		"image/webp",
	}

	for _, validType := range validTypes {
		if contentType == validType {
			return true
		}
	}
	return false
}

func convertImage(image image.Image, settings *HandlerSettings) (imageUuid uuid.UUID, err error) {
	fileUuid := uuid.New()
	fileName := fileNameForId(settings, fileUuid)

	dir := filepath.Dir(fileName)
	err = os.MkdirAll(dir, os.ModeDir)
	if err != nil {
		return fileUuid, err
	}

	f, err := os.Create(fileName)
	if err != nil {
		return fileUuid, err
	}
	defer f.Close()

	err = nativewebp.Encode(f, image, nil)
	if err != nil {
		log.Fatalf("Error encoding image to WebP: %v", err)
	}

	return fileUuid, nil
}

func storeWebp(file multipart.File, settings *HandlerSettings) (imageUuid uuid.UUID, err error) {
	fileUuid := uuid.New()
	fileName := fileNameForId(settings, fileUuid)

	dir := filepath.Dir(fileName)
	err = os.MkdirAll(dir, os.ModeDir)
	if err != nil {
		return fileUuid, err
	}

	f, err := os.Create(fileName)
	if err != nil {
		return fileUuid, err
	}
	defer f.Close()
	io.Copy(f, file)

	return fileUuid, nil
}

func ImageUploadHandler(settings *HandlerSettings) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()
		r.ParseForm()
		imageFile, header, err := r.FormFile("image")
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("Error reading file"))
			return
		}
		defer imageFile.Close()

		contentType := header.Header.Get("Content-Type")
		if !isValidImageType(contentType) {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("Invalid file type. Only JPEG, PNG and webp are supported"))
			return
		}

		if contentType == "image/webp" {
			id, uploadErr := storeWebp(imageFile, settings)
			if uploadErr != nil {
				w.WriteHeader(http.StatusBadRequest)
				w.Write([]byte("Error storing file"))
				return
			}
			w.WriteHeader(http.StatusOK)
			w.Write([]byte(id.String()))
			return
		}

		_, err = imageFile.Seek(0, 0)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("Error seeking file"))
			return
		}
		img, imgType, err := image.Decode(imageFile)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("Error decoding file"))
			return
		}
		fmt.Printf("Image uploaded with type: %s\n", imgType)

		id, uploadErr := convertImage(img, settings)
		if uploadErr != nil {
			w.Write([]byte("something wen't wrong!!"))
		} else {
			imgUrl := settings.HostingUrl + "/api/images/" + id.String()
			w.Header().Set("Location", imgUrl)
			w.WriteHeader(http.StatusCreated)
			w.Write([]byte(imgUrl))
		}
	}
}

func ImageDownloadHandler(settings *HandlerSettings) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		imageId := chi.URLParam(r, "imageId")
		imageUuid, err := uuid.Parse(imageId)
		if err != nil {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte("Invalid image id"))
			return
		}

		imageFilePath := fileNameForId(settings, imageUuid)
		file, err := os.Open(imageFilePath)
		if err != nil {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte("Image not found"))
			return
		}
		defer file.Close()

		w.Header().Set("Content-Type", "image/webp")
		w.Header().Set("Content-Disposition", "attachment; filename="+imageUuid.String()+".webp")

		_, err = io.Copy(w, file)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Something went wrong"))
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}

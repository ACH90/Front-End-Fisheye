// Classes spécifiques pour chaque type de média
class ImageMedia {
  constructor(mediaItem) {
    this.mediaItem = mediaItem;
  }

  createElement() {
    const img = document.createElement("img");
    img.setAttribute(
      "src",
      `assets/media/${this.mediaItem.photographerId}/${this.mediaItem.image}`
    );
    img.setAttribute("alt", this.mediaItem.title);
    return img;
  }
}

class VideoMedia {
  constructor(mediaItem) {
    this.mediaItem = mediaItem;
  }

  createElement() {
    const video = document.createElement("video");
    video.setAttribute("controls", true);
    const source = document.createElement("source");
    source.setAttribute(
      "src",
      `assets/media/${this.mediaItem.photographerId}/${this.mediaItem.video}`
    );
    source.setAttribute("type", "video/mp4");
    video.appendChild(source);
    return video;
  }
}

// Factory pour créer le bon type de média
class MediaFactory {
  static createMedia(mediaItem) {
    const mediaType = MediaFactory.getMediaType(mediaItem);
    if (mediaType === "image") {
      return new ImageMedia(mediaItem);
    } else if (mediaType === "video") {
      return new VideoMedia(mediaItem);
    } else {
      throw new Error("Unknown media type");
    }
  }

  static getMediaType(mediaItem) {
    if (mediaItem.image && mediaItem.image.endsWith(".jpg")) {
      return "image";
    } else if (mediaItem.video && mediaItem.video.endsWith(".mp4")) {
      return "video";
    }
    return null;
  }
}

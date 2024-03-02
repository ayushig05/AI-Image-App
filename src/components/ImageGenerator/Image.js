import React from "react";
import "./Image.css";
import { useRef, useState } from "react";
import Default_image from "../assets/image.avif";

const Image = () => {
  const [imageUrl, setImageUrl] = useState(null);
  let inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const handleImageData = (data) => {
    if (Array.isArray(data) && data.length > 0 && data[0].url) {
      setImageUrl(data[0].url);
    } else {
      console.error("Invalid or empty data received from the API");
      setImageUrl(Default_image);
    }
  };

  const ImageGenerator = async () => {
    if (!inputRef.current.value) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer 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",
            "User-Agent": "Chrome",
          },
          body: JSON.stringify({
            prompt: inputRef.current.value,
            n: 1,
            size: "512x512",
          }),
        }
      );
      const data = await response.json();
      handleImageData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setImageUrl(Default_image);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-image-generator">
      <div className="header">
        AI Image <span>Generator</span>
      </div>
      <div className="img-loading">
        <div className="image">
          <img src={imageUrl || Default_image} alt=""></img>
        </div>
      </div>
      <div className="loading">
        <div className={loading ? "loading-bar-full" : "loading-bar"}></div>
        <div className={loading ? "loading-text" : "display-none"}>
          Loading...
        </div>
      </div>
      <div className="search-box">
        <input
          type="text"
          ref={inputRef}
          className="search-input"
          placeholder="Describe your image"
        />
        <div
          className="btn"
          onClick={ImageGenerator}>
        
          Generate
        </div>
      </div>
    </div>
  );
};

export default Image;

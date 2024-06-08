import React from "react";
import "./Image.css";
import { useRef, useState } from "react";
import Default_image from "../assets/image.avif";

const Image = () => {
  const [imageUrl, setImageUrl] = useState("/");
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const ImageGenerator = async () => {
    const token = "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";
    let retries = 3;
    let delay = 1000; 

    try {
      if (inputRef.current.value === "") {
        console.log("Input is empty");
        return 0;
      }
      setLoading(true);
      setError(null);

      while (retries > 0) {
        console.log("Attempting fetch, retries left:", retries);
        const response = await fetch(
          "https://api-inference.huggingface.co/models/Melonie/text_to_image_finetuned",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "User-Agent": "Chrome",
            },
            body: JSON.stringify({
              inputs: inputRef.current.value,
              parameters: {
                n: 1,
                size: "512x512",
              },
            }),
          }
        );

        console.log("Response status:", response.status);
        if (response.status === 503) {
          const data = await response.json();
          console.log("Model loading data:", data);
          setError(`Model is loading. Estimated time: ${data.estimated_time} seconds.`);
          await sleep(delay);
          retries -= 1;
          delay *= 2;
        } 
        else if (response.ok) {
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          setImageUrl(imageUrl);
          setError(null);
          setLoading(false);
          return;
        } 
        else {
          const errorData = await response.json();
          console.error("Error data:", errorData);
          setError(errorData.error || "An error occurred while generating the image.");
          setLoading(false);
          return;
        }
      }

      setError("Model is still loading. Please try again later.");
      setLoading(false);
    } 
    catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data. Please try again later.");
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
          <img src={imageUrl === "/" ? Default_image : imageUrl} alt=""></img>
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
          onClick={() => { ImageGenerator() }}
        >
          Generate
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Image;

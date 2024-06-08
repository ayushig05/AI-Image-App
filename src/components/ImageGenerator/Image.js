import React from "react";
import "./Image.css";
import { useRef, useState } from "react";
import Default_image from "../assets/image.avif";

const Image = () => {
  const [imageUrl, setImageUrl] = useState("/");
  let inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const ImageGenerator = async () => {
    const token = "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";
    try{
      if (inputRef.current.value === "") {
       return 0;
      } 
      setLoading(true);
      const response = await fetch(
       "https://api-inference.huggingface.co/models/Melonie/text_to_image_finetuned",
       {
          method: "POST",
          headers: {
           "Content-Type": "application/json",
            Authorization: Bearer `${token}`,
            "User-Agent": "Chrome",
          },
          body: JSON.stringify({
            prompt: `${inputRef.current.value}`,
            n: 1,
            size: "512x512"
          }),
        }
      );
      let data = await response.json();
      console.log(data);
      if (data && data.data && data.data.length > 0) {
        let data_array = data.data;
        setImageUrl(data_array[0].url);
      } 
      else {
        console.error("data.data is undefined or empty");
      }
      setLoading(false);
    } 
    catch (error) {
      console.error("Error fetching data:", error);
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
          <img src={imageUrl==="/" ? Default_image : imageUrl} alt=""></img>
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
          onClick={() => {ImageGenerator()}}
        >
          Generate
        </div>
      </div>
    </div>
  );
};

export default Image;
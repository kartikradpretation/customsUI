"use client";
import React, { useState } from "react";
import "./buyServicePlans.css";

const BuyServicePlans = () => {
  const sliderData = [
    {
      name: "Mike",
      role: "Web3 Developer",
      img: "https://picsum.photos/id/237/200/300",
    },
    {
      name: "Samite",
      role: "WordPress Developer",
      img: "https://picsum.photos/200/300",
    },
    {
      name: "Hashi",
      role: "Java Developer",
      img: "https://picsum.photos/200/300",
    },
    {
      name: "Kaity",
      role: "Web Developer",
      img: "https://picsum.photos/200/300",
    },
    {
      name: "Lauren",
      role: "PHP Developer",
      img: "https://picsum.photos/200/300",
    },
    {
      name: "Ryan",
      role: "SEO Developer",
      img: "https://picsum.photos/200/300",
    },
    {
      name: "Dakes",
      role: "SQL Developer",
      img: "https://picsum.photos/200/300",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(3); // Default active image index (4th image)

  const handleImageClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section className="slider-container">
      <div className="slider-images">
        {sliderData.map((item, index) => (
          <div
            key={index}
            className={`slider-img ${activeIndex === index ? "active" : ""}`}
            onClick={() => handleImageClick(index)}
          >
            <img src={item.img} alt={item.name} />
            
            
          </div>
        ))}
      </div>
    </section>
  );
};

export default BuyServicePlans;

"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { getServicePlanList } from "@/src/api/user";
import {
  currencyOptions,
  SupportPlanInterface,
} from "@/src/app/admin/dashboard/serviceplan/utils";
import FeatureList from "./FeatureList";

const BuyServicePlans = () => {
  const [servicePlanList, setServicePlanList] = useState<
    SupportPlanInterface[]
  >([]);

  const { servicePlanListData, isServicePlanListSuccess } =
    getServicePlanList();

  useEffect(() => {
    if (isServicePlanListSuccess) {
      setServicePlanList(servicePlanListData.data || []);
    }
  }, [isServicePlanListSuccess, servicePlanListData]);

  const getCurrencySymbol = (currencyKey: string) => {
    const currency = currencyOptions.find((opt) => opt.key === currencyKey);
    return currency?.value || ""; // Default to an empty string if not found
  };

  return (
    <Box
      sx={{
        backgroundImage: "linear-gradient(to top, #6c63ff, #000)",
        color: "#fff",
        py: 5,
        width: "100%",
      }}
    >
      <Box textAlign="center" sx={{ mb: 5 }}>
        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
          Explore the World
        </Typography>
        <Typography variant="h6">Watch anything, anytime</Typography>
        <Typography variant="h5" sx={{ mt: 2 }}>
          Choose your pricing plan
        </Typography>
      </Box>

      {/* Swiper for 3D Card Slider */}
      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Pagination]}
        style={{ width: "80%", height: "600px", margin: "0 auto" }}
      >
        {servicePlanList.map((plan, index) => (
          <SwiperSlide
            key={index}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              maxWidth: "300px",
            }}
          >
            <Card
              sx={{
                bgcolor: "#1e1e1e",
                color: "#fff",
                textAlign: "center",
                p: 2,
                height: "500px",
                cursor: "pointer",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
              }}
            >
              {index === 2 && (
                <Typography
                  sx={{
                    fontSize: "12px",
                    bgcolor: "#4caf50",
                    py: 0.5,
                    borderRadius: "4px",

                    maxWidth: "100px",
                    mx: "auto",
                  }}
                >
                  Best Choice
                </Typography>
              )}
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    mb: 2,
                    textTransform: "uppercase",
                  }}
                >
                  {plan.name}
                </Typography>
                <Typography variant="h4" sx={{ mb: 2 }}>
                  {getCurrencySymbol(plan.currency)} {plan.pricing}
                </Typography>
                <FeatureList features={plan.features} />
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#6c63ff",
                    color: "#fff",
                    borderRadius: "50px",
                    px: 4,
                    mt: 2,
                    "&:hover": {
                      bgcolor: "green",
                    },
                  }}
                >
                  Choose Plan
                </Button>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default BuyServicePlans;

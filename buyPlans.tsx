"use client";

import React, { useEffect, useRef, useState } from "react";
import "./buyServicePlans.css";
import { Typography, Card, CardContent, Button } from "@mui/material";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { getServicePlanList, updateServicePlan } from "@/src/api/user";
import { SupportPlanInterface } from "@/src/app/admin/dashboard/serviceplan/utils";
import FeatureList from "./FeatureList";
import { ccst, cst, getCurrencySymbol, styleButton } from "./utils";
import SuccessModal from "../successModal.tsx/sucessModal";

const BuyServicePlans = () => {
  const { servicePlanListData, isServicePlanListSuccess } =
    getServicePlanList();
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const {
    isSuccessUpdateServicePlan,
    updateServicePlanMutate,
    responseUpdateServicePlan,
  } = updateServicePlan();

  const [servicePlanList, setServicePlanList] = useState<
    SupportPlanInterface[]
  >([]);

  const [assignSuccess, setAssignSuccess] = useState(false);

  const swiperRef = useRef<SwiperRef | null>(null);
  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.swiper.update();
    }
  }, [servicePlanList]);

  useEffect(() => {
    if (isServicePlanListSuccess) {
      setServicePlanList(servicePlanListData.data || []);
    }
  }, [isServicePlanListSuccess, servicePlanListData]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    // Dynamically load the PayPal SDK script
    const script = document.createElement("script");
    script.src =
      "https://www.paypal.com/sdk/js?client-id=ARADI0nmT68US88NK9n9OOCjY0pUyF6irwMqnrsfJCYjEdy502o38gjKsKzFdq1TM4nDqcbIf2MKjb-3";
    script.async = true;
    script.onload = () => setPaypalLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePlansUpdate = (plan: SupportPlanInterface) => {
    try {
      // Call backend API to create a Razorpay order
      // const { data: razorpayOrder } = await createRazorpayOrder({
      //   amount: plan.pricing * 100, // Convert amount to paise
      //   currency: plan.currency,
      // });
      const options = {
        key: "YOUR_RAZORPAY_KEY_ID", // Use your Razorpay Test Key ID
        amount: plan.pricing * 100, // Amount in paise
        currency: plan.currency,
        name: "Test Company",
        description: `Test Purchase for ${plan.name}`,
        order_id: `order_${Math.random().toString(36).substring(2, 15)}`, // Use random order ID
        handler: function (response: any) {
          // Simulate success response
          console.log("Payment successful:", response);
          console.log(
            "Random Order ID used:",
            `order_${Math.random().toString(36).substring(2, 15)}`
          );
          updateServicePlanMutate(plan._id);
        },
        prefill: {
          name: "Test User",
          email: "test.user@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#F37254",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error in Razorpay payment:", error);
    }
  };

  const handleAssignSuccessClose = () => {
    setAssignSuccess(false);
  };

  const handlePayPalPayment = (plan: SupportPlanInterface) => {
    const paypal = (window as any).paypal;

    paypal
      .Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: plan.pricing.toString(), // Plan price
                },
                description: plan.name, // Plan name
              },
            ],
          });
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            alert(`Payment Successful! Transaction ID: ${details.id}`);
            console.log(details);
          });
        },
        onError: (err: any) => {
          console.error("PayPal Checkout Error:", err);
          alert("Payment failed. Please try again.");
        },
      })
      .render(`#paypal-button-container-${plan._id}`);
  };

  return (
    <Swiper
      ref={swiperRef}
      effect={"coverflow"}
      grabCursor={true}
      centeredSlides={true}
      loop={true}
      slidesPerView={3}
      coverflowEffect={{
        rotate: 30,
        stretch: 50,
        depth: 150,
        modifier: 1,
        slideShadows: true,
      }}
      modules={[EffectCoverflow, Pagination, Navigation]}
      className="swiper_container"
    >
      <SuccessModal
        open={assignSuccess}
        message="Service Plan Updated Successfully"
        onClose={handleAssignSuccessClose}
      />
      {servicePlanList.map((plan, index) => (
        <SwiperSlide key={index}>
          <Card sx={cst}>
            {index === 2 && (
              <Typography
                sx={{
                  fontSize: "12px",
                  bgcolor: "#4caf50",
                  py: 0.5,
                  borderRadius: "4px",
                  maxWidth: "100px",
                }}
              >
                Best Choice
              </Typography>
            )}
            <CardContent>
              <Typography variant="h5" sx={ccst}>
                {plan.name}
              </Typography>
              <Typography variant="h4" sx={{ mb: 2 }}>
                {getCurrencySymbol(plan.currency)} {plan.pricing}
              </Typography>
              <FeatureList features={plan.features} />
              <div
                id={`paypal-button-container-${plan._id}`}
                style={{ margin: "10px 0" }}
              />
              <Button
                variant="contained"
                sx={styleButton}
                onClick={() => handlePayPalPayment(plan)}
              >
                Choose Plan
              </Button>
            </CardContent>
          </Card>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default BuyServicePlans;
function handleRazorpayPayment(plan: SupportPlanInterface) {
  throw new Error("Function not implemented.");
}

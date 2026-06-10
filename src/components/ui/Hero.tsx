"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import heroImage from "@/public/img-slide-3.jpg";
import "swiper/css/autoplay";
import "swiper/css";

export default function Hero() {
  return (
    <section className="">
      <Swiper
        autoplay={{
          delay: 13000,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
        className="mySwiper w-screen h-[90vw] relative overflow-hidden sm:h-[75vw] md:h-[40vw] xl:h-[600px]"
      >
        <SwiperSlide>
          <Link href="/collections/all" className="relative">
            <Image
              placeholder="blur"
              src={heroImage}
              className="w-full h-full object-cover object-top"
              alt="merch slide"
            />
          </Link>
        </SwiperSlide>
      </Swiper>
    </section>
  );
}

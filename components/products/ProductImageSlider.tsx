"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useState } from "react";
import FancyBox from "@/lib/FancyBoy";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper/modules";

export default function ProductImageSlider({
  coverImage,
  images,
  slug,
}: {
  coverImage: string;
  images?: string[];
  slug: string;
}) {
  return (
    <FancyBox
      options={{
        Thumbs: false,
        Carousel: {
          infinite: false,
        },
      }}
    >
      <div>
        <Swiper
          pagination={{
            dynamicBullets: true,
            clickable: true,
          }}
          spaceBetween={10}
          modules={[Pagination]}
          className="mySwiper"
        >
          <SwiperSlide>
            <Link
              href={coverImage}
              data-fancybox="gallery"
              className="cursor-zoom-in"
            >
              <Image
                src={coverImage}
                width={700}
                height={700}
                className="w-full rounded-2xl overflow-hidden"
                alt={slug}
              />
            </Link>
          </SwiperSlide>
          {images?.length! > 0 &&
            images?.map((image: string) => (
              <SwiperSlide key={image}>
                <Link
                  href={image}
                  data-fancybox="gallery"
                  className="cursor-zoom-in"
                >
                  <Image
                    src={image}
                    width={700}
                    height={700}
                    className="w-full rounded-2xl overflow-hidden"
                    alt={slug}
                  />
                </Link>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </FancyBox>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import FancyBox from "@/lib/FancyBoy";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";

// import required modules
import { Autoplay, EffectFade, Pagination } from "swiper/modules";

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
          draggable={true}
          loop={true}
          modules={[Pagination, Autoplay, EffectFade]}
          pagination={{
            dynamicBullets: true,
            clickable: true,
          }}
          autoplay={{
            delay: 13000,
            disableOnInteraction: false,
          }}
          effect="fade"
          spaceBetween={10}
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

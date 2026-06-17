"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import type { PublicRating } from "@/lib/types";

type FallbackReview = {
  name: string;
  review: string;
};

export function HomeReviews({ fallback }: { fallback: FallbackReview[] }) {
  const [ratings, setRatings] = useState<PublicRating[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadRatings() {
      const response = await fetch("/api/reviews", { cache: "no-store" });
      const data = (await response.json().catch(() => ({}))) as { ratings?: PublicRating[] };

      if (!cancelled) {
        setRatings(data.ratings ?? []);
      }
    }

    void loadRatings();

    return () => {
      cancelled = true;
    };
  }, []);

  const reviews = ratings.length
    ? ratings.map((rating, index) => ({
        id: rating.id,
        name: rating.customerName,
        review: rating.review,
        rating: rating.rating,
        serviceName: rating.serviceName,
      }))
    : fallback.map((item, index) => ({
        id: item.name,
        name: item.name,
        review: item.review,
        rating: 5,
        serviceName: "Verified home massage",
        index,
      }));

  return (
    <div className="mt-12 flex snap-x gap-5 overflow-x-auto pb-3">
      {reviews.map((review) => (
        <figure
          key={review.id}
          className="min-w-[82vw] snap-start rounded-lg border border-stone-200 bg-[#fbfaf5] p-5 shadow-sm sm:min-w-[380px] sm:p-6 dark:border-white/10 dark:bg-stone-950/60"
        >
          <div className="flex items-center gap-3">
            <div>
              <figcaption className="font-semibold">{review.name}</figcaption>
              <p className="mt-1 text-xs font-medium text-stone-500 dark:text-stone-400">
                {review.serviceName}
              </p>
              <p className="mt-1 flex gap-0.5 text-[#d5b46a]">
                {[1, 2, 3, 4, 5].map((item) => (
                  <Star
                    key={item}
                    className={item <= review.rating ? "fill-current" : ""}
                    size={14}
                  />
                ))}
              </p>
            </div>
          </div>
          <blockquote className="mt-5 text-sm leading-7 text-stone-600 dark:text-stone-300">
            &quot;{review.review}&quot;
          </blockquote>
        </figure>
      ))}
    </div>
  );
}

import { NextResponse } from "next/server";

// ━━━ CONFIG ━━━
const PLACE_ID = process.env.GOOGLE_PLACE_ID || "";
const API_KEY = process.env.GOOGLE_PLACES_API_KEY || "";
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24h in ms

// ━━━ IN-MEMORY CACHE ━━━
let cache: { data: unknown; ts: number } | null = null;

// Fallback reviews (hardcoded current Google reviews)
const FALLBACK = {
  rating: 5.0,
  totalReviews: 4,
  reviews: [
    { author: "NOON", rating: 5, text: "J'ai eu l'occasion d'assister à une présentation par le maître lui-même. Je n'ai qu'une seule hâte c'est de pouvoir l'utiliser très prochainement. Un réel BANGER 🔥🔥🔥🔥", time: "" },
    { author: "Mehdi R.", rating: 5, text: "Après une journée de formation, j'ai pu prendre en main l'outils, corresponds à mes attentes, le formateur est pro et dispose d'une expertise en lien avec l'analyse institutionnelle, je suis très satisfait, je recommande 👌", time: "" },
    { author: "Assy Steven", rating: 5, text: "Super outil qui complète grandement l'analyse et permet de meilleure entrée", time: "" },
    { author: "Mucahid Bilgili", rating: 5, text: "Un outil incroyable !", time: "" },
  ],
  source: "fallback",
};

export async function GET() {
  // Return cache if fresh
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return NextResponse.json(cache.data, {
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600" },
    });
  }

  // If no API key or Place ID configured, return fallback
  if (!API_KEY || !PLACE_ID) {
    return NextResponse.json(FALLBACK, {
      headers: { "Cache-Control": "public, s-maxage=86400" },
    });
  }

  try {
    // Google Places API (New) — Place Details
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${PLACE_ID}?languageCode=fr`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": API_KEY,
          "X-Goog-FieldMask": "rating,userRatingCount,reviews",
        },
      }
    );

    if (!res.ok) {
      console.error("Google Places API error:", res.status, await res.text());
      return NextResponse.json(FALLBACK);
    }

    const data = await res.json();

    const result = {
      rating: data.rating || 5.0,
      totalReviews: data.userRatingCount || 0,
      reviews: (data.reviews || []).map((r: { authorAttribution?: { displayName?: string }; rating?: number; text?: { text?: string }; relativePublishTimeDescription?: string }) => ({
        author: r.authorAttribution?.displayName || "Anonymous",
        rating: r.rating || 5,
        text: r.text?.text || "",
        time: r.relativePublishTimeDescription || "",
      })),
      source: "google",
    };

    // Update cache
    cache = { data: result, ts: Date.now() };

    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600" },
    });
  } catch (err) {
    console.error("Google Places fetch error:", err);
    return NextResponse.json(FALLBACK);
  }
}

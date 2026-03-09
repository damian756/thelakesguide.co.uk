import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/_next/image"],
        disallow: [
          "/api/",
          "/dashboard/",
          "/admin/",
          "/_next/static/",
        ],
      },
    ],
    sitemap: "https://www.thelakesguide.co.uk/sitemap.xml",
    host: "https://www.thelakesguide.co.uk",
  };
}

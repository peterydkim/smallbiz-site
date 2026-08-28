import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://aplusservices.example.com/sitemap.xml", // TODO(peter): real domain
  };
}

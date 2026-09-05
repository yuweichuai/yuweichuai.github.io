import type { NextConfig } from "next";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isGitHubProjectPage =
  process.env.GITHUB_ACTIONS === "true" &&
  repositoryName.length > 0 &&
  !repositoryName.endsWith(".github.io");
const basePath = isGitHubProjectPage ? `/${repositoryName}` : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

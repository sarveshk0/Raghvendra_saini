/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode is disabled because swagger-ui-react (ModelCollapse)
  // internally uses legacy lifecycle methods (componentWillMount etc.) that
  // are incompatible with React 19 Strict Mode and produce noisy warnings.
  // Strict Mode is a development-only feature and has zero production impact.
  reactStrictMode: false,
};

export default nextConfig;

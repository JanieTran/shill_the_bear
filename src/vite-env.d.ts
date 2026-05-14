/// <reference types="vite/client" />

// Allow importing .svg files as URL strings
declare module '*.svg' {
  const src: string;
  export default src;
}

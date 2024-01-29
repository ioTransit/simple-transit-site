import GoTriangle from "./gotriangle-logo.png";

export const GoTriangleLogo = ({ height }: { height: number }) => (
  <img src={GoTriangle} style={{ height }} alt="GoTriangle Logo" />
);

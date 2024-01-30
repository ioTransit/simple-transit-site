import GoTriangle from "./gotriangle-logo.png";
import Headshot from "./headshot.jpg";
export const HeadshotImage = () => {
  return (
    <img
      src={Headshot}
      alt="Walter Jenkins headshot"
      className="rounded-full"
      style={{ height: 180 }}
    />
  );
};

export const GoTriangleLogo = ({ height }: { height: number }) => (
  <img src={GoTriangle} style={{ height }} alt="GoTriangle Logo" />
);

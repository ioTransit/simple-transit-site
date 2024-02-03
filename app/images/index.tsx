import GoTriangle from "./gotriangle-logo.png";
import TransitChatVert from "./TransitChat-vert.png";
import TransitChat from "./TransitChat.svg";

export const GoTriangleLogo = ({ className }: { className: string }) => (
  <img src={GoTriangle} alt="GoTriangle Logo" className={className} />
);

export const TransitChatVeritcalLogo = ({
  className,
}: {
  className: string;
}) => (
  <img src={TransitChatVert} alt="TransitChat Logo" className={className} />
);

export const TransitChatLogo = ({ className }: { className: string }) => (
  <img src={TransitChat} alt="TransitChat Logo" className={className} />
);

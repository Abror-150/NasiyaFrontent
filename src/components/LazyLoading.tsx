import { LogoImage } from "../assets/images/index";

export default function Loading() {
  return (
    <div className="containers">
      <div className=" h-screen flex items-center justify-center">
        <img
          src={LogoImage}
          alt="Logo"
          width={80}
          height={80}
          className="animate-spin"
        />
        <div></div>
      </div>
    </div>
  );
}

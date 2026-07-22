import Image from "next/image";

export default function Logo({ size = 40, invert = false }: { size?: number; invert?: boolean }) {
  return (
    <Image
      src="/noqt-logo-transparent.png"
      alt="noqt"
      width={size * 2.5}
      height={size}
      className={`object-contain shrink-0${invert ? " invert" : ""}`}
      priority
    />
  );
}

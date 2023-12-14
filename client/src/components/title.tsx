import Link from "next/link";
import Image from "next/image";
const Title = () => {
  return (
    <Link href={"/"}>
      <div className="flex flex-row gap-3 items-center justify-center">
        <Image
          src="/images/logo_polinema.png"
          alt="Logo Polinema"
          width={60}
          height={60}
        />
        <h1 className="text-4xl font-bold">
          TOPSIS METHOD DECISION SUPPORT SYSTEM
        </h1>
      </div>
    </Link>
  );
};

export default Title;

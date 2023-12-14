import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (

          <nav className="mt-2 flex gap-3 items-center justify-center">
          <Link href={"/criteria"}>Kriteria</Link>
          <Link href={"/alternative"}>Alternatif</Link>
          <Link href={"/matrixvalue"}>Nilai Matriks</Link>
          <Link href={"resulttopsis"}>Hasil Topsis</Link>
        </nav>
  );
};

export default Navbar;

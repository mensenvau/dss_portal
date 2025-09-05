import Link from "next/link";
import { Button } from "../ui/button";

export default function Hero() {
  return (
    <section className="w-full py-20">
      <div className="mx-auto max-w-7xl text-left px-4">
        <h1 className="md:w-1/2 text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Empower Your Business with Data Solutions</h1>
        <p className="md:w-1/2 md:text-xl text-neutral-700 mb-6">Writing good code is an art, but clean data is an inspiration!</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-left">
          <Link href={process.env.NEXT_PUBLIC_FOR_CLIENT as any} target="_blank">
            <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-none transition" variant="default">
              Hire Top Talent
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

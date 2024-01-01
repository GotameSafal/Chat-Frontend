import { Caveat } from "next/font/google";
const caveat = Caveat({ subsets: ["latin"], weight: ['500'] });
export default function Home() {
  return (
    <>
      <div className="relative h-[calc(100vh-66px)] flex items-center sm:items-start  justify-center flex-col gap-1 w-screen">
        <div
          className="absolute top-0 left-0 w-full h-full -z-10"
          style={{
            background: `#f6f6f6 url("/bg1.jpg") no-repeat center center/cover`,
          }}
        ></div>
        <h1 className={`${caveat.className} sm:ps-[7rem] text-[5rem] text-gray-600items-center sm:justify-start   justify-center `}>{`Let's Chat`}</h1>
        <p className={`${caveat.className} sm:ps-[7rem] text-2xl`}>Connect Anywhere Anytime</p>
      </div>
    </>
  );
}

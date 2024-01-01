import { Ubuntu } from "next/font/google";
import "@styles/globals.css";
import { Providers } from "@/components/Providers";
import { cookies } from "next/headers";
import Navbar from "@components/Navbar";
const ubuntu = Ubuntu({ subsets: ["latin"], weight: ["400", "500"] });

export const metadata = {
  title: "Let's Chat",
  description: "Connect Anywhere Anytime",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  const cookieStore = cookies();
  let cookie = cookieStore.get("LetsChat");
  return (
    <html lang="en">
      <body className={ubuntu.className}>
        <Providers>
          <Navbar cookie={cookie} />
          {children}
        </Providers>
      </body>
    </html>
  );
}

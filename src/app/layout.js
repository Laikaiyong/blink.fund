import "./globals.css";
import { Providers } from "./providers";
import NavbarWithSimpleLinks from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

export const metadata = {
  title: "Blink.Fund",
  description: "Quadratic Funding with Blink Sharable",
  metadataBase: new URL('https://blink-fund.vercel.app/'),
  openGraph: {
		title: "Blink.Fund",
		description: "Quadratic Funding with Blink Sharable",
		images: ["/logo.png"],
	},
	twitter: {
		card: "summary",
		site: "Blink.Fund",
		title: "Blink.Fund",
		description: "Suadratic Funding with Blink Sharable",
		images: ["/logo.png"],
	},
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Providers>
        <body className="bg-[#191623] text-white">
        <div className="min-h-screen bg-[#191623] text-white">
          <NavbarWithSimpleLinks />
          <div className="flex flex-col md:flex-row">
        <aside className="w-full md:w-64 bg-[#191623] p-4 sticky left-0">
          <Sidebar />
        </aside>
          {children}
        </div>
        </div>
        </body>
      </Providers>
    </html>
  );
}

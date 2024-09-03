import "./globals.css";
import { WalletProviders } from "./providers";
import NavbarWithSimpleLinks from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

export const metadata = {
  title: "Blink.Fund",
  description: "Quadratic Funding with Blink Sharable",
  metadataBase: new URL('https://blink-fund.pages.dev/'),
  openGraph: {
		title: "Blink.Fund",
		description: "Solving Food Waste Issues to Pet Food Manufacturing with Blockchain",
		images: ["/haiwanlab.jpg"],
	},
	twitter: {
		card: "summary",
		site: "Blink.Fund",
		title: "Blink.Fund",
		description: "Solving Food Waste Issues to Pet Food Manufacturing with Blockchain",
		images: ["/haiwanlab.jpg"],
	},
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <WalletProviders>
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
      </WalletProviders>
    </html>
  );
}

import "./globals.css";
import {ThemeProvider} from "@/components/theme-provider";

export const metadata = {
    title: "유튜브 다운로드",
    description: "유튜브 다운로드 광고좀 그만 넣자",
};

export default function RootLayout({children}) {
    return (
        <html lang="ko" suppressHydrationWarning>
        <head/>
        <body className={"antialiased"}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            <main>{children}</main>
        </ThemeProvider>
        </body>
        </html>
    );
}

import './globals.css';
export const metadata = {
    title: 'PK Workspace & Finance Manager - Muhammed Anas P K',
    description: 'Comprehensive academic, life, finance, and design studio management hub for Muhammed Anas P K with Next.js, Node.js, and MongoDB Atlas.',
};
export default function RootLayout({ children }) {
    return (<html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Amiri:wght@400;700&display=swap" rel="stylesheet"/>
      </head>
      <body className="bg-[#f4f5f0] text-[#141716] antialiased selection:bg-[#c4f223] selection:text-[#141716]">
        {children}
      </body>
    </html>);
}

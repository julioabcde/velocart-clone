'use client';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t py-2 overflow-hidden">
      <div className="relative w-full h-6 overflow-hidden">
        <div
          className={`absolute left-0 top-0 whitespace-nowrap text-sm text-blue-800 font-medium min-w-[200%] animate-marquee`}
        >
          <span className="mr-16">
            © {year} Velocart. All Rights Reserved. | Terima kasih telah mengunjungi kami! | Selamat berbelanja!
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

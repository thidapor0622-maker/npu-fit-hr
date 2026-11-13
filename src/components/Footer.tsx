export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-xs w-full mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
        <div>
          <p className="font-semibold text-slate-200">
            © คณะเทคโนโลยีอุตสาหกรรม มหาวิทยาลัยนครพนม
          </p>
          <p className="text-slate-400 text-[11px] mt-0.5">
            Faculty of Industrial Technology, Nakhon Phanom University
          </p>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <a
            href="https://www.npu.ac.th"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-400 transition-colors flex items-center gap-1.5"
          >
            <i className="fa-solid fa-globe text-xs"></i> เว็บไซต์หลัก มรพ.
          </a>
          <span className="text-slate-700">|</span>
          <a
            href="mailto:fit@npu.ac.th"
            className="hover:text-sky-400 transition-colors flex items-center gap-1.5"
          >
            <i className="fa-solid fa-envelope text-xs"></i> ติดต่อคณะ
          </a>
          <span className="text-slate-700">|</span>
          <a
            href="/admin"
            className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-emerald-400 font-medium"
          >
            <i className="fa-solid fa-table-cells text-xs"></i> จัดการฐานข้อมูล (Google Sheets)
          </a>
        </div>
      </div>
    </footer>
  );
}

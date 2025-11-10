// src/components/Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-10 text-sm text-gray-600">
        <div>© {new Date().getFullYear()} AIMUSE</div>
        <div className="space-x-3">
          <Link to="/terms" className="hover:underline">이용약관</Link>
          <Link to="/privacy" className="hover:underline">개인정보</Link>
          <Link to="/creators" className="hover:underline">크리에이터</Link>
        </div>
      </div>
    </footer>
  );
}

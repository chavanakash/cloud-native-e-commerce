export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="container-page py-10 grid sm:grid-cols-3 gap-8">
        <div>
          <h4 className="font-semibold mb-3">AmazingStore</h4>
          <p className="text-sm text-slate-600">
            Hand-picked products, delightful design, and a seamless checkout.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><a href="#">About</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Terms</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Support</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Returns</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200">
        <div className="container-page py-4 text-sm text-slate-500">
          © {new Date().getFullYear()} AmazingStore. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
